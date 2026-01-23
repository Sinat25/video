import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
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
  // Default to true (visible)
  const [showStatusBar, setShowStatusBar] = useState(true);

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

  const handleStartLoading = (paths: string[], hs: (Hotspot | null)[], statusBarVisible: boolean) => {
    setVideoPaths(paths);
    setHotspots(hs);
    setShowStatusBar(statusBarVisible);
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
            initialStatusBarState={showStatusBar} // Pass the current state down so it remembers
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
      <View style={styles.container}>
        {/* 
           STATUS BAR CONFIGURATION:
           hidden={!showStatusBar} means if showStatusBar is false, hidden is true.
        */}
        <StatusBar 
          translucent={true} 
          backgroundColor="transparent" 
          barStyle="light-content" 
          hidden={!showStatusBar}
        />
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
