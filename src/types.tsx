export type EmbedContext = {
  app?: AppContext;
  event?: EventContext;
  event_traits?: EventTraitsContext;
  targeting?: TargetingContext;
  tracking?: TrackingContext;
  trigger?: TriggerContext;
  type?: EmbedType;
  user_traits?: UserTraitsContext;
};

export type AppContext = {
  url_scheme?: string;
  version?: string;
};

export type EventContext = {
  name?: string;
};

export type EventTraitValue = string | number | boolean | Date;
export type EventTraits = { [key: string]: EventTraitValue };

export type EventTraitContextValue =
  | string
  | number
  | boolean
  | { type: string; value: number };
export type EventTraitsContext = { [key: string]: EventTraitContextValue };

// A map from the response id to the events associated with that response
export type EventTraitsMap = {
  [key: string]: EventTraits;
};

export type TargetingContext = {
  frequency?: Frequency;
  survey_id?: string;
};

export type Frequency = 'always';

export type TrackingContext = {
  last_updated?: number;
};

export type TriggerContext = {
  survey_id?: string;
  type?: TriggerContextType;
};

export type TriggerContextType = 'manual';

export type EmbedType = 'mobile';

export const TraitTypes = {
  Date: 'date',
  Number: 'number',
  String: 'string',
  Boolean: 'boolean',
};

export type UserTraitValue = string | number | boolean | Date;
export type UserTraits = { [key: string]: UserTraitValue };

export type UserTraitContextValue =
  | string
  | number
  | boolean
  | { type: string; value: number };
export type UserTraitsContext = { [key: string]: UserTraitContextValue };

export type EdgeInsets = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type PresentationStyle =
  | 'fullScreen'
  | 'pageSheet'
  | 'formSheet'
  | 'overFullScreen';

export type Survey = {
  color?: string;
  color_dark?: string;
  company_id: string;
  id: string;
  prompt?: Prompt;
  title: string;
};

export type Prompt = {
  message: string;
  button_text: string;
};

export type FetchResponse<T> = {
  json: () => T;
};

export type ApiResponseError = {
  code: number;
  message?: string;
  type: string;
  user_message?: string;
};

export type ApiResponse<ResultsType> = {
  errors?: ApiResponseError[];
  error?: any;
  results?: ResultsType;
};

export type EmbedResults = {
  auth?: Auth;
  survey?: Survey;
  triggers?: Trigger[];
  tracking?: Tracking;
};

export type Auth = {
  token: string;
};

export type Trigger = {
  type: TriggerType;
  options: TriggerOptions;
};

export type TriggerType = 'exit' | 'scroll' | 'seconds';

export type TriggerOptions = {
  seconds?: number;
};

export type Tracking = {
  last_updated: number;
};

export type EventMessage = {
  type: string;
  data: EventMessagesData;
};

export type EventMessagesData =
  | DismissEventMessageData
  | ResponseEventMessageData;

export type ResponseEventMessageData = {
  question?: Question;
  response?: Response;
};

export type DismissEventMessageData = {
  userInitiated?: boolean;
};

export type ProgressEventMessageData = {
  completed: number;
  total: number;
  currentQuestion?: Question;
};

export type Response = { value: any };

export type Question = {
  id: string;
  prompt: string;
};
