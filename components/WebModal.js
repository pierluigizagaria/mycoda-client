import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

export default function WebModal({ route }) {
  const { colors } = useTheme();
  const { uri } = route.params;

  const activityIndicator = () => (
    <ActivityIndicator style={styles.activityIndicator} color={colors.primary} size="large" />
  );

  return (
    <WebView style={styles.container}
      source={{ uri }}
      startInLoadingState={'true'}
      renderLoading={activityIndicator}
/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    flex: 1,
    top: '-30%',
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorMessage: {
    alignSelf: 'center',
    fontWeight: 'bold',
  }
});

