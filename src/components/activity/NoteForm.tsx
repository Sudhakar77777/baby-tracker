// src/components/activities/NoteForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Activity } from '../../types/Activity';

interface NoteFormProps {
  onSubmit: (
    activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'kidId'>
  ) => void;
}

export default function NoteForm({ onSubmit }: NoteFormProps) {
  const [content, setContent] = useState('');
  const [timestamp] = useState(Date.now());

  const handleSubmit = () => {
    if (!content.trim()) {
      alert('Please enter some note content.');
      return;
    }
    onSubmit({
      type: 'note',
      timestamp,
      details: { content: content.trim() },
    });
  };

  return (
    <View>
      <TextInput
        label="Note"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={4}
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        Save Note
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 12,
  },
  submitButton: {
    marginTop: 24,
  },
});
