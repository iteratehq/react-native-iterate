import type {
  ProgressEventMessageData,
  Question,
  Response,
  Survey,
} from './types';

// Message received from the webview
export const EventMessageTypes = {
  Close: 'close',
  Progress: 'progress',
  Response: 'response',
  SurveyComplete: 'survey-complete',
};

export const InteractionEventTypes = {
  Dismiss: 'dismiss',
  Displayed: 'displayed',
  Response: 'response',
  SurveyComplete: 'survey-complete',
};

export type InteractionEventTypeKeys = keyof typeof InteractionEventTypes;
export type InteractionEventTypeValues =
  typeof InteractionEventTypes[InteractionEventTypeKeys];

export type InteractionEventData =
  | InteractionEventResponseData
  | InteractionEventDismissData
  | InteractionEventSurveyCompleteData
  | InteractionEventDisplayedData;

export type InteractionEventResponseData = {
  response: Response;
  question: Question;
  survey: Survey;
};

export type InteractionEventDismissData = {
  progress?: ProgressEventMessageData;
  source: InteractionEventSource;
  survey: Survey;
};

export type InteractionEventDisplayedData = {
  source: InteractionEventSource;
  survey: Survey;
};

export type InteractionEventSurveyCompleteData = {
  survey: Survey;
};

export type InteractionEventSource = 'prompt' | 'survey';

export const InteractionEvents = {
  Dismiss: (
    source: InteractionEventSource,
    survey: Survey,
    progress?: ProgressEventMessageData
  ) => {
    let data: InteractionEventDismissData = { source, survey };
    if (progress != null) {
      data.progress = progress;
    }
    Callbacks.onEvent('dismiss', data);
  },
  PromptDisplayed: (survey: Survey) => {
    Callbacks.onEvent('displayed', { source: 'prompt', survey });
  },
  Response: (survey: Survey, response?: Response, question?: Question) => {
    if (response != null && question != null) {
      Callbacks.onResponse(response, question, survey);
      Callbacks.onEvent('response', { response, question, survey });
    }
  },
  SurveyComplete: (survey: Survey) => {
    Callbacks.onEvent('survey-complete', { survey });
  },
  SurveyDisplayed: (survey: Survey) => {
    Callbacks.onEvent('displayed', { source: 'survey', survey });
  },
};

class InteractionEventCallbacks {
  // Default the callbacks to no-ops
  onResponse = (
    _response: Response,
    _question: Question,
    _survey: Survey
  ) => {};
  onEvent = (
    _type: InteractionEventTypeValues,
    _data: InteractionEventData
  ) => {};
}

export const Callbacks = new InteractionEventCallbacks();
