/**
 * React Native Iterate SDK Example with React 19
 * Tests compatibility and functionality
 *
 * @format
 */

import React, { useEffect } from 'react';
import { Appearance, Button, StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Iterate, { IterateProvider } from 'react-native-iterate';
import SecureStorage from 'react-native-encrypted-storage';
import Markdown from 'react-native-markdown-display';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <IterateProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </IterateProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  // Same API key as the working example
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55X2lkIjoiNWRmZTM2OGEwOWI2ZWYwMDAxYjNlNjE4IiwiaWF0IjoxNTc2OTQxMTk0fQ.QBWr2goMwOngVhi6wY9sdFAKEvBGmn-JRDKstVMFh6M';
  const externalId = 'user-123';
  const email = 'example@email.com';

  useEffect(() => {
    Iterate.init({
      apiKey: apiKey,
      safeArea: useSafeAreaInsets,
      storage: SecureStorage,
      markdown: Markdown,
    });

    Iterate.onResponse((response, question, survey) => {
      console.log('onResponseCallback', response, question, survey);
    });

    Iterate.onEvent((event, data) => {
      console.log('onEventCallback', event, data);
    });
  }, [apiKey]);

  // Get theme for dark mode support
  const theme = Appearance.getColorScheme();
  const backgroundColor = theme === 'dark' ? '#000' : '#fff';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.buttonContainer}>
        <Button
          title="Trigger survey"
          onPress={() => {
            Iterate.sendEvent('show-survey-button-tapped', {
              currentTime: new Date().getTime(),
              exampleDate: new Date(2023, 4, 13),
            });
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={() => {
            Iterate.identify({
              external_id: externalId,
              email,
              date_joined: new Date(2023, 4, 12),
            });
          }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Logout"
          onPress={() => {
            Iterate.reset();
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
    width: '80%',
  },
});

export default App;
