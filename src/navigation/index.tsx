import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AudioRecording from '../screens/AudioRecording';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AudioRecording" component={AudioRecording} />
    </Stack.Navigator>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
