/**
 * @format
 * @flow
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Appearance,
  Modal,
  Platform,
  StyleSheet,
  View,
  useColorScheme,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors, DefaultHost, Themes } from '../constants';
import { EventMessageTypes, InteractionEvents } from '../interaction-events';
import type { InteractionEventSource } from '../interaction-events';
import type { State } from '../redux';
import type {
  EventMessage,
  PresentationStyle,
  ProgressEventMessageData,
  EventTraits,
  EventTraitsMap,
  ResponseEventMessageData,
  Survey,
} from '../types';
import Iterate from '../iterate';

type Props = {
  companyAuthToken?: string;
  displayedSurveyResponseId?: number;
  eventTraits: EventTraitsMap;
  onDismiss: (
    source: InteractionEventSource,
    progress?: ProgressEventMessageData
  ) => void;
  presentationStyle: PresentationStyle;
  survey?: Survey;
  userAuthToken?: string;
};

const SurveyView: (Props: Props) => React.ReactElement = ({
  companyAuthToken,
  displayedSurveyResponseId,
  eventTraits,
  onDismiss,
  presentationStyle,
  survey,
  userAuthToken,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<ProgressEventMessageData>();
  const [html, setHtml] = useState('');

  const dismiss = useCallback(() => {
    onDismiss('survey', progress);
  }, [onDismiss, progress]);

  const params = [];
  // Add the auth token
  if (userAuthToken != null) {
    params.push(`auth_token=${userAuthToken}`);
  } else if (companyAuthToken != null) {
    params.push(`auth_token=${companyAuthToken}`);
  }

  // Add response properties
  if (
    displayedSurveyResponseId != null &&
    eventTraits[displayedSurveyResponseId] != null
  ) {
    const traits = eventTraits[displayedSurveyResponseId] as EventTraits;
    for (const trait in traits) {
      const rawValue = traits[trait];
      if (rawValue == null) {
        continue;
      }

      const encodedTrait = encodeURIComponent(trait);
      const value = encodeURIComponent(rawValue.toString());

      if (typeof traits[trait] === 'boolean') {
        params.push(`response_boolean_${encodedTrait}=${value}`);
      } else if (typeof traits[trait] === 'number') {
        params.push(`response_number_${encodedTrait}=${value}`);
      } else if (
        typeof traits[trait] === 'object' &&
        Object.prototype.toString.call(traits[trait]) === '[object Date]' &&
        !isNaN((traits[trait] as Date).getTime())
      ) {
        params.push(
          `response_date_${encodedTrait}=${
            (traits[trait] as Date).getTime() / 1000
          }`
        );
      } else {
        params.push(`response_${encodedTrait}=${value}`);
      }
    }
  }

  // Add theme
  params.push(
    `theme=${
      useColorScheme() === Themes.Dark || survey?.appearance === Themes.Dark
        ? Themes.Dark
        : Themes.Light
    }`
  );

  params.push('absoluteURLs=true');

  if (Iterate.surveyTextFont != null) {
    params.push(
      `surveyTextFontPath=${
        Platform.OS === 'android'
          ? `file:///android_asset/fonts/${Iterate.surveyTextFont.filename}`
          : Iterate.surveyTextFont.filename
      }`
    );
  }

  if (Iterate.buttonFont != null) {
    params.push(
      `buttonFontPath=${
        Platform.OS === 'android'
          ? `file:///android_asset/fonts/${Iterate.buttonFont.filename}`
          : Iterate.buttonFont.filename
      }`
    );
  }

  const queryString = params.join('&');
  const url = `${DefaultHost}/${survey?.company_id}/${survey?.id}/mobile?${queryString}`;

  // The survey page reads the auth_token (and other params) from window.location.search on every API
  // request. We load the page as static HTML with a file:// base URL so bundled custom fonts resolve, and
  // we carry the query string in that base URL so window.location.search is populated natively when the
  // page boots. We used to load the HTML with a blank base URL and re-add the query string after load via
  // injectedJavaScript (history.pushState), but WebKit rejects pushState on the resulting opaque origin, so
  // the token never reached the page and every answer was recorded against a new anonymous user (issue #320).
  const baseUrl =
    Platform.OS === 'android'
      ? `file:///?${queryString}`
      : `file:///index.html?${queryString}`;

  // Fetch the survey page HTML and hand it to the WebView as a static string (rather than loading the URL
  // directly) so the WebView's origin is file:// — required for bundled fonts to resolve from the app bundle.
  useEffect(() => {
    if (survey != null) {
      setIsLoading(true);
      fetch(url).then((response) => {
        response
          .text()
          .then((responseHtml) => {
            setHtml(responseHtml);
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      });
    }
  }, [survey, url]);

  const onMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      const message: EventMessage = JSON.parse(event.nativeEvent.data);

      switch (message.type) {
        case EventMessageTypes.Close:
          dismiss();
          break;
        case EventMessageTypes.Progress:
          setProgress(message.data as ProgressEventMessageData);
          break;
        case EventMessageTypes.Response:
          const data = message.data as ResponseEventMessageData;
          InteractionEvents.Response(
            survey as Survey,
            data.response,
            data.question
          );
          break;
        case EventMessageTypes.SurveyComplete:
          InteractionEvents.SurveyComplete(survey as Survey);
          break;
      }
    },
    [dismiss, survey]
  );

  let backgroundColor;

  switch (survey?.appearance) {
    case Themes.Dark:
      backgroundColor = Colors.LightBlack;
      break;
    case Themes.Light:
      backgroundColor = Colors.Grey;
      break;
    default:
      Appearance.getColorScheme() === Themes.Dark
        ? (backgroundColor = Colors.LightBlack)
        : (backgroundColor = Colors.Grey);
  }

  return (
    <View>
      <Modal
        presentationStyle={presentationStyle}
        animationType="slide"
        onRequestClose={dismiss}
      >
        <SafeAreaProvider>
          <SafeAreaView
            style={{
              ...styles.container,
              backgroundColor: backgroundColor,
            }}
          >
          {isLoading && (
            <View
              style={{
                ...styles.loading,
                backgroundColor: backgroundColor,
              }}
            >
              <ActivityIndicator color="#999999" animating={true} />
            </View>
          )}
          {html.length > 0 && (
            <WebView
              onMessage={onMessage}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              onShouldStartLoadWithRequest={(request) => {
                if (
                  request.url.startsWith(Iterate.api?.apiHost ?? DefaultHost) ||
                  request.url.startsWith('file://') ||
                  request.url === 'about:blank'
                ) {
                  return true;
                } else {
                  Linking.openURL(request.url);
                  return false;
                }
              }}
              originWhitelist={['file://']}
              source={{
                html,
                // The query string (auth_token etc.) is carried here so it is present in
                // window.location.search when the page boots. The file:// origin lets bundled
                // custom fonts resolve from the app bundle.
                baseUrl,
              }}
              style={{ backgroundColor: backgroundColor }}
            />
          )}
          </SafeAreaView>
        </SafeAreaProvider>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
});

const mapStateToProps = ({
  companyAuthToken,
  displayedSurveyResponseId,
  eventTraits,
  presentationStyle,
  survey,
  userAuthToken,
}: State) => ({
  displayedSurveyResponseId,
  eventTraits,
  presentationStyle,
  survey,
  companyAuthToken,
  userAuthToken,
});

export default connect(mapStateToProps)(SurveyView);
