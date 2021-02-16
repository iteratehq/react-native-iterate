/**
 * @format
 * @flow
 */

export type EmbedContext = {
  app?: AppContext,
  event?: EventContext,
  event_traits?: EventTraitsContext,
  targeting?: TargetingContext,
  tracking?: TrackingContext,
  trigger?: TriggerContext,
  type?: EmbedType,
  user_traits?: UserTraitsContext,
};

export type AppContext = {
  url_scheme?: string,
  version?: string,
};

export type EventContext = {
  name?: string,
};

export type EventTraitValue = string | number | boolean;
export type EventTraitsContext = {[string]: EventTraitValue};

export type EventTraits = EventTraitsContext;

export type TargetingContext = {
  frequency?: Frequency,
  survey_id?: string,
};

export type Frequency = 'always';

export type TrackingContext = {
  last_updated?: number,
};

export type TriggerContext = {
  survey_id?: string,
  type?: TriggerContextType,
};

export type TriggerContextType = 'manual';

export type EmbedType = 'mobile';

export type UserTraitValue = string | number | boolean;
export type UserTraitsContext = {[string]: UserTraitValue};

export type UserTraits = UserTraitsContext;

export type Survey = {
  company_id: string,
  id: string,
  prompt?: Prompt,
};

export type Prompt = {
  message: string,
  button_text: string,
};

export type FetchResponse<T> = {
  json: () => T,
};

export type ApiResponseError = {
  code: number,
  message?: string,
  type: string,
  user_message?: string,
};

export type ApiResponse<ResultsType> = {
  errors?: ApiResponseError[],
  error?: any,
  results?: ResultsType,
};

export type EmbedResults = {
  auth?: Auth,
  survey?: Survey,
  triggers?: Trigger[],
  tracking?: Tracking,
};

export type Auth = {
  token: string,
};

export type Trigger = {
  type: TriggerType,
  options: TriggerOptions,
};

export type TriggerType = 'exit' | 'scroll' | 'seconds';

export type TriggerOptions = {
  seconds?: number,
};

export type Tracking = {
  last_updated: number,
};

export type EventMessage = {
  type: string,
  data: EventMessagesData,
};

export type EventMessagesData = {
  userInitiated?: boolean,
  question?: Question,
  response?: Response,
};

export type Response = {value: any};

export type Question = {
  id: string,
  prompt: string,
};
