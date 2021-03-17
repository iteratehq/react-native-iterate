/**
 * @format
 * @flow
 */

import React from 'react';
import { Provider } from 'react-redux';

import { store } from '../iterate';
import SafeArea from '../safearea';

import PromptOrSurvey from './PromptOrSurvey';

interface Props {
  children: React.ReactNode;
}

const IterateProvider = ({ children }: Props) => {
  // Get safe area
  const safeArea =
    SafeArea.provider != null
      ? SafeArea.provider()
      : { top: 0, right: 0, bottom: 0, left: 0 };

  return (
    <>
      {children}
      <Provider store={store}>
        <PromptOrSurvey safeAreaInsets={safeArea} />
      </Provider>
    </>
  );
};

export default IterateProvider;
