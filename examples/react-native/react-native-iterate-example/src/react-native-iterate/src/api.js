/**
 * @format
 * @flow
 */

import type {
  ApiResponse,
  EmbedContext,
  EmbedResults,
  FetchResponse,
} from './types';

class ApiClient {
  apiKey: string;
  apiHost: string;

  constructor(apiKey: string, apiHost: string = 'https://iteratehq.com') {
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

  post = <T>(
    path: string,
    body: {},
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
