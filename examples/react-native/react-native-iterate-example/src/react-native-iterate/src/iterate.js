/**
 * @format
 * @flow
 */

import {createStore} from 'redux';

import ApiClient from './api';
import {TriggerTypes, Version} from './constants';
import {reducer, showPrompt, showSurvey} from './redux';
import type {Survey} from './types';

export const store = createStore(reducer);

class Iterate {
  api: ApiClient;

  configure = (apiKey: string) => {
    this.api = new ApiClient(apiKey);
  };

  sendEvent = (eventName: string) => {
    return this.api
      .embed({
        app: {version: Version},
        event: {name: eventName},
        type: 'mobile',
      })
      .then((response) => {
        if (response != null && response.survey != null) {
          // If the survey has a timer trigger, wait that number of seconds before showing the survey
          if (
            response.triggers != null &&
            response.triggers.length > 0 &&
            response.triggers[0].type === TriggerTypes.Seconds
          ) {
            const survey = response.survey;
            setTimeout(() => {
              this.dispatchShowSurveyOrPrompt(survey);
            }, (response.triggers[0].options.seconds || 0) * 1000);
          } else {
            this.dispatchShowSurveyOrPrompt(response.survey);
          }
        }

        return response;
      });
  };

  dispatchShowSurveyOrPrompt(survey: Survey) {
    if (survey.prompt != null) {
      store.dispatch(showPrompt(survey));
    } else {
      store.dispatch(showSurvey(survey));
    }
  }
}

export default new Iterate();
