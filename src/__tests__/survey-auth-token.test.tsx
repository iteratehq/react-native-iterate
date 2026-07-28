/**
 * Regression test for iteratehq/react-native-iterate#320.
 *
 * The survey WebView must deliver the auth_token to the page. The page reads it from
 * window.location.search on every API request, so the token has to be present in the
 * document URL natively. We load the page as static HTML (file:// origin, so bundled
 * custom fonts resolve) and carry the query string in the WebView's baseUrl.
 *
 * The previous approach loaded the HTML with a blank baseUrl and tried to re-add the
 * query string after load via injectedJavaScript (history.pushState) — WebKit rejects
 * pushState on the opaque origin, so the token was dropped and every answer was recorded
 * against a new anonymous user.
 */
import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { WebView } from 'react-native-webview';

// Render the survey component directly with props (bypass redux connect).
jest.mock('react-redux', () => ({
  connect: () => (Component: unknown) => Component,
}));

// SafeAreaProvider only renders children once it has measured a frame, which
// never happens under the test renderer; this mock renders children immediately.
jest.mock('react-native-safe-area-context', () => {
  const react = require('react');
  const passthrough = (props: { children?: unknown }) =>
    react.createElement(react.Fragment, null, props.children);
  return {
    SafeAreaProvider: passthrough,
    SafeAreaView: passthrough,
    useSafeAreaInsets: () => ({ top: 0, left: 0, right: 0, bottom: 0 }),
  };
});

jest.mock('react-native-webview', () => {
  const react = require('react');
  return {
    WebView: (props: Record<string, unknown>) =>
      react.createElement('WebView', props),
  };
});

import Survey from '../components/Survey';
import Iterate from '../iterate';
import type { Survey as SurveyType } from '../types';

const survey: SurveyType = {
  company_id: 'company-1',
  id: 'survey-1',
  title: 'Test survey',
};

const USER_TOKEN = 'user-auth-token-abc123';

const baseProps = {
  eventTraits: {},
  onDismiss: () => {},
  presentationStyle: 'pageSheet' as const,
  survey,
  userAuthToken: USER_TOKEN,
};

const renderSurvey = async () => {
  let tree!: TestRenderer.ReactTestRenderer;
  const SurveyComponent = Survey as unknown as React.ComponentType<
    typeof baseProps
  >;
  await act(async () => {
    tree = TestRenderer.create(<SurveyComponent {...baseProps} />);
  });
  // Let the fetched-HTML promise resolve so the WebView renders.
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
  return tree;
};

const getWebViewSource = (tree: TestRenderer.ReactTestRenderer) => {
  const webView = tree.root.findByType(WebView as never);
  return webView.props.source as { uri?: string; html?: string; baseUrl?: string };
};

describe('Survey auth token delivery (#320)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    Iterate.buttonFont = undefined;
    Iterate.surveyTextFont = undefined;
    global.fetch = jest.fn(() =>
      Promise.resolve({ text: () => Promise.resolve('<html></html>') })
    ) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    Iterate.buttonFont = undefined;
    Iterate.surveyTextFont = undefined;
  });

  it('carries the auth_token in a file:// baseUrl so it reaches window.location.search', async () => {
    const tree = await renderSurvey();
    const source = getWebViewSource(tree);

    // Static HTML load (file:// origin), not a direct URL load.
    expect(source.html).toBeDefined();
    expect(source.uri).toBeUndefined();

    // The query string — including the auth_token — is carried in the baseUrl.
    expect(source.baseUrl).toBeDefined();
    expect(source.baseUrl).toMatch(/^file:\/\/\//);
    expect(source.baseUrl).toContain(`auth_token=${USER_TOKEN}`);
  });

  it('still carries the auth_token when a custom font is configured', async () => {
    Iterate.buttonFont = {
      filename: 'WorkSans-Regular.ttf',
      postscriptName: 'WorkSans-Regular',
    };

    const tree = await renderSurvey();
    const source = getWebViewSource(tree);

    expect(source.html).toBeDefined();
    expect(source.baseUrl).toContain(`auth_token=${USER_TOKEN}`);
    expect(source.baseUrl).toContain('buttonFontPath=');
  });
});
