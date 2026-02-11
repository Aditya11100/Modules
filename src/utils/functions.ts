import { Alert, Platform } from 'react-native';
import { openSettings, PERMISSIONS, request } from 'react-native-permissions';

export const singleAlertButton = (
  title: string,
  description: string,
  successCallBack?: Function,
) =>
  Alert.alert(title, description, [
    { text: 'OK', onPress: () => successCallBack?.() },
  ]);

export const dualAlertButton = (
  title: string,
  description: string,
  successCallBack?: Function,
  cancelCallBack?: Function,
) =>
  Alert.alert(title, description, [
    { text: 'Cancel', onPress: () => cancelCallBack?.() },
    { text: 'OK', onPress: () => successCallBack?.() },
  ]);

export const getMicPermission = async (successCallback?: Function) => {
  request(
    Platform.select({
      ios: PERMISSIONS.IOS.MICROPHONE,
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    } as never),
  )
    .then(response => {
      if (response === 'granted' || response === 'limited') {
        successCallback?.();
      } else if (response === 'blocked' || response === 'denied') {
        dualAlertButton(
          'Microphone Permission Disabled',
          'Please Enable it from Settings',
          () => {
            openSettings();
          },
        );
      } else {
        singleAlertButton('Not available', 'Microphone is not available');
      }
    })
    .catch(error => {
      console.log('Micriphone permission error', error);
    });
};
