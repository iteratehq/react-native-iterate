/**
 * @format
 * @flow
 */

import type {EventTraits, Survey, UserTraits} from './types';

// State
export type State = {
  +companyAuthToken?: string,
  +dismissed: boolean,
  +eventTraits?: EventTraits,
  +lastUpdated?: number,
  +preview?: boolean,
  +previewSurveyId?: string,
  +showSurvey: boolean,
  +showPrompt: boolean,
  +survey?: Survey,
  +userAuthToken?: string,
  +userTraits?: UserTraits,
};

const INITIAL_STATE = {
  companyAuthToken: undefined,
  dismissed: false,
  eventTraits: {},
  lastUpdated: undefined,
  preview: false,
  previewSurveyId: undefined,
  showSurvey: false,
  showPrompt: false,
  survey: undefined,
  userAuthToken: undefined,
  userTraits: {},
};

// Actions
type Action =
  | DismissAction
  | SetCompanyAuthToken
  | SetEventTraits
  | SetLastUpdated
  | SetPreview
  | SetUserAuthToken
  | SetUserTraits
  | ShowPromptAction
  | ShowSurveyAction;

type DismissAction = {type: 'DISMISS'};
type SetCompanyAuthToken = {type: 'SET_COMPANY_AUTH_TOKEN', token: string};
type SetEventTraits = {type: 'SET_EVENT_TRAITS', traits: EventTraits};
type SetLastUpdated = {type: 'SET_LAST_UPDATED', lastUpdated: number};
type SetPreview = {type: 'SET_PREVIEW', enabled: boolean, surveyId?: string};
type SetUserAuthToken = {type: 'SET_USER_AUTH_TOKEN', token: string};
type SetUserTraits = {type: 'SET_USER_TRAITS', traits: UserTraits};
type ShowPromptAction = {type: 'SHOW_PROMPT', survey: Survey};
type ShowSurveyAction = {type: 'SHOW_SURVEY', survey: Survey};

export const dismiss = (): DismissAction => ({type: 'DISMISS'});

export const setCompanyAuthToken = (token: string): SetCompanyAuthToken => ({
  type: 'SET_COMPANY_AUTH_TOKEN',
  token,
});

export const setEventTraits = (traits: EventTraits): SetEventTraits => ({
  type: 'SET_EVENT_TRAITS',
  traits,
});

export const setLastUpdated = (lastUpdated: number): SetLastUpdated => ({
  type: 'SET_LAST_UPDATED',
  lastUpdated,
});

export const setPreview = (
  enabled: boolean,
  surveyId?: string,
): SetPreview => ({
  type: 'SET_PREVIEW',
  enabled,
  surveyId,
});

export const setUserAuthToken = (token: string): SetUserAuthToken => ({
  type: 'SET_USER_AUTH_TOKEN',
  token,
});

export const setUserTraits = (traits: UserTraits): SetUserTraits => ({
  type: 'SET_USER_TRAITS',
  traits,
});

export const showPrompt = (survey: Survey): ShowPromptAction => ({
  type: 'SHOW_PROMPT',
  survey,
});

export const showSurvey = (survey: Survey): ShowSurveyAction => ({
  type: 'SHOW_SURVEY',
  survey,
});

// Reducer
export const reducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case 'DISMISS':
      return {
        ...state,
        dismissed: true,
        showSurvey: false,
        showPrompt: false,
      };
    case 'SET_COMPANY_AUTH_TOKEN':
      return {
        ...state,
        companyAuthToken: action.token,
      };
    case 'SET_EVENT_TRAITS':
      return {
        ...state,
        eventTraits: action.traits,
      };
    case 'SET_LAST_UPDATED':
      return {
        ...state,
        lastUpdated: action.lastUpdated,
      };
    case 'SET_PREVIEW':
      return {
        ...state,
        preview: action.enabled,
        previewSurveyId: action.surveyId,
      };
    case 'SET_USER_AUTH_TOKEN':
      return {
        ...state,
        userAuthToken: action.token,
      };
    case 'SET_USER_TRAITS':
      return {
        ...state,
        userTraits: action.traits,
      };
    case 'SHOW_PROMPT':
      return {
        ...state,
        survey: action.survey,
        showPrompt: true,
      };
    case 'SHOW_SURVEY':
      return {
        ...state,
        survey: action.survey,
        showSurvey: true,
        showPrompt: false,
      };
    default:
      return state;
  }
};
