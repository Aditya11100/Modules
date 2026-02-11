import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMicPermission } from '../../utils/functions';
import Sound, { RecordBackType } from 'react-native-nitro-sound';

const AudioRecording = () => {
  const [soundState, setSoundState] = useState<
    'playing' | 'paused' | 'stopped' | ''
  >('');
  const [recordTime, setRecordTime] = useState('');
  const [lastRecordedUrl, setLastRecordedUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    getPermission();
  }, []);

  const getPermission = () => {
    getMicPermission();
  };

  const startRecording = async () => {
    Sound.addRecordBackListener((e: RecordBackType) => {
      // setRecordSecs(e.currentPosition);
      // setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)));
      setRecordTime(Sound.mmssss(Math.floor(e.currentPosition)));
    });

    try {
      const result = await Sound.startRecorder();
      setSoundState('playing');
    } catch (error) {}
  };

  const stopRecording = async () => {
    try {
      const result = await Sound.stopRecorder();
      Sound.removeRecordBackListener();
      console.log('Recording stopped:', result);
      setLastRecordedUrl(result);
      setSoundState('stopped');
    } catch (error) {}
  };

  const onPauseRecord = async () => {
    try {
      await Sound.pauseRecorder();
      console.log('Recording paused');
      setSoundState('paused');
    } catch (error) {}
  };

  const onResumeRecord = async () => {
    try {
      await Sound.resumeRecorder();
      console.log('Recording resumed');
      setSoundState('playing');
    } catch (error) {}
  };

  const startPlaying = async () => {
    try {
      const msg = await Sound.startPlayer(lastRecordedUrl);

      Sound.addPlaybackEndListener(e => {
        setIsPlaying(false);
      });
    } catch (error) {
      console.error('Failed to start playback:', error);
    } finally {
      setIsPlaying(true);
    }
  };

  const stopPlaying = async () => {
    try {
      await Sound.stopPlayer();
      Sound.removePlaybackEndListener();
    } catch (error) {
      console.error('Failed to stop playback:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {!isPlaying ? (
          <View>
            <View>
              <Text>{`${recordTime}`}</Text>
            </View>

            {soundState && soundState !== 'stopped' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={
                    soundState === 'playing' ? onPauseRecord : onResumeRecord
                  }
                >
                  <Text>{soundState === 'playing' ? 'Pause' : 'Resume'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={stopRecording}
                  style={{ marginLeft: 30 }}
                >
                  <Text>{'Stop'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={startRecording}>
                <Text>Start Recording</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        {lastRecordedUrl && (soundState === '' || soundState === 'stopped') ? (
          <View style={{ marginTop: 30 }}>
            <Text>Play Last Recorded Audio</Text>
            <TouchableOpacity onPress={isPlaying ? stopPlaying : startPlaying}>
              <Text>{isPlaying ? 'Stop Audio' : 'Play Audio'}</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default AudioRecording;

const styles = StyleSheet.create({});
