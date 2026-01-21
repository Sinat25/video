import React, { useEffect, useState } from 'react';
import { View, ScrollView, Pressable, Text, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { ScreenContainer } from '@/components/screen-container';
import { saveVideo, getStoredVideos, VideoStep, deleteVideo } from '@/src/storage/videoStorage';

interface UploadScreenProps {
  onPlaybackStart: () => void;
}

/**
 * Upload Screen - Allows users to upload videos for each step
 */
export function UploadScreen({ onPlaybackStart }: UploadScreenProps) {
  const [uploadedVideos, setUploadedVideos] = useState<VideoStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextStepNumber, setNextStepNumber] = useState(1);

  // Load existing videos on mount
  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const videos = await getStoredVideos();
      setUploadedVideos(videos);
      setNextStepNumber(videos.length + 1);
    } catch (error) {
      console.error('Failed to load videos:', error);
    }
  };

  const pickVideo = async (stepNumber: number) => {
    try {
      setIsLoading(true);

      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please allow access to your media library');
        return;
      }

      // Get all videos from media library
      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'video',
        first: 100,
      });

      if (media.assets.length === 0) {
        Alert.alert('No Videos', 'No videos found in your media library');
        return;
      }

      // For now, use the first video as a demo
      // In production, you'd show a picker UI
      const selectedAsset = media.assets[0];
      const assetInfo = await MediaLibrary.getAssetInfoAsync(selectedAsset);

      if (assetInfo.localUri) {
        await saveVideo(stepNumber, assetInfo.localUri, selectedAsset.filename || 'video.mp4');
        await loadVideos();
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'Failed to select video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteVideo = async (stepNumber: number) => {
    Alert.alert(
      'Delete Video',
      `Are you sure you want to delete Step ${stepNumber}?`,
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteVideo(stepNumber);
              await loadVideos();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete video');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const canStartPlayback = uploadedVideos.length > 0;
  const buttonDisabled = !canStartPlayback || isLoading;

  return (
    <ScreenContainer className="bg-gray-950">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 p-6 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-white">Video Steps</Text>
            <Text className="text-gray-400 text-base">
              Upload videos for each step to create a seamless experience
            </Text>
          </View>

          {/* Video List */}
          <View className="gap-3">
            {uploadedVideos.map((video) => (
              <View
                key={video.id}
                className="bg-gray-900 rounded-lg p-4 border border-gray-800 flex-row items-center justify-between"
              >
                <View className="flex-1 gap-1">
                  <Text className="text-white font-semibold text-base">Step {video.stepNumber}</Text>
                  <Text className="text-gray-400 text-sm">{video.fileName}</Text>
                </View>
                <Pressable
                  onPress={() => handleDeleteVideo(video.stepNumber)}
                  className="px-3 py-1 rounded bg-red-900/30 border border-red-700"
                >
                  <Text className="text-red-400 text-sm font-medium">Delete</Text>
                </Pressable>
              </View>
            ))}
          </View>

          {/* Add New Step Button */}
          <Pressable
            onPress={() => pickVideo(nextStepNumber)}
            disabled={isLoading}
            className="rounded-lg p-4 border-2 border-dashed border-cyan-400 items-center justify-center"
            style={{ opacity: isLoading ? 0.5 : 1 }}
          >
            <Text className="text-cyan-400 font-semibold text-base">
              + Add Step {nextStepNumber}
            </Text>
          </Pressable>

          {/* Start Playback Button */}
          <View className="mt-auto">
            <Pressable
              onPress={onPlaybackStart}
              disabled={buttonDisabled}
              className="rounded-lg p-4 items-center justify-center"
              style={{
                backgroundColor: canStartPlayback && !isLoading ? '#06b6d4' : '#374151',
              }}
            >
              <Text
                style={{
                  fontWeight: '600',
                  fontSize: 18,
                  color: canStartPlayback && !isLoading ? '#000000' : '#9ca3af',
                }}
              >
                {uploadedVideos.length > 0
                  ? `Start Playback (${uploadedVideos.length} video${uploadedVideos.length !== 1 ? 's' : ''})`
                  : 'Upload a video to start'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
