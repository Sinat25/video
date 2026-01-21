import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, Text, Dimensions } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useKeepAwake } from 'expo-keep-awake';
import { useVideoPreloader } from './useVideoPreloader';

interface SeamlessPlayerProps {
  onPlaybackComplete: () => void;
  onError?: (error: string) => void;
}

/**
 * Seamless video player component
 * Handles smooth transitions between videos with zero visible pause
 */
export function SeamlessPlayer({ onPlaybackComplete, onError }: SeamlessPlayerProps) {
  useKeepAwake(); // Keep screen on during playback

  const { videos, isPreloading, preloadProgress, currentVideoIndex, getCurrentPlayer, getNextPlayer, advanceToNextVideo } = useVideoPreloader();

  const [showTapHint, setShowTapHint] = useState(true);
  const currentPlayerRef = useRef(useVideoPlayer(getCurrentPlayer() || ''));
  const nextPlayerRef = useRef(useVideoPlayer(getNextPlayer() || ''));
  const tapHintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update current player when video changes
  useEffect(() => {
    const currentUri = getCurrentPlayer();
    if (currentUri) {
      currentPlayerRef.current = useVideoPlayer(currentUri);
      // Auto-play when ready
      setTimeout(() => {
        currentPlayerRef.current?.play();
      }, 100);
    }
  }, [currentVideoIndex, getCurrentPlayer]);

  // Preload next video
  useEffect(() => {
    const nextUri = getNextPlayer();
    if (nextUri) {
      nextPlayerRef.current = useVideoPlayer(nextUri);
    }
  }, [currentVideoIndex, getNextPlayer]);

  // Hide tap hint after 3 seconds
  useEffect(() => {
    if (showTapHint) {
      tapHintTimeoutRef.current = setTimeout(() => {
        setShowTapHint(false);
      }, 3000);
    }
    return () => {
      if (tapHintTimeoutRef.current) {
        clearTimeout(tapHintTimeoutRef.current);
      }
    };
  }, [showTapHint]);

  const handleScreenTap = () => {
    setShowTapHint(false);
    if (currentVideoIndex < videos.length - 1) {
      // Pause current, advance to next, play next
      currentPlayerRef.current?.pause();
      advanceToNextVideo();
      // Next player should be preloaded, play immediately
      setTimeout(() => {
        nextPlayerRef.current?.play();
      }, 0);
    } else {
      // Last video, complete playback
      onPlaybackComplete();
    }
  };

  if (isPreloading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <View className="items-center gap-4">
          <View className="w-16 h-16 rounded-full border-4 border-gray-600 border-t-cyan-400" />
          <Text className="text-white text-lg font-semibold">Loading videos...</Text>
          <Text className="text-gray-400 text-sm">{preloadProgress}%</Text>
        </View>
      </View>
    );
  }

  if (videos.length === 0) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white text-lg">No videos uploaded</Text>
      </View>
    );
  }

  return (
    <Pressable onPress={handleScreenTap} className="flex-1 bg-black">
      <VideoView
        player={currentPlayerRef.current}
        style={{ width: '100%', height: '100%' }}
        nativeControls={false}
        contentFit="cover"
      />

      {/* Tap hint */}
      {showTapHint && (
        <View className="absolute inset-0 items-center justify-center pointer-events-none">
          <View className="bg-black/40 rounded-full p-4">
            <Text className="text-white text-center text-sm font-medium">Tap to continue</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}
