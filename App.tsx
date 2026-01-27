import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import * as Notifications from 'expo-notifications';
import UploadScreen from './src/screens/UploadScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import PlayerScreen from './src/screens/PlayerScreen';
import { VideoStorage, Hotspot } from './src/storage/videoStorage';
import { getTheme } from './src/theme';
import { AppSettingsProvider, useAppSettings } from './src/settings/AppSettingsContext';

export type AppState = 'upload' | 'loading' | 'player';

/**
 * Notifications:
 * - Ensure notifications can show while the app is in the foreground.
 * - We keep sound and badge off by default.
 *
 * Docs (SDK 52): https://docs.expo.dev/versions/v52.0.0/sdk/notifications/
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function AppRoot() {
  useKeepAwake();
  const { showStatusBar, themeMode } = useAppSettings();
  const theme = getTheme(themeMode);

  // Force-apply status bar visibility (iOS can ignore the prop-only approach in some cases)
  useEffect(() => {
    StatusBar.setHidden(!showStatusBar, 'fade');
    StatusBar.setBarStyle(themeMode === 'dark' ? 'light-content' : 'dark-content');
    // Keep full-screen drawing under the status bar area when visible
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
  }, [showStatusBar, themeMode]);

  const [appState, setAppState] = useState<AppState>('upload');
  const [videoPaths, setVideoPaths] = useState<string[]>([]);
  const [hotspots, setHotspots] = useState<(Hotspot | null)[]>([]);

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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* 
         STATUS BAR CONFIGURATION: 
         - Translucent = content draws under it (Full Screen)
         - Transparent background = no ugly color bar
         - Light Content = White text/icons for visibility on video
         - Switcher controlled via AppSettings (showStatusBar)
      */}
      <StatusBar 
        translucent={true} 
        backgroundColor="transparent" 
        barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'}
        hidden={!showStatusBar}
      />
      {renderScreen()}
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppSettingsProvider>
        <AppRoot />
      </AppSettingsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
