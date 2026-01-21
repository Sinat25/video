import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export default function PrimaryButton({ title, onPress, disabled, loading, variant = 'primary' }: Props) {
  const bg = variant === 'danger' ? theme.colors.danger : (variant === 'secondary' ? theme.colors.surface : theme.colors.primary);

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: bg, opacity: disabled ? 0.5 : 1 }]} 
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
  text: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  }
});