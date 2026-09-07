/* eslint-disable react-native/no-inline-styles */
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { checkCameraPermission } from '../../utils/functions';
import {
  Camera,
  CameraRef,
  usePhotoOutput,
  useVideoOutput,
} from 'react-native-vision-camera';
import { SkiaCamera } from 'react-native-vision-camera-skia';
import { useTensorflowModel } from 'react-native-fast-tflite';
import { Skia, BlendMode } from '@shopify/react-native-skia';

const VisionCamera = () => {
  const [showCamera, setShowCamera] = useState(false);

  const plugin = useTensorflowModel(
    require('../../assets/selfie_segmentation.tflite'),
    [],
  );

  const model = plugin.state === 'loaded' ? plugin.model : null;

  useEffect(() => {
    if (!showCamera) {
      setTimeout(() => {
        setShowCamera(true);
      }, 500);
    }
  }, [showCamera]);

  const cameraRef = useRef<CameraRef>(null);

  const videoOutput = useVideoOutput({
    /* options */
    enableAudio: true,
    fileType: 'mp4',
  });

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const startRecording = async () => {
    const recorder = await videoOutput.createRecorder({});
    await recorder.startRecording(
      path => console.log(`Recording finished!`),
      error => console.error(`Recording error!`, error),
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {showCamera && (
        // <Camera
        //   ref={cameraRef}
        //   style={StyleSheet.absoluteFill}
        //   isActive={true}
        //   device={'front'}
        //   outputs={[videoOutput]}
        // />
        <SkiaCamera
          device="front"
          isActive={true}
          style={StyleSheet.absoluteFill}
          onFrame={(frame, render) => {
            'worklet';
            render(({ canvas, frameTexture }) => {
              canvas.drawImage(frameTexture, 0, 0);
            });
            frame.dispose();
          }}
        />
      )}
      <View style={styles.actionButton}>
        <TouchableOpacity style={styles.record} onPress={async () => {}}>
          <View
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'red',
              borderRadius: 30,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VisionCamera;

const styles = StyleSheet.create({
  actionButton: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  record: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'red',
    padding: 4,
  },
});
