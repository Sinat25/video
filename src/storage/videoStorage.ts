import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const STORAGE_KEY = 'SAVED_VIDEO_PATHS';

export const VideoStorage = {
  async saveVideos(paths: string[]) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(paths));
  },

  async getVideos(): Promise<string[]> {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  async saveVideoFile(uri: string, stepIndex: number): Promise<string> {
    const filename = `step_${stepIndex}_${Date.now()}.mov`;
    const destination = FileSystem.documentDirectory + filename;
    
    await FileSystem.copyAsync({
      from: uri,
      to: destination
    });

    return destination;
  },
  
  async clearAll() {
      await AsyncStorage.removeItem(STORAGE_KEY);
      // Clean up files in document directory if needed
  }
};