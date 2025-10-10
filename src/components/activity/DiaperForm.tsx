// src/components/activities/DiaperForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, Button, Text } from 'react-native-paper';
import { Activity } from '../../types/Activity';
import { DiaperActivity, OmitMeta } from '../../types/Activity';

interface DiaperFormProps {
  onSubmit: (activity: OmitMeta<DiaperActivity>) => void;
  initialData?: OmitMeta<DiaperActivity>;
}

export default function DiaperForm({ onSubmit, initialData }: DiaperFormProps) {
  const [wet, setWet] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [timestamp] = useState(Date.now());

  const handleSubmit = () => {
    if (!wet && !dirty) {
      alert('Please select at least one option.');
      return;
    }
    if (!initialData?.kidId) {
      alert('Kid ID is missing');
      return;
    }

    onSubmit({
      type: 'diaper',
      timestamp,
      kidId: initialData.kidId,
      details: { wet, dirty },
    });
  };

  return (
    <View>
      <Text style={styles.label}>Diaper Change</Text>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={wet ? 'checked' : 'unchecked'}
          onPress={() => setWet(!wet)}
        />
        <Text style={styles.checkboxLabel}>Wet</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox
          status={dirty ? 'checked' : 'unchecked'}
          onPress={() => setDirty(!dirty)}
        />
        <Text style={styles.checkboxLabel}>Dirty</Text>
      </View>

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        Save Diaper Change
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginVertical: 12,
    fontWeight: '600',
    fontSize: 18,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  submitButton: {
    marginTop: 24,
  },
});
