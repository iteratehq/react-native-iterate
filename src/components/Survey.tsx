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
  SafeAreaView,
  StyleSheet,
  View,
  useColorScheme,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';

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

const SurveyView: (Props: Props) => JSX.Element = ({
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

      const value = encodeURIComponent(rawValue.toString());

      if (typeof traits[trait] === 'boolean') {
        params.push(`response_boolean_${trait}=${value}`);
      } else if (typeof traits[trait] === 'number') {
        params.push(`response_number_${trait}=${value}`);
      } else if (
        typeof traits[trait] === 'object' &&
        Object.prototype.toString.call(traits[trait]) === '[object Date]' &&
        !isNaN((traits[trait] as Date).getTime())
      ) {
        params.push(
          `response_date_${trait}=${(traits[trait] as Date).getTime() / 1000}`
        );
      } else {
        params.push(`response_${trait}=${value}`);
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

  const url = `${DefaultHost}/${survey?.company_id}/${
    survey?.id
  }/mobile?${params.join('&')}`;

  // In order to access assets in the app bundle (e.g. fonts), we need to load the HTML for the survey page in
  // a separate request and provide it to the webview, so that the webview's base URL is the location of the
  // app bundle in the local filesystem.
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

  // Only do this if we haven't already
  const addQueryParamScript = `if (!window.location.search) {
    window.history.pushState('', '', '?${params.join('&')}');
  }`;

  return (
    <View>
      <Modal
        presentationStyle={presentationStyle}
        animationType="slide"
        onRequestClose={dismiss}
      >
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
                  request.url.startsWith('file://')
                ) {
                  return true;
                } else {
                  Linking.openURL(request.url);
                  return false;
                }
              }}
              originWhitelist={['file://']}
              // Once the webview has loaded the static HTML for the page, window.location.href will be a file:/// url.
              // Append the auth token to the URL as a query parameter so the page can use it for API requests
              injectedJavaScript={addQueryParamScript}
              source={{
                html,
                // On iOS, a blank baseUrl parameter here results in window.location.href being a file:/// url pointing
                // local location of the bundle. On Android, we need to provide a baseUrl or window.location.href will be
                // about:blank.
                baseUrl: Platform.OS === 'android' ? 'file:///' : '',
              }}
              style={{ backgroundColor: backgroundColor }}
            />
          )}
        </SafeAreaView>
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
