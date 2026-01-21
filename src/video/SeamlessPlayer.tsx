import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';

const { width, height } = Dimensions.get('window');

interface Props {
  playlist: string[];
  onEnd: () => void;
}

/**
 * THE DUAL BUFFER ENGINE
 * To achieve seamless playback, we use two Video components.
 * 1. Active Player: Visible, Playing.
 * 2. Buffer Player: Hidden (Opacity 0), Preloaded with next video, Paused at 0.
 * * On tap, we:
 * 1. Make Buffer Player visible (z-index up).
 * 2. Play Buffer Player.
 * 3. Stop Old Active Player.
 * 4. Load Next+1 video into Old Active Player.
 */
export default function SeamlessPlayer({ playlist, onEnd }: Props) {
  const [index, setIndex] = useState(0);
  
  // We use "A" and "B" to denote the two physical players
  const [activePlayer, setActivePlayer] = useState<'A' | 'B'>('A');
  
  const videoA = useRef<Video>(null);
  const videoB = useRef<Video>(null);

  // Initialize
  useEffect(() => {
    loadSource('A', playlist[0], true);
    if (playlist.length > 1) {
      loadSource('B', playlist[1], false);
    }
  }, []);

  const loadSource = async (player: 'A' | 'B', uri: string, shouldPlay: boolean) => {
    const ref = player === 'A' ? videoA : videoB;
    if (ref.current) {
        // Unload first to free memory
        await ref.current.unloadAsync(); 
        await ref.current.loadAsync(
            { uri },
            { 
              shouldPlay: shouldPlay, 
              isLooping: true, // Loop current step until tap
              resizeMode: ResizeMode.COVER 
            }
        );
    }
  };

  const handleNext = async () => {
    const nextIndex = index + 1;

    if (nextIndex >= playlist.length) {
      onEnd(); // End of experience
      return;
    }

    setIndex(nextIndex);

    // Swap players
    const nextPlayer = activePlayer === 'A' ? 'B' : 'A';
    const currentRef = activePlayer === 'A' ? videoA : videoB;
    const nextRef = activePlayer === 'A' ? videoB : videoA;

    // 1. Play the preloaded player
    await nextRef.current?.playAsync();

    // 2. Switch visual state (React renders this fast, but the playAsync above ensures motion starts)
    setActivePlayer(nextPlayer);

    // 3. Stop the old player to save resources
    await currentRef.current?.stopAsync();

    // 4. Preload the step AFTER the next one into the old player (now the buffer)
    const futureIndex = nextIndex + 1;
    if (futureIndex < playlist.length) {
      await loadSource(activePlayer, playlist[futureIndex], false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleNext}>
      <View style={styles.container}>
        {/* Player A */}
        <View style={[styles.videoWrapper, { zIndex: activePlayer === 'A' ? 2 : 1 }]}>
          <Video
            ref={videoA}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            isMuted={false}
          />
        </View>

        {/* Player B */}
        <View style={[styles.videoWrapper, { zIndex: activePlayer === 'B' ? 2 : 1 }]}>
          <Video
            ref={videoB}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            isMuted={false}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  videoWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: 'black', // Prevents flashes
  },
  video: {
    width: '100%',
    height: '100%',
  },
});