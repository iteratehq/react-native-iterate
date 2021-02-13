/**
 * @format
 * @flow
 */

import type {Survey} from './types';

// State
export type State = {
  +showSurvey: boolean,
  +showPrompt: boolean,
  +survey?: Survey,
};

const INITIAL_STATE = {
  showSurvey: false,
  showPrompt: false,
  survey: undefined,
};

// Actions
type Action = ShowPromptAction | ShowSurveyAction;

type ShowPromptAction = {type: 'SHOW_PROMPT', survey: Survey};
type ShowSurveyAction = {type: 'SHOW_SURVEY', survey: Survey};

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
