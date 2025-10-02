import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

// Keep layout minimal since auth is not enforced
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="event-form" options={{ title: 'Create / Edit Event' }} />
          <Stack.Screen name="event-detail" options={{ title: 'Event Details' }} />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
