/**
 * @format
 * @flow
 */

import React, {useCallback} from 'react';
import {connect} from 'react-redux';

import type {State} from '../redux';
import {dismiss} from '../redux';
import type {Survey} from '../types';

import Iterate from '../iterate';
import Prompt from './Prompt';
import SurveyView from './Survey';

type Props = {
  dispatchDismiss: () => void,
  showPrompt: boolean,
  showSurvey: boolean,
  survey: Survey,
};

const PromptOrSurvey: (Props) => React$Node = ({
  dispatchDismiss,
  survey,
  showPrompt,
  showSurvey,
}) => {
  const dismissed = useCallback(() => {
    dispatchDismiss();
    Iterate.api.dismissed(survey);
  }, [dispatchDismiss, survey]);

  if (showPrompt) {
    return <Prompt onDismiss={dismissed} />;
  } else if (showSurvey) {
    return <SurveyView onDismiss={dismissed} />;
  }

  return null;
};

const mapStateToProps = ({showPrompt, showSurvey, survey}: State) => ({
  showPrompt,
  showSurvey,
  survey,
});

const mapDispatchToProps = (dispatch) => ({
  dispatchDismiss: () => {
    dispatch(dismiss());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PromptOrSurvey);
