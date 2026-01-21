import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import SeamlessPlayer from '../video/SeamlessPlayer';

interface Props {
  videoPaths: string[];
  onExit: () => void;
}

export default function PlayerScreen({ videoPaths, onExit }: Props) {
  return (
    <View style={styles.container}>
        <SeamlessPlayer 
            playlist={videoPaths} 
            onEnd={onExit}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' }
});