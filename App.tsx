import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import UploadScreen from './src/screens/UploadScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import { VideoStorage } from './src/storage/videoStorage';

export type AppState = 'upload' | 'loading' | 'player';

export default function App() {
  useKeepAwake(); // Prevent screen from sleeping
  const [appState, setAppState] = useState<AppState>('upload');
  const [videoPaths, setVideoPaths] = useState<string[]>([]);

  // Check if we have videos saved on launch
  useEffect(() => {
    const checkStorage = async () => {
      const savedVideos = await VideoStorage.getVideos();
      if (savedVideos && savedVideos.length > 0) {
        setVideoPaths(savedVideos);
        // Optional: Go straight to loading if videos exist
        // setAppState('loading'); 
      }
    };
    checkStorage();
  }, []);

  const handleStartLoading = (paths: string[]) => {
    setVideoPaths(paths);
    setAppState('loading');
  };

  const handleLoadingComplete = () => {
    // Just ready to switch, button in loading screen triggers this actual switch
  };

  const renderScreen = () => {
    switch (appState) {
      case 'upload':
        return <UploadScreen onStart={handleStartLoading} existingVideos={videoPaths} />;
      case 'loading':
        return (
          <LoadingScreen 
            videoPaths={videoPaths} 
            onReady={() => setAppState('player')}
            onCancel={() => setAppState('upload')}
          />
        );
      case 'player':
        return <PlayerScreen videoPaths={videoPaths} onExit={() => setAppState('upload')} />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar hidden={appState === 'player'} barStyle="light-content" />
        {renderScreen()}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
