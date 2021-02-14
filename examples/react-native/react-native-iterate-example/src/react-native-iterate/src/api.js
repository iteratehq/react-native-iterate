/**
 * @format
 * @flow
 */

import type {
  ApiResponse,
  EmbedContext,
  EmbedResults,
  FetchResponse,
  Survey,
} from './types';
import {DefaultHost} from './constants';

class ApiClient {
  apiKey: string;
  apiHost: string;

  constructor(apiKey: string, apiHost: string = DefaultHost) {
    this.apiKey = apiKey;
    this.apiHost = apiHost;
  }

  embed = (embedContext: EmbedContext): Promise<EmbedResults> => {
    return this.post<EmbedResults>('/surveys/embed', embedContext)
      .then((response) => response.json())
      .then((response) => {
        console.log('Response: ', response);
        return response.results;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  displayed = (survey: Survey) => {
    this.post(`/surveys/${survey.id}/displayed`);
  };

  dismissed = (survey: Survey) => {
    this.post(`/surveys/${survey.id}/dismiss`);
  };

  post = <T>(
    path: string,
    body: {} = {},
  ): Promise<FetchResponse<ApiResponse<T>>> => {
    console.log(`POST: ${this.apiHost}/api/v1${path}`, body);

    return fetch(`${this.apiHost}/api/v1${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
    });
  };
}

export default ApiClient;
