import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { NoteActivity, OmitMeta } from '../../types/Activity';

interface NoteFormProps {
  onSubmit: (activity: OmitMeta<NoteActivity>) => void;
  initialData?: OmitMeta<NoteActivity>;
  kidId: string;
}

export default function NoteForm({
  onSubmit,
  initialData,
  kidId,
}: NoteFormProps) {
  const [content, setContent] = useState(initialData?.details.content ?? '');
  const [timestamp] = useState(
    initialData ? initialData.timestamp : Date.now()
  );
  console.log('initialData:', initialData);

  const handleSubmit = () => {
    if (!content.trim()) {
      alert('Please enter some note content.');
      return;
    }
    onSubmit({
      type: 'note',
      timestamp,
      kidId,
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
