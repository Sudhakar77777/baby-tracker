import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { NoteActivity, OmitMeta } from '../../types/Activity';

interface NoteFormProps {
  onSubmit: (activity: OmitMeta<NoteActivity>) => void;
  initialData?: OmitMeta<NoteActivity>;
}

export default function NoteForm({ onSubmit, initialData }: NoteFormProps) {
  const [content, setContent] = useState(initialData?.details.content ?? '');
  const [timestamp] = useState(
    initialData ? initialData.timestamp : Date.now()
  );

  const handleSubmit = () => {
    if (!content.trim()) {
      alert('Please enter some note content.');
      return;
    }
    if (!initialData?.kidId) {
      alert('Kid ID is missing');
      return;
    }

    onSubmit({
      type: 'note',
      timestamp,
      kidId: initialData.kidId,
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
