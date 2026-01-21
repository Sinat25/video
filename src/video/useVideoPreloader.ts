import { useEffect, useRef, useState } from 'react';
import { getStoredVideos, VideoStep } from '@/src/storage/videoStorage';

export interface PreloadedVideo {
  step: VideoStep;
  isLoaded: boolean;
  uri: string;
}

export interface UseVideoPreloaderReturn {
  videos: VideoStep[];
  preloadedVideos: Map<string, PreloadedVideo>;
  isPreloading: boolean;
  preloadProgress: number;
  currentVideoIndex: number;
  nextVideoIndex: number | null;
  getCurrentPlayer: () => string | null;
  getNextPlayer: () => string | null;
  advanceToNextVideo: () => void;
  resetPlayback: () => void;
  error: string | null;
}

/**
 * Hook to manage seamless video playback with preloading
 * Ensures zero-pause transitions between videos
 */
export function useVideoPreloader(): UseVideoPreloaderReturn {
  const [videos, setVideos] = useState<VideoStep[]>([]);
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const preloadedVideosRef = useRef<Map<string, PreloadedVideo>>(new Map());

  // Load videos from storage
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const storedVideos = await getStoredVideos();
        setVideos(storedVideos);
        setError(null);
      } catch (err) {
        setError('Failed to load videos');
        console.error('Error loading videos:', err);
      }
    };

    loadVideos();
  }, []);

  // Preload all videos
  useEffect(() => {
    if (videos.length === 0) return;

    const preloadVideos = async () => {
      setIsPreloading(true);
      setPreloadProgress(0);

      try {
        const preloadedMap = new Map<string, PreloadedVideo>();

        for (let i = 0; i < videos.length; i++) {
          const video = videos[i];
          const stepId = `step_${video.stepNumber}`;

          try {
            // Mark video as preloaded
            preloadedMap.set(stepId, {
              step: video,
              isLoaded: true,
              uri: video.uri,
            });

            // Update progress
            const progress = Math.round(((i + 1) / videos.length) * 100);
            setPreloadProgress(progress);
          } catch (err) {
            console.error(`Failed to preload video ${video.stepNumber}:`, err);
            preloadedMap.set(stepId, {
              step: video,
              isLoaded: false,
              uri: video.uri,
            });
          }
        }

        preloadedVideosRef.current = preloadedMap;
        setPreloadProgress(100);
        setIsPreloading(false);
      } catch (err) {
        setError('Failed to preload videos');
        console.error('Error preloading videos:', err);
        setIsPreloading(false);
      }
    };

    preloadVideos();
  }, [videos]);

  const getCurrentPlayer = (): string | null => {
    if (videos.length === 0) return null;
    return videos[currentVideoIndex].uri;
  };

  const getNextPlayer = (): string | null => {
    const nextIndex = currentVideoIndex + 1;
    if (nextIndex >= videos.length) return null;
    return videos[nextIndex].uri;
  };

  const advanceToNextVideo = () => {
    if (currentVideoIndex < videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const resetPlayback = () => {
    setCurrentVideoIndex(0);
  };

  return {
    videos,
    preloadedVideos: preloadedVideosRef.current,
    isPreloading,
    preloadProgress,
    currentVideoIndex,
    nextVideoIndex: currentVideoIndex < videos.length - 1 ? currentVideoIndex + 1 : null,
    getCurrentPlayer,
    getNextPlayer,
    advanceToNextVideo,
    resetPlayback,
    error,
  };
}
