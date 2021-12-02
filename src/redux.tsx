import type { EdgeInsets } from './types';
import type {
  EventTraits,
  EventTraitsMap,
  PresentationStyle,
  Survey,
  UserTraits,
} from './types';

// State
export type State = {
  companyAuthToken?: string;
  dismissed: boolean;
  displayedSurveyResponseId?: number;
  eventTraits: EventTraitsMap;
  lastUpdated?: number;
  preview?: boolean;
  previewSurveyId?: string;
  presentationStyle: PresentationStyle;
  safeAreaInsets: EdgeInsets;
  showSurvey: boolean;
  showPrompt: boolean;
  survey?: Survey;
  userAuthToken?: string;
  userTraits?: UserTraits;
};

const INITIAL_STATE = {
  companyAuthToken: undefined,
  dismissed: false,
  displayedSurveyResponseId: undefined,
  eventTraits: {},
  lastUpdated: undefined,
  preview: false,
  previewSurveyId: undefined,
  presentationStyle: 'pageSheet' as PresentationStyle,
  safeAreaInsets: { top: 0, left: 0, right: 0, bottom: 0 },
  showSurvey: false,
  showPrompt: false,
  survey: undefined,
  userAuthToken: undefined,
  userTraits: {},
};

// Actions
type Action =
  | DismissAction
  | ResetAction
  | SetCompanyAuthToken
  | SetEventTraits
  | SetLastUpdated
  | SetPresentationStyle
  | SetPreview
  | SetSafeAreaInsets
  | SetUserAuthToken
  | SetUserTraits
  | ShowPromptAction
  | ShowSurveyAction;

type DismissAction = { type: 'DISMISS' };
type ResetAction = { type: 'RESET' };
type SetCompanyAuthToken = { type: 'SET_COMPANY_AUTH_TOKEN'; token: string };
type SetEventTraits = {
  type: 'SET_EVENT_TRAITS';
  responseId: number;
  traits: EventTraits;
};
type SetLastUpdated = { type: 'SET_LAST_UPDATED'; lastUpdated: number };
type SetPresentationStyle = {
  type: 'SET_PRESENTATION_STYLE';
  presentationStyle: PresentationStyle;
};
type SetPreview = { type: 'SET_PREVIEW'; enabled: boolean; surveyId?: string };
type SetSafeAreaInsets = {
  type: 'SET_SAFE_AREA_INSETS';
  safeAreaInsets: EdgeInsets;
};
type SetUserAuthToken = { type: 'SET_USER_AUTH_TOKEN'; token: string };
type SetUserTraits = { type: 'SET_USER_TRAITS'; traits: UserTraits };
type ShowPromptAction = {
  type: 'SHOW_PROMPT';
  responseId?: number;
  survey: Survey;
};
type ShowSurveyAction = {
  type: 'SHOW_SURVEY';
  responseId?: number;
  survey: Survey;
};

export const dismiss = (): DismissAction => ({ type: 'DISMISS' });

export const reset = (): ResetAction => ({ type: 'RESET' });

export const setCompanyAuthToken = (token: string): SetCompanyAuthToken => ({
  type: 'SET_COMPANY_AUTH_TOKEN',
  token,
});

export const setEventTraits = (
  traits: EventTraits,
  responseId: number
): SetEventTraits => ({
  type: 'SET_EVENT_TRAITS',
  responseId,
  traits,
});

export const setLastUpdated = (lastUpdated: number): SetLastUpdated => ({
  type: 'SET_LAST_UPDATED',
  lastUpdated,
});

export const setPresentationStyle = (
  presentationStyle: PresentationStyle
): SetPresentationStyle => ({
  type: 'SET_PRESENTATION_STYLE',
  presentationStyle,
});

export const setPreview = (
  enabled: boolean,
  surveyId?: string
): SetPreview => ({
  type: 'SET_PREVIEW',
  enabled,
  surveyId,
});

export const setSafeAreaInsets = (
  safeAreaInsets: EdgeInsets
): SetSafeAreaInsets => ({
  type: 'SET_SAFE_AREA_INSETS',
  safeAreaInsets,
});

export const setUserAuthToken = (token: string): SetUserAuthToken => ({
  type: 'SET_USER_AUTH_TOKEN',
  token,
});

export const setUserTraits = (traits: UserTraits): SetUserTraits => ({
  type: 'SET_USER_TRAITS',
  traits,
});

export const showPrompt = (
  survey: Survey,
  responseId?: number
): ShowPromptAction => ({
  type: 'SHOW_PROMPT',
  responseId,
  survey,
});

export const showSurvey = (
  survey: Survey,
  responseId?: number
): ShowSurveyAction => ({
  type: 'SHOW_SURVEY',
  responseId,
  survey,
});

// Reducer
export const reducer = (state: State = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case 'DISMISS':
      return {
        ...state,
        dismissed: true,
        displayedSurveyResponseId: undefined,
        eventTraits: {},
        showSurvey: false,
        showPrompt: false,
      };
    case 'RESET':
      // We don't need to reset the company API key, so we'll
      // reset to the initial state and cherry pick that
      return { ...INITIAL_STATE, companyAuthToken: state.companyAuthToken };
    case 'SET_COMPANY_AUTH_TOKEN':
      return {
        ...state,
        companyAuthToken: action.token,
      };
    case 'SET_EVENT_TRAITS':
      return {
        ...state,
        eventTraits: {
          [`${action.responseId}`]: action.traits,
        },
      };
    case 'SET_LAST_UPDATED':
      return {
        ...state,
        lastUpdated: action.lastUpdated,
      };
    case 'SET_PRESENTATION_STYLE':
      return {
        ...state,
        presentationStyle: action.presentationStyle,
      };
    case 'SET_PREVIEW':
      return {
        ...state,
        preview: action.enabled,
        previewSurveyId: action.surveyId,
      };
    case 'SET_SAFE_AREA_INSETS':
      return {
        ...state,
        safeAreaInsets: action.safeAreaInsets,
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
        displayedSurveyResponseId:
          action.responseId != null
            ? action.responseId
            : state.displayedSurveyResponseId,
        survey: action.survey,
        showPrompt: true,
      };
    case 'SHOW_SURVEY':
      return {
        ...state,
        displayedSurveyResponseId:
          action.responseId != null
            ? action.responseId
            : state.displayedSurveyResponseId,
        survey: action.survey,
        showSurvey: true,
        showPrompt: false,
      };
    default:
      return state;
  }
};
