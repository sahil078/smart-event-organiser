import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { View } from 'react-native';
import EventListScreen from '@/screens/EventListScreen';
import LoginScreen from '@/screens/LoginScreen';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { user, loading = false } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <EventListScreen />;
}