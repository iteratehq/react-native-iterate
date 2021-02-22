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

import { DefaultHost, EventMessageTypes, Themes } from '../constants';
import Iterate from '../iterate';
import type { State } from '../redux';
import type { EventMessage, EventTraits, Survey } from '../types';

type Props = {
  companyAuthToken?: string;
  eventTraits?: EventTraits;
  onDismiss: () => void;
  survey?: Survey;
  userAuthToken?: string;
};

const SurveyView: (Props: Props) => JSX.Element = ({
  companyAuthToken,
  eventTraits,
  onDismiss,
  survey,
  userAuthToken,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const params = [];
  // Add the auth token
  if (userAuthToken != null) {
    params.push(`auth_token=${userAuthToken}`);
  } else if (companyAuthToken != null) {
    params.push(`auth_token=${companyAuthToken}`);
  }

  // Add response properties
  for (const trait in eventTraits) {
    const value = encodeURIComponent(eventTraits[trait].toString());

    if (typeof eventTraits[trait] === 'boolean') {
      params.push(`response_boolean_${trait}=${value}`);
    } else if (typeof eventTraits[trait] === 'number') {
      params.push(`response_number_${trait}=${value}`);
    } else {
      params.push(`response_${trait}=${value}`);
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
      // Dismiss event
      const message: EventMessage = JSON.parse(event.nativeEvent.data);
      if (message.type === EventMessageTypes.Close) {
        onDismiss();
      }

      // Response event
      if (
        message.type === EventMessageTypes.Response &&
        message.data.response != null &&
        message.data.question != null &&
        Iterate.onResponse != null
      ) {
        if (Iterate.onResponseCallback != null) {
          Iterate.onResponseCallback(
            message.data.response,
            message.data.question
          );
        }
      }
    },
    [onDismiss]
  );

  console.log('Loading survey: ', url);

  return (
    <View>
      <Modal
        presentationStyle="pageSheet"
        animationType="slide"
        onDismiss={onDismiss}
        onRequestClose={onDismiss}
      >
        <SafeAreaView style={styles.container}>
          {isLoading && (
            <View style={styles.loading}>
              <ActivityIndicator animating={true} />
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
  eventTraits,
  survey,
  userAuthToken,
}: State) => ({
  eventTraits,
  survey,
  companyAuthToken,
  userAuthToken,
});

export default connect(mapStateToProps)(SurveyView);
