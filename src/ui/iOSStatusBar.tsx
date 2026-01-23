import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function iOSStatusBar() {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.statusBar}>
      <View style={styles.leftSide}>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={styles.rightSide}>
        <Ionicons name="cellular" size={16} color="white" style={styles.icon} />
        <Ionicons name="wifi" size={16} color="white" style={styles.icon} />
        <Ionicons name="battery-full" size={20} color="white" style={styles.icon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  icon: {
    marginLeft: 5,
  },
});
