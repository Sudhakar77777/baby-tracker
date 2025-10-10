import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import dayjs from 'dayjs';
import { BathActivity, OmitMeta } from '../../types/Activity';

interface BathFormProps {
  onSubmit: (activity: OmitMeta<BathActivity>) => void;
  initialData?: OmitMeta<BathActivity>;
}

export default function BathForm({ onSubmit, initialData }: BathFormProps) {
  const [content, setContent] = useState(initialData?.details.content ?? '');
  const [date, setDate] = useState<Date | undefined>(
    initialData ? new Date(initialData.timestamp) : undefined
  );
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) {
      alert('Please enter bath details.');
      return;
    }
    if (!date) {
      alert('Please select a date.');
      return;
    }
    if (!initialData?.kidId) {
      alert('Kid ID is missing');
      return;
    }

    onSubmit({
      type: 'bath',
      timestamp: date.getTime(),
      kidId: initialData.kidId,
      details: { content: content.trim() },
    });
  };

  return (
    <View>
      <TextInput
        label="Bath Details"
        value={content}
        onChangeText={setContent}
        style={styles.input}
        multiline
      />
      <Text style={styles.label}>Date</Text>

      <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
        <TextInput
          editable={false}
          placeholder="Select date"
          value={date ? dayjs(date).format('YYYY-MM-DD') : ''}
          style={[styles.input, styles.disabledInput]}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={openDatePicker}
        onDismiss={() => setOpenDatePicker(false)}
        date={date}
        onConfirm={({ date }) => {
          setOpenDatePicker(false);
          setDate(date);
        }}
        validRange={{ endDate: new Date() }}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        Save Bath
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 12,
  },
  disabledInput: {
    backgroundColor: '#f9f9f9',
  },
  label: {
    marginTop: 16,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 24,
  },
});
