import type { Question, Response } from './types';

// Message received from the webview
export const EventMessageTypes = {
  Close: 'close',
  Response: 'response',
};

export type InteractionEvent = 'response' | 'dismiss';

export type InteractionEventData =
  | InteractionEventResponseData
  | InteractionEventClosedData;

export type InteractionEventResponseData = {
  response: Response;
  question: Question;
};

export type InteractionEventClosedData = {
  source: InteractionEventClosedSource;
};

export type InteractionEventClosedSource = 'prompt' | 'survey';

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
};

class InteractionEventCallbacks {
  // Default the callbacks to no-ops
  onResponse = (_response: Response, _question: Question) => {};
  onEvent = (_type: InteractionEvent, _data: InteractionEventData) => {};
}

export const Callbacks = new InteractionEventCallbacks();
