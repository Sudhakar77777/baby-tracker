// src/components/activities/DiaperForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox, Button, Text, TextInput } from 'react-native-paper';
import { DiaperActivity, OmitMeta } from '../../types/Activity';

interface DiaperFormProps {
  onSubmit: (activity: OmitMeta<DiaperActivity>) => void;
  initialData?: OmitMeta<DiaperActivity>;
  kidId: string;
}

export default function DiaperForm({
  onSubmit,
  initialData,
  kidId,
}: DiaperFormProps) {
  const [wet, setWet] = useState(initialData?.details.wet ?? false);
  const [dirty, setDirty] = useState(initialData?.details.dirty ?? false);
  const [notes, setNotes] = useState(initialData?.details.notes ?? '');
  const [timestamp] = useState(Date.now());

  const handleSubmit = () => {
    if (!wet && !dirty) {
      alert('Please select at least one option.');
      return;
    }
    onSubmit({
      type: 'diaper',
      timestamp,
      kidId,
      details: { wet, dirty, notes: notes.trim() ? notes : undefined },
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

      <TextInput
        label="Notes (optional)"
        mode="outlined"
        multiline
        numberOfLines={3}
        value={notes}
        onChangeText={setNotes}
        style={styles.notesInput}
      />

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
  notesInput: {
    marginTop: 12,
    backgroundColor: 'white',
  },
  submitButton: {
    marginTop: 24,
  },
});
