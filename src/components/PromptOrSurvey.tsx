/**
 * @format
 * @flow
 */

import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';

import type { State } from '../redux';
import { dismiss, setSafeAreaInsets } from '../redux';
import type { ProgressEventMessageData, Survey } from '../types';
import type { EdgeInsets } from '../types';

import Iterate from '../iterate';
import type { Dispatch } from '../iterate';
import Prompt from './Prompt';
import SurveyView from './Survey';
import { InteractionEvents } from '../interaction-events';
import type { InteractionEventSource } from '../interaction-events';

type Props = {
  dispatchDismiss: () => void;
  dispatchSafeAreaInsets: (safeAreaInsets: EdgeInsets) => void;
  safeAreaInsets: EdgeInsets;
  showPrompt: boolean;
  showSurvey: boolean;
  survey?: Survey;
};

const PromptOrSurvey: (Props: Props) => JSX.Element | null = ({
  dispatchDismiss,
  dispatchSafeAreaInsets,
  safeAreaInsets,
  survey,
  showPrompt,
  showSurvey,
}) => {
  const dismissed = useCallback(
    (source: InteractionEventSource, progress?: ProgressEventMessageData) => {
      dispatchDismiss();
      if (Iterate.api != null && survey != null) {
        Iterate.api.dismissed(survey);
      }

      InteractionEvents.Dismiss(source, survey as Survey, progress);
    },
    [dispatchDismiss, survey]
  );

  useEffect(() => {
    if (safeAreaInsets != null) {
      dispatchSafeAreaInsets(safeAreaInsets);
    }
  }, [dispatchSafeAreaInsets, safeAreaInsets]);

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
  dispatchSafeAreaInsets: (safeAreaInsets: EdgeInsets) => {
    dispatch(setSafeAreaInsets(safeAreaInsets));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(PromptOrSurvey);
