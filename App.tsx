import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';

import UploadScreen from './src/screens/UploadScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import { VideoStorage, Hotspot } from './src/storage/videoStorage';

export type AppState = 'upload' | 'loading' | 'player';

export default function App() {
  useKeepAwake();

  const [appState, setAppState] = useState<AppState>('upload');
  const [videoPaths, setVideoPaths] = useState<string[]>([]);
  const [hotspots, setHotspots] = useState<(Hotspot | null)[]>([]);

  // Load saved videos and hotspots
  useEffect(() => {
    const checkStorage = async () => {
      const savedVideos = await VideoStorage.getVideos();
      const savedHotspots = await VideoStorage.getHotspots();
      if (savedVideos && savedVideos.length > 0) {
        setVideoPaths(savedVideos);
        setHotspots(savedHotspots);
      }
    };
    checkStorage();
  }, []);

  const handleStartLoading = (paths: string[], hs: (Hotspot | null)[]) => {
    setVideoPaths(paths);
    setHotspots(hs);
    setAppState('loading');
  };

  const renderScreen = () => {
    switch (appState) {
      case 'upload':
        return (
          <UploadScreen
            onStart={handleStartLoading}
            existingVideos={videoPaths}
            existingHotspots={hotspots}
          />
        );
      case 'loading':
        return (
          <LoadingScreen
            videoPaths={videoPaths}
            onReady={() => setAppState('player')}
            onCancel={() => setAppState('upload')}
          />
        );
      case 'player':
        return (
          <PlayerScreen
            videoPaths={videoPaths}
            hotspots={hotspots}
            onExit={() => setAppState('upload')}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      {/* Dark status bar with white icons */}
      <StatusBar style="light" backgroundColor="#000" translucent={false} />
      
      <View style={styles.container}>
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