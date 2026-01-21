import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import PrimaryButton from '../ui/PrimaryButton';
import { VideoStorage } from '../storage/videoStorage';

interface Props {
  onStart: (paths: string[]) => void;
  existingVideos: string[];
}

export default function UploadScreen({ onStart, existingVideos }: Props) {
  const [steps, setSteps] = useState<(string | null)[]>([null, null, null]); // Start with 3 steps
  
  useEffect(() => {
    if (existingVideos.length > 0) {
      // Pad with nulls if needed or truncate
      setSteps(existingVideos);
    }
  }, [existingVideos]);

  const pickVideo = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true, // Allows basic trim, helpful for ensuring format compatibility
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const newSteps = [...steps];
      // Save locally immediately
      try {
        const savedPath = await VideoStorage.saveVideoFile(result.assets[0].uri, index);
        newSteps[index] = savedPath;
        setSteps(newSteps);
        
        // Persist the list
        const validPaths = newSteps.filter((s): s is string => s !== null);
        await VideoStorage.saveVideos(validPaths);
      } catch (e) {
        Alert.alert("Error", "Failed to save video to local storage.");
      }
    }
  };

  const addStep = () => setSteps([...steps, null]);

  const canStart = steps.every(s => s !== null) && steps.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Setup Steps</Text>
        <Text style={styles.subtitle}>Upload a video for each interaction.</Text>
      </View>

      <ScrollView style={styles.list}>
        {steps.map((uri, index) => (
          <View key={index} style={styles.stepRow}>
            <View style={styles.stepInfo}>
              <Text style={styles.stepLabel}>Step {index + 1}</Text>
              {uri && <Text style={styles.status}>Ready ✓</Text>}
            </View>
            <PrimaryButton 
              title={uri ? "Replace" : "Upload Video"} 
              onPress={() => pickVideo(index)}
              variant={uri ? 'secondary' : 'primary'}
            />
          </View>
        ))}
        
        <PrimaryButton title="+ Add Step" onPress={addStep} variant="secondary" />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton 
          title="Prepare Playback" 
          onPress={() => onStart(steps.filter((s): s is string => s !== null))}
          disabled={!canStart}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.m },
  header: { marginBottom: theme.spacing.l },
  title: theme.text.title,
  subtitle: { ...theme.text.body, color: theme.colors.textSecondary, marginTop: 4 },
  list: { flex: 1 },
  stepRow: { marginBottom: theme.spacing.l, backgroundColor: theme.colors.surface, padding: theme.spacing.m, borderRadius: 12 },
  stepInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.s },
  stepLabel: { color: theme.colors.text, fontWeight: '600', fontSize: 18 },
  status: { color: theme.colors.success, fontWeight: '600' },
  footer: { marginTop: theme.spacing.m }
});