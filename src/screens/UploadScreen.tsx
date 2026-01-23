import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
import PrimaryButton from '../ui/PrimaryButton';
import { VideoStorage, Hotspot } from '../storage/videoStorage';
import HotspotEditor from './HotspotEditor';

interface Props {
  onStart: (paths: string[], hotspots: (Hotspot | null)[]) => void;
  existingVideos: string[];
  existingHotspots: (Hotspot | null)[];
}

export default function UploadScreen({ onStart, existingVideos, existingHotspots }: Props) {
  const [steps, setSteps] = useState<(string | null)[]>([null, null, null]);
  const [hotspots, setHotspots] = useState<(Hotspot | null)[]>([null, null, null]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  useEffect(() => {
    if (existingVideos.length > 0) {
      setSteps(existingVideos);
      // Ensure hotspots array matches steps length
      const hs = [...existingHotspots];
      while (hs.length < existingVideos.length) hs.push(null);
      setHotspots(hs);
    }
  }, [existingVideos, existingHotspots]);

  const pickVideo = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const newSteps = [...steps];
      try {
        const savedPath = await VideoStorage.saveVideoFile(result.assets[0].uri, index);
        newSteps[index] = savedPath;
        setSteps(newSteps);
        
        const validPaths = newSteps.filter((s): s is string => s !== null);
        await VideoStorage.saveVideos(validPaths);
      } catch (e) {
        Alert.alert("Error", "Failed to save video.");
      }
    }
  };

  const addStep = () => {
    setSteps([...steps, null]);
    setHotspots([...hotspots, null]);
  };

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index);
    const newHotspots = hotspots.filter((_, i) => i !== index);
    setSteps(newSteps);
    setHotspots(newHotspots);
    VideoStorage.saveVideos(newSteps.filter((s): s is string => s !== null));
    VideoStorage.saveHotspots(newHotspots);
  };

  const saveHotspot = async (hotspot: Hotspot) => {
    if (editingIndex !== null) {
      const newHotspots = [...hotspots];
      newHotspots[editingIndex] = hotspot;
      setHotspots(newHotspots);
      await VideoStorage.saveHotspots(newHotspots);
      setEditingIndex(null);
    }
  };

  if (editingIndex !== null && steps[editingIndex]) {
    return (
      <HotspotEditor 
        videoUri={steps[editingIndex]!}
        initialHotspot={hotspots[editingIndex]}
        onSave={saveHotspot}
        onCancel={() => setEditingIndex(null)}
      />
    );
  }

  const canStart = steps.every(s => s !== null) && steps.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Project Setup</Text>
        <Text style={styles.subtitle}>Create your interactive video experience.</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {steps.map((uri, index) => (
          <View key={index} style={styles.stepCard}>
            <View style={styles.stepHeader}>
              <View>
                <Text style={styles.stepLabel}>Step {index + 1}</Text>
                <Text style={[styles.status, { color: uri ? theme.colors.success : theme.colors.textSecondary }]}>
                  {uri ? "Video Ready" : "Missing Video"}
                </Text>
              </View>
              {steps.length > 1 && (
                <TouchableOpacity onPress={() => removeStep(index)}>
                  <Text style={{ color: theme.colors.danger, fontWeight: '600' }}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.actionRow}>
              <PrimaryButton 
                title={uri ? "Change Video" : "Upload Video"} 
                onPress={() => pickVideo(index)}
                variant={uri ? 'outline' : 'primary'}
                style={{ flex: 1, height: 44, marginRight: uri ? 8 : 0 }}
              />
              {uri && (
                <PrimaryButton 
                  title={hotspots[index] ? "Edit Click Area" : "Set Click Area"} 
                  onPress={() => setEditingIndex(index)}
                  variant={hotspots[index] ? 'outline' : 'primary'}
                  style={{ flex: 1, height: 44 }}
                />
              )}
            </View>
          </View>
        ))}
        
        <PrimaryButton 
          title="+ Add New Step" 
          onPress={addStep} 
          variant="secondary" 
          style={styles.addBtn}
        />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton 
          title="Launch Experience" 
          onPress={() => onStart(steps.filter((s): s is string => s !== null), hotspots)}
          disabled={!canStart}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, paddingHorizontal: theme.spacing.m },
  header: { marginTop: theme.spacing.l, marginBottom: theme.spacing.xl },
  title: theme.text.title,
  subtitle: { ...theme.text.caption, marginTop: 4 },
  list: { flex: 1 },
  stepCard: { 
    marginBottom: theme.spacing.m, 
    backgroundColor: theme.colors.surface, 
    padding: theme.spacing.m, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  stepHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: theme.spacing.m },
  stepLabel: { color: theme.colors.text, fontWeight: '800', fontSize: 18 },
  status: { fontSize: 13, fontWeight: '600', marginTop: 2 },
  actionRow: { flexDirection: 'row' },
  addBtn: { marginTop: theme.spacing.s, marginBottom: theme.spacing.xl, borderStyle: 'dashed', borderWidth: 1, borderColor: theme.colors.textSecondary, backgroundColor: 'transparent' },
  footer: { paddingVertical: theme.spacing.m, borderTopWidth: 1, borderTopColor: theme.colors.border }
});
