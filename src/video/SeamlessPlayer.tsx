import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Hotspot } from '../storage/videoStorage';

// Get full screen dimensions including status bar area
const { width, height } = Dimensions.get('screen');

interface Props {
  playlist: string[];
  hotspots: (Hotspot | null)[];
  onEnd: () => void;
}

export default function SeamlessPlayer({ playlist, hotspots, onEnd }: Props) {
  const [index, setIndex] = useState(0);
  const [activePlayer, setActivePlayer] = useState<'A' | 'B'>('A');
  
  const videoA = useRef<Video>(null);
  const videoB = useRef<Video>(null);
  
  useEffect(() => {
    // Initial setup: Load current and next
    initializePlayer();
  }, []);

  const initializePlayer = async () => {
    // Load first video into A
    await loadSource('A', playlist[0], true);
    // Preload second video into B (if exists)
    if (playlist.length > 1) {
      await loadSource('B', playlist[1], false);
    }
  };

  const loadSource = async (player: 'A' | 'B', uri: string, shouldPlay: boolean) => {
    const ref = player === 'A' ? videoA : videoB;
    if (ref.current) {
        // Unload first to clear any previous state
        await ref.current.unloadAsync();
        await ref.current.loadAsync(
            { uri },
            { 
              shouldPlay: shouldPlay, 
              isLooping: true,
              resizeMode: ResizeMode.COVER,
              isMuted: false,
              volume: 1.0,
              progressUpdateIntervalMillis: 500,
            },
            false
        );
    }
  };

  const handlePress = (event: any) => {
    const currentHotspot = hotspots[index];
    if (currentHotspot) {
      const { locationX, locationY } = event.nativeEvent;
      const px = (locationX / width) * 100;
      const py = (locationY / height) * 100;

      const isInside = 
        px >= currentHotspot.x && 
        px <= (currentHotspot.x + currentHotspot.width) &&
        py >= currentHotspot.y && 
        py <= (currentHotspot.y + currentHotspot.height);

      if (!isInside) return;
    }
    handleNext();
  };

  const handleNext = async () => {
    const nextIndex = index + 1;

    if (nextIndex >= playlist.length) {
      onEnd();
      return;
    }

    // INSTANT SWITCH LOGIC
    // The 'next' player is already loaded with the video due to our preload logic.
    const nextPlayer = activePlayer === 'A' ? 'B' : 'A';
    const currentRef = activePlayer === 'A' ? videoA : videoB;
    const nextRef = activePlayer === 'A' ? videoB : videoA;

    // 1. Start playing the next video immediately. 
    // Since it was preloaded, this is much faster.
    nextRef.current?.playAsync();

    // 2. SWAP UI INSTANTLY. Do not wait for promises.
    setActivePlayer(nextPlayer);
    setIndex(nextIndex);

    // 3. Cleanup old video and preload the *next next* video in background
    // We do this without awaiting to keep UI responsive
    cleanupAndPreload(currentRef, nextIndex + 1);
  };

  const cleanupAndPreload = async (oldRef: React.RefObject<Video>, futureIndex: number) => {
    try {
        // Stop old video to save resources
        await oldRef.current?.stopAsync();
        
        // If there is a video after the one we just switched to, load it into the now-hidden player
        if (futureIndex < playlist.length) {
            await oldRef.current?.unloadAsync();
            await oldRef.current?.loadAsync(
                { uri: playlist[futureIndex] },
                {
                    shouldPlay: false, // Don't play yet, just buffer
                    isLooping: true,
                    resizeMode: ResizeMode.COVER,
                    isMuted: false
                }
            );
        }
    } catch (e) {
        console.log("Preload error", e);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {/* 
           We render both players at full screen size using absolute positioning.
           We use Opacity 0/1 instead of conditional rendering to ensure the 
           Video component stays mounted and buffered in memory.
        */}
        
        {/* Player A */}
        <View 
          style={[styles.videoWrapper, { opacity: activePlayer === 'A' ? 1 : 0 }]}
          pointerEvents={activePlayer === 'A' ? 'auto' : 'none'}
        >
          <Video
            ref={videoA}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
          />
        </View>

        {/* Player B */}
        <View 
          style={[styles.videoWrapper, { opacity: activePlayer === 'B' ? 1 : 0 }]}
          pointerEvents={activePlayer === 'B' ? 'auto' : 'none'}
        >
          <Video
            ref={videoB}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    width: width,
    height: height,
  },
  videoWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
