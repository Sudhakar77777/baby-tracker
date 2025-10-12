import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import dayjs from 'dayjs';
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

  // Initialize date and time from initialData timestamp or now
  const initialDateTime = initialData
    ? new Date(initialData.timestamp)
    : new Date();

  const [date, setDate] = useState<Date>(initialDateTime);
  const [time, setTime] = useState<Date>(initialDateTime);

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  // Helpers to format date and time strings for display
  const formatDate = (d: Date) => dayjs(d).format('YYYY-MM-DD');
  const formatTime = (t: Date) => dayjs(t).format('HH:mm');

  // Combine date and time into one Date object on submit
  const combineDateTime = (date: Date, time: Date): Date => {
    return dayjs(date)
      .hour(time.getHours())
      .minute(time.getMinutes())
      .second(0)
      .millisecond(0)
      .toDate();
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      alert('Please enter some note content.');
      return;
    }

    const timestamp = combineDateTime(date, time).getTime();

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

      <View style={styles.row}>
        <Pressable
          style={styles.picker}
          onPress={() => setOpenDatePicker(true)}
        >
          <TextInput
            label="Date"
            mode="flat"
            editable={false}
            value={formatDate(date)}
            pointerEvents="none"
          />
        </Pressable>

        <Pressable
          style={styles.picker}
          onPress={() => setOpenTimePicker(true)}
        >
          <TextInput
            label="Time"
            mode="flat"
            editable={false}
            value={formatTime(time)}
            pointerEvents="none"
          />
        </Pressable>
      </View>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={openDatePicker}
        onDismiss={() => setOpenDatePicker(false)}
        date={date}
        onConfirm={({ date }) => {
          if (date) setDate(date);
          setOpenDatePicker(false);
        }}
        validRange={{ endDate: new Date() }}
      />

      <TimePickerModal
        visible={openTimePicker}
        onDismiss={() => setOpenTimePicker(false)}
        onConfirm={({ hours, minutes }) => {
          const newTime = dayjs(time)
            .hour(hours)
            .minute(minutes)
            .second(0)
            .millisecond(0)
            .toDate();
          setTime(newTime);
          setOpenTimePicker(false);
        }}
        hours={time.getHours()}
        minutes={time.getMinutes()}
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  picker: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    marginTop: 24,
  },
});
