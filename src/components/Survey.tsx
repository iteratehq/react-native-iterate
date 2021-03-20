/**
 * @format
 * @flow
 */

import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import { connect } from 'react-redux';
import { WebView } from 'react-native-webview';

import { DefaultHost, Themes } from '../constants';
import {
  EventMessageTypes,
  InteractionEventClosedSource,
  InteractionEvents,
} from '../interaction-events';
import type { State } from '../redux';
import type { EventMessage, EventTraitsMap, Survey } from '../types';

type Props = {
  companyAuthToken?: string;
  displayedSurveyResponseId?: number;
  eventTraits: EventTraitsMap;
  onDismiss: (source: InteractionEventClosedSource) => void;
  survey?: Survey;
  userAuthToken?: string;
};

const SurveyView: (Props: Props) => JSX.Element = ({
  companyAuthToken,
  displayedSurveyResponseId,
  eventTraits,
  onDismiss,
  survey,
  userAuthToken,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const dismiss = useCallback(() => {
    onDismiss('survey');
  }, [onDismiss]);

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
    const traits = eventTraits[displayedSurveyResponseId];
    for (const trait in traits) {
      const value = encodeURIComponent(traits[trait].toString());

      if (typeof traits[trait] === 'boolean') {
        params.push(`response_boolean_${trait}=${value}`);
      } else if (typeof traits[trait] === 'number') {
        params.push(`response_number_${trait}=${value}`);
      } else {
        params.push(`response_${trait}=${value}`);
      }
    }
  }

  // Add theme
  params.push(
    `theme=${useColorScheme() === Themes.Dark ? Themes.Dark : Themes.Light}`
  );

  const url = `${DefaultHost}/${survey?.company_id}/${
    survey?.id
  }/mobile?${params.join('&')}`;

  const onMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      const message: EventMessage = JSON.parse(event.nativeEvent.data);

      switch (message.type) {
        case EventMessageTypes.Close:
          dismiss();
          break;
        case EventMessageTypes.Response:
          InteractionEvents.Response(
            message.data.response,
            message.data.question
          );
          break;
      }
    },
    [dismiss]
  );

  return (
    <View>
      <Modal
        presentationStyle="pageSheet"
        animationType="slide"
        onRequestClose={dismiss}
      >
        <SafeAreaView style={styles.container}>
          {isLoading && (
            <View style={styles.loading}>
              <ActivityIndicator color="#999999" animating={true} />
            </View>
          )}
          <WebView
            onMessage={onMessage}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            source={{ uri: url }}
          />
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
  survey,
  userAuthToken,
}: State) => ({
  displayedSurveyResponseId,
  eventTraits,
  survey,
  companyAuthToken,
  userAuthToken,
});

export default connect(mapStateToProps)(SurveyView);
