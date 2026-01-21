import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

export interface VideoStep {
  id: string;
  stepNumber: number;
  uri: string;
  fileName: string;
  uploadedAt: number;
}

export interface StoredVideos {
  [stepId: string]: VideoStep;
}

const STORAGE_KEY = 'seamless_videos';
const VIDEO_DIRECTORY = `${FileSystem.documentDirectory}seamless-videos/`;

/**
 * Initialize the video storage directory
 */
export async function initializeVideoStorage(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(VIDEO_DIRECTORY);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(VIDEO_DIRECTORY, { intermediates: true });
    }
  } catch (error) {
    console.error('Failed to initialize video storage:', error);
    throw error;
  }
}

/**
 * Save a video file to local storage
 */
export async function saveVideo(
  stepNumber: number,
  sourceUri: string,
  fileName: string
): Promise<VideoStep> {
  try {
    const stepId = `step_${stepNumber}`;
    const destinationUri = `${VIDEO_DIRECTORY}${stepId}_${Date.now()}.mp4`;

    // Copy file to app's document directory
    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });

    const videoStep: VideoStep = {
      id: stepId,
      stepNumber,
      uri: destinationUri,
      fileName,
      uploadedAt: Date.now(),
    };

    // Update AsyncStorage
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const videos: StoredVideos = stored ? JSON.parse(stored) : {};
    videos[stepId] = videoStep;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(videos));

    return videoStep;
  } catch (error) {
    console.error('Failed to save video:', error);
    throw error;
  }
}

/**
 * Get all stored videos
 */
export async function getStoredVideos(): Promise<VideoStep[]> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const videos: StoredVideos = JSON.parse(stored);
    return Object.values(videos).sort((a, b) => a.stepNumber - b.stepNumber);
  } catch (error) {
    console.error('Failed to get stored videos:', error);
    return [];
  }
}

/**
 * Get a specific video by step number
 */
export async function getVideoByStep(stepNumber: number): Promise<VideoStep | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const videos: StoredVideos = JSON.parse(stored);
    return videos[`step_${stepNumber}`] || null;
  } catch (error) {
    console.error('Failed to get video by step:', error);
    return null;
  }
}

/**
 * Delete a video by step number
 */
export async function deleteVideo(stepNumber: number): Promise<void> {
  try {
    const stepId = `step_${stepNumber}`;
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const videos: StoredVideos = JSON.parse(stored);
    const video = videos[stepId];

    if (video) {
      // Delete file from file system
      await FileSystem.deleteAsync(video.uri, { idempotent: true });

      // Update AsyncStorage
      delete videos[stepId];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
    }
  } catch (error) {
    console.error('Failed to delete video:', error);
    throw error;
  }
}

/**
 * Clear all stored videos
 */
export async function clearAllVideos(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const videos: StoredVideos = JSON.parse(stored);

    // Delete all files
    for (const video of Object.values(videos)) {
      await FileSystem.deleteAsync(video.uri, { idempotent: true });
    }

    // Clear AsyncStorage
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear all videos:', error);
    throw error;
  }
}

/**
 * Check if a video exists for a step
 */
export async function hasVideo(stepNumber: number): Promise<boolean> {
  try {
    const video = await getVideoByStep(stepNumber);
    return video !== null;
  } catch (error) {
    console.error('Failed to check video existence:', error);
    return false;
  }
}

/**
 * Get total video count
 */
export async function getVideoCount(): Promise<number> {
  try {
    const videos = await getStoredVideos();
    return videos.length;
  } catch (error) {
    console.error('Failed to get video count:', error);
    return 0;
  }
}
