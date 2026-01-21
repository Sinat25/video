import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { initializeVideoStorage } from '@/src/storage/videoStorage';
import { UploadScreen } from '@/src/screens/UploadScreen';
import { SeamlessPlayer } from '@/src/video/SeamlessPlayer';

type AppScreen = 'upload' | 'player';

/**
 * Main App Screen - Handles navigation between upload and playback screens
 */
export default function HomeScreen() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('upload');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize storage on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initializeVideoStorage();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize storage:', error);
        setIsInitialized(true); // Continue anyway
      }
    };

    init();
  }, []);

  const handlePlaybackStart = () => {
    setCurrentScreen('player');
  };

  const handlePlaybackComplete = () => {
    setCurrentScreen('upload');
  };

  if (!isInitialized) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <View />
      </View>
    );
  }

  return (
    <View className="flex-1">
      {currentScreen === 'upload' ? (
        <UploadScreen onPlaybackStart={handlePlaybackStart} />
      ) : (
        <SeamlessPlayer onPlaybackComplete={handlePlaybackComplete} />
      )}
    </View>
  );
}
