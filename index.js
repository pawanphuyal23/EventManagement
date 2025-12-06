// This is the entry point for Expo Router
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// https://docs.expo.dev/router/reference/troubleshooting/#expo-router-app-entry
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);