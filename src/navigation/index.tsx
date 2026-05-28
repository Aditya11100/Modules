import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AudioRecording from '../screens/AudioRecording';
import VisionCamera from '../screens/VisionCamera';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Stack.Screen name="AudioRecording" component={AudioRecording} /> */}
      <Stack.Screen name="VisionCamera" component={VisionCamera} />
    </Stack.Navigator>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
