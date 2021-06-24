import { createStore } from 'redux';

import ApiClient from './api';
import { TriggerTypes, Version } from './constants';
import {
  Callbacks,
  InteractionEventTypeValues,
  InteractionEventData,
  InteractionEvents,
  resetInteractionEventCallbacks,
} from './interaction-events';
import {
  reducer,
  reset,
  setCompanyAuthToken,
  setEventTraits,
  setLastUpdated,
  setPreview,
  setUserAuthToken,
  setUserTraits,
  showPrompt,
  showSurvey,
} from './redux';
import type {
  EdgeInsets,
  EmbedContext,
  EventTraits,
  Response,
  Survey,
  TargetingContext,
  Question,
  UserTraits,
} from './types';
import Storage, { Keys, StorageInterface } from './storage';
import SafeArea from './safearea';

export const store = createStore(reducer);
export type Dispatch = typeof store.dispatch;

export type EventData = { eventName: string; eventTraits?: EventTraits };

class Iterate {
  api?: ApiClient;
  apiKey?: string;
  eventQueue: EventData[] = [];
  initialized: boolean = false;
  initializedIdentify: boolean = false;
  initializedSendEvent: boolean = false;

  // Minimal initialization that is expected to be called on app boot
  init = ({
    apiKey,
    safeArea,
    storage,
  }: {
    apiKey: string;
    safeArea: () => EdgeInsets;
    storage: StorageInterface;
  }) => {
    this.apiKey = apiKey;
    SafeArea.provider = safeArea;
    Storage.provider = storage;
    this.initialized = true;
  };

  // Lazily initialize dependencies for identify
  initIdentify = async () => {
    if (!this.initialized) {
      throw 'Error calling Iterate.identify(). Make sure you call Iterate.init() before calling identify, see README for details';
    }

    if (!this.initializedIdentify) {
      const userTraits: {} | null = await Storage.getItem(
        Keys.userTraits
      ).catch((err) => {
        throw `Error getting user attributes from secure storage: ${err}`;
      });

      // Initialize the user traits
      if (userTraits != null) {
        store.dispatch(setUserTraits(userTraits));
      }

      this.initializedIdentify = true;
    }
  };

  identify = async (userTraits: UserTraits) => {
    await this.initIdentify();

    if (userTraits != null) {
      store.dispatch(setUserTraits(userTraits));
      Storage.setItem(Keys.userTraits, userTraits);
    }
  };

  onResponse = (
    userOnResponseCallback: (
      response: Response,
      question: Question,
      survey: Survey
    ) => void
  ) => {
    Callbacks.onResponse = userOnResponseCallback;
  };

  onEvent = (
    userOnEventCallback: (
      type: InteractionEventTypeValues,
      data: InteractionEventData
    ) => void
  ) => {
    Callbacks.onEvent = userOnEventCallback;
  };

  preview = (surveyId?: string) => {
    store.dispatch(setPreview(true, surveyId));
  };

  // Reset all stored user data. Commonly called on logout so apps can support
  // multiple user accounts
  reset = () => {
    // Reset the interaction events. Surveys opened with a delay, might otherwise
    // lead to callbacks
    resetInteractionEventCallbacks();
    // Only clear the storage if it has been initialized. This allows the reset
    // method to be called before Init, giving consumers of the SDK more flexibility
    if (Storage.provider != null) {
      Storage.clear();
    }

    store.dispatch(reset());

    // Reset the api client to the company api key
    this.api = new ApiClient(this.apiKey);
  };

  // Lazily initialize dependencies for sendEvent
  initSendEvent = async (): Promise<void | undefined> => {
    if (!this.initialized) {
      throw 'Error calling Iterate.sendEvent(). Make sure you call Iterate.init() before calling sendEvent, see README for details';
    }

    if (!this.initializedSendEvent) {
      // Initialize company api key and api
      if (this.apiKey == null) {
        throw 'Error sending event to Iterate: missing api key. Make sure you call Iterate.init() before calling sendEvent, see README for details';
      }
      this.api = new ApiClient(this.apiKey);
      store.dispatch(setCompanyAuthToken(this.apiKey));

      // Initialize authToken
      const authToken: string | null = await Storage.getItem(
        Keys.authToken
      ).catch((err) => {
        throw `Error getting authToken from secure storage: ${err}`;
      });
      if (authToken != null) {
        this.api = new ApiClient(authToken);
        store.dispatch(setUserAuthToken(authToken));
      }

      // Initialize last updated timestamp
      const lastUpdated: string | null = await Storage.getItem(
        Keys.lastUpdated
      ).catch((err) => {
        throw `Error getting last updated timestamp from secure storage: ${err}`;
      });
      if (lastUpdated != null) {
        store.dispatch(setLastUpdated(parseInt(lastUpdated, 10)));
      }

      // Initialize user traits
      await this.initIdentify();

      this.initializedSendEvent = true;
    }
  };

  sendEvent = async (eventName: string, eventTraits?: EventTraits) => {
    // Lazily initialize dependencies for sendEvent
    await this.initSendEvent();

    const state = store.getState();

    // Set the embed context
    const embedContext: EmbedContext = {
      app: { version: Version },
      event: { name: eventName },
      type: 'mobile',
    };

    // Embed context user traits
    if (Object.keys(state.userTraits || {}).length > 0) {
      embedContext.user_traits = state.userTraits;
    }

    // Embed context last updated
    if (state.lastUpdated != null) {
      embedContext.tracking = {
        last_updated: state.lastUpdated,
      };
    }

    // Embed context preview mode
    if (state.preview === true) {
      const targeting: TargetingContext = {
        frequency: 'always',
      };

      if (state.previewSurveyId != null) {
        targeting.survey_id = state.previewSurveyId;
      }

      embedContext.targeting = targeting;
    }

    if (this.api == null) {
      return;
    }

    return this.api.embed(embedContext).then((response) => {
      if (response == null) {
        return;
      }

      // Set the user auth token if one is returned
      if (response.auth != null && response.auth.token != null) {
        const token = response.auth.token;
        this.api = new ApiClient(token);
        store.dispatch(setUserAuthToken(token));
        Storage.setItem(Keys.authToken, token);
      }

      // Set the last updated time if one is returned
      if (response.tracking != null && response.tracking.last_updated != null) {
        const lastUpdated = response.tracking.last_updated;
        store.dispatch(setLastUpdated(lastUpdated));
        Storage.setItem(Keys.lastUpdated, lastUpdated);
      }

      if (response.survey != null) {
        // Generate a unique id (current timestamp) for this survey display so we ensure we associate
        // the correct event traits with it
        const responseId = new Date().getTime();

        if (eventTraits != null) {
          store.dispatch(setEventTraits(eventTraits, responseId));
        }

        // If the survey has a timer trigger, wait that number of seconds before showing the survey
        if (
          response.triggers != null &&
          response.triggers.length > 0 &&
          response.triggers[0].type === TriggerTypes.Seconds
        ) {
          const survey = response.survey;
          setTimeout(() => {
            this.dispatchShowSurveyOrPrompt(survey, responseId);
          }, (response.triggers[0].options.seconds || 0) * 1000);
        } else {
          this.dispatchShowSurveyOrPrompt(response.survey, responseId);
        }
      }

      return response;
    });
  };

  dispatchShowSurveyOrPrompt(survey: Survey, responseId: number) {
    if (survey.prompt != null) {
      store.dispatch(showPrompt(survey, responseId));
      InteractionEvents.PromptDisplayed(survey);
    } else {
      store.dispatch(showSurvey(survey, responseId));
      InteractionEvents.SurveyDisplayed(survey);
    }

    if (this.api == null) {
      return;
    }

    this.api.displayed(survey);
  }
}

export default new Iterate();
