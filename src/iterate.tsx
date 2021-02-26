import { createStore } from 'redux';

import ApiClient from './api';
import { TriggerTypes, Version } from './constants';
import {
  reducer,
  reset,
  setEventTraits,
  setLastUpdated,
  setPreview,
  setUserAuthToken,
  setUserTraits,
  showPrompt,
  showSurvey,
} from './redux';
import type {
  EmbedContext,
  EventTraits,
  Response,
  Survey,
  TargetingContext,
  Question,
  UserTraits,
} from './types';
import Storage, { Keys } from './storage';

export const store = createStore(reducer);
export type Dispatch = typeof store.dispatch;

class Iterate {
  api?: ApiClient;
  eventQueue: string[] = [];
  initialized: boolean = false;
  onResponseCallback?: (Response: Response, Question: Question) => void;

  // Indicate that the client is fully initialized and ready to send events
  init = () => {
    this.initialized = true;
    this.eventQueue.forEach((event) => {
      this.sendEvent(event);
    });
  };

  configure = (apiKey: string) => {
    this.api = new ApiClient(apiKey);
  };

  identify = (userTraits?: UserTraits, eventTraits?: EventTraits) => {
    if (userTraits != null) {
      store.dispatch(setUserTraits(userTraits));
      Storage.setItem(Keys.userTraits, userTraits);
    }

    if (eventTraits != null) {
      store.dispatch(setEventTraits(eventTraits));
    }
  };

  onResponse = (
    onResponseCallback: (Response: Response, Question: Question) => void
  ) => {
    this.onResponseCallback = onResponseCallback;
  };

  preview = (surveyId?: string) => {
    store.dispatch(setPreview(true, surveyId));
  };

  // Reset all stored user data. Commonly called on logout so apps can support
  // multiple user accounts
  reset = () => {
    Storage.clear();
    store.dispatch(reset());
  };

  sendEvent = (eventName: string) => {
    // If the client hasn't been initialized yet (e.g. loading async data from local storage)
    // then queue up the events. Shouldn't have to wait more than a few milliseconds or less
    if (this.initialized !== true) {
      this.eventQueue.push(eventName);
      return;
    }

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
        store.dispatch(setUserAuthToken(token));
        Storage.setItem(Keys.authToken, token);
      }

      // Set the last updated time if one is returned
      if (response.tracking != null && response.tracking.last_updated != null) {
        const lastUpdated = response.tracking.last_updated;
        store.dispatch(setLastUpdated(lastUpdated));
        Storage.setItem(Keys.lastUpdated, lastUpdated);
      }

      if (response != null && response.survey != null) {
        // If the survey has a timer trigger, wait that number of seconds before showing the survey
        if (
          response.triggers != null &&
          response.triggers.length > 0 &&
          response.triggers[0].type === TriggerTypes.Seconds
        ) {
          const survey = response.survey;
          setTimeout(() => {
            this.dispatchShowSurveyOrPrompt(survey);
          }, (response.triggers[0].options.seconds || 0) * 1000);
        } else {
          this.dispatchShowSurveyOrPrompt(response.survey);
        }
      }

      return response;
    });
  };

  dispatchShowSurveyOrPrompt(survey: Survey) {
    if (survey.prompt != null) {
      store.dispatch(showPrompt(survey));
    } else {
      store.dispatch(showSurvey(survey));
    }

    if (this.api == null) {
      return;
    }

    this.api.displayed(survey);
  }
}

export default new Iterate();
