import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Hotspot } from '../storage/videoStorage';

const { width, height } = Dimensions.get('window');

interface Props {
  playlist: string[];
  hotspots: (Hotspot | null)[];
  onEnd: () => void;
}

export default function SeamlessPlayer({ playlist, hotspots, onEnd }: Props) {
  const videoA = useRef<Video>(null);
  const videoB = useRef<Video>(null);

  const [index, setIndex] = useState(0);
  const [active, setActive] = useState<'A' | 'B'>('A');

  useEffect(() => {
    videoA.current?.loadAsync(
      { uri: playlist[0] },
      { shouldPlay: true, resizeMode: ResizeMode.COVER },
      false
    );

    if (playlist[1]) {
      videoB.current?.loadAsync(
        { uri: playlist[1] },
        { shouldPlay: false, resizeMode: ResizeMode.COVER },
        false
      );
    }
  }, []);

  const next = async () => {
    const nextIndex = index + 1;
    if (nextIndex >= playlist.length) {
      onEnd();
      return;
    }

    const current = active === 'A' ? videoA : videoB;
    const nextVid = active === 'A' ? videoB : videoA;

    await nextVid.current?.setPositionAsync(0);
    await nextVid.current?.playAsync();

    setActive(active === 'A' ? 'B' : 'A');
    setIndex(nextIndex);

    const preloadIndex = nextIndex + 1;
    if (playlist[preloadIndex]) {
      await current.current?.loadAsync(
        { uri: playlist[preloadIndex] },
        { shouldPlay: false, resizeMode: ResizeMode.COVER },
        false
      );
    }
  };

  const handlePress = (e: any) => {
    const h = hotspots[index];
    if (!h) return next();

    const { locationX, locationY } = e.nativeEvent;
    const px = (locationX / width) * 100;
    const py = (locationY / height) * 100;

    if (
      px >= h.x &&
      px <= h.x + h.width &&
      py >= h.y &&
      py <= h.y + h.height
    ) {
      next();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Video ref={videoA} style={[styles.video, active !== 'A' && styles.hidden]} />
        <Video ref={videoB} style={[styles.video, active !== 'B' && styles.hidden]} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  video: {
    position: 'absolute',
    width,
    height
  },
  hidden: { opacity: 0 }
});