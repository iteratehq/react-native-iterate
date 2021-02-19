/**
 * @format
 * @flow
 */

import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import type { State } from '../redux';
import { dismiss } from '../redux';
import type { Survey } from '../types';

import Iterate, { Dispatch } from '../iterate';
import Prompt from './Prompt';
import SurveyView from './Survey';

type Props = {
  dispatchDismiss: () => void;
  showPrompt: boolean;
  showSurvey: boolean;
  survey?: Survey;
};

const PromptOrSurvey: (Props: Props) => JSX.Element | null = ({
  dispatchDismiss,
  survey,
  showPrompt,
  showSurvey,
}) => {
  const dismissed = useCallback(() => {
    dispatchDismiss();
    if (Iterate.api != null && survey != null) {
      Iterate.api.dismissed(survey);
    }
  }, [dispatchDismiss, survey]);

  if (showPrompt) {
    return <Prompt onDismiss={dismissed} />;
  } else if (showSurvey) {
    return <SurveyView onDismiss={dismissed} />;
  }

  return null;
};

const mapStateToProps = ({ showPrompt, showSurvey, survey }: State) => ({
  showPrompt,
  showSurvey,
  survey,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatchDismiss: () => {
    dispatch(dismiss());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PromptOrSurvey);
