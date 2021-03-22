import type { Question, Response } from './types';

// Message received from the webview
export const EventMessageTypes = {
  Close: 'close',
  Response: 'response',
  SurveyComplete: 'survey-complete',
};

export const InteractionEventTypes = {
  Dismiss: 'dismiss',
  Response: 'response',
  SurveyComplete: 'survey-complete',
};

export type InteractionEventTypeKeys = keyof typeof InteractionEventTypes;
export type InteractionEventTypeValues = typeof InteractionEventTypes[InteractionEventTypeKeys];

export type InteractionEventData =
  | InteractionEventResponseData
  | InteractionEventClosedData
  | InteractionEventSurveyCompleteData;

export type InteractionEventResponseData = {
  response: Response;
  question: Question;
};

export type InteractionEventClosedData = {
  source: InteractionEventClosedSource;
};

export type InteractionEventClosedSource = 'prompt' | 'survey';

export type InteractionEventSurveyCompleteData = {};

export const InteractionEvents = {
  Dismiss: (source: InteractionEventClosedSource) => {
    Callbacks.onEvent('dismiss', { source });
  },
  Response: (response?: Response, question?: Question) => {
    if (response != null && question != null) {
      Callbacks.onResponse(response, question);
      Callbacks.onEvent('response', { response, question });
    }
  },
  SurveyComplete: () => {
    Callbacks.onEvent('survey-complete', {});
  },
};

class InteractionEventCallbacks {
  // Default the callbacks to no-ops
  onResponse = (_response: Response, _question: Question) => {};
  onEvent = (
    _type: InteractionEventTypeValues,
    _data: InteractionEventData
  ) => {};
}

export const Callbacks = new InteractionEventCallbacks();
