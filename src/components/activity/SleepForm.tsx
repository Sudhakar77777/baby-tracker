import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { SleepActivity } from '../../types/Activity';
import { OmitMeta } from '../../types/Activity';

dayjs.extend(duration);

interface SleepFormProps {
  onSubmit: (activity: OmitMeta<SleepActivity>) => void;
  initialData?: OmitMeta<SleepActivity>;
}

export default function SleepForm({ onSubmit, initialData }: SleepFormProps) {
  const [startDate, setStartDate] = useState<Date>(
    initialData ? new Date(initialData.details.start) : new Date()
  );
  const [startTime, setStartTime] = useState<Date>(
    initialData ? new Date(initialData.details.start) : new Date()
  );
  const [endDate, setEndDate] = useState<Date>(
    initialData ? new Date(initialData.details.end) : new Date()
  );
  const [endTime, setEndTime] = useState<Date>(
    initialData ? new Date(initialData.details.end) : new Date()
  );

  const [openStartDate, setOpenStartDate] = useState(false);
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);

  const combineDateTime = (date: Date, time: Date): Date => {
    return dayjs(date)
      .hour(time.getHours())
      .minute(time.getMinutes())
      .second(0)
      .millisecond(0)
      .toDate();
  };

  const handleSubmit = () => {
    const start = combineDateTime(startDate, startTime);
    const end = combineDateTime(endDate, endTime);

    if (end <= start) {
      Alert.alert('End time must be after start time.');
      return;
    }

    const durationMinutes = Math.round(
      (end.getTime() - start.getTime()) / 60000
    );

    onSubmit({
      type: 'sleep',
      timestamp: start.getTime(),
      duration: durationMinutes, // in minutes
      details: {
        start: start.getTime(),
        end: end.getTime(),
      },
      kidId: initialData?.kidId!,
    });
  };

  const formatDate = (date: Date) => dayjs(date).format('YYYY-MM-DD');
  const formatTime = (date: Date) => dayjs(date).format('HH:mm');

  return (
    <View>
      <Text style={styles.label}>Sleep Start</Text>
      <TouchableOpacity onPress={() => setOpenStartDate(true)}>
        <TextInput
          editable={false}
          placeholder="Select start date"
          value={formatDate(startDate)}
          style={[styles.input, styles.disabledInput]}
        />
      </TouchableOpacity>
      <DatePickerModal
        locale="en"
        mode="single"
        visible={openStartDate}
        onDismiss={() => setOpenStartDate(false)}
        date={startDate}
        onConfirm={({ date }) => {
          if (date) setStartDate(date);
          setOpenStartDate(false);
        }}
        validRange={{ endDate: new Date() }}
      />

      <TouchableOpacity onPress={() => setOpenStartTime(true)}>
        <TextInput
          editable={false}
          placeholder="Select start time"
          value={formatTime(startTime)}
          style={[styles.input, styles.disabledInput]}
        />
      </TouchableOpacity>
      <TimePickerModal
        visible={openStartTime}
        onDismiss={() => setOpenStartTime(false)}
        onConfirm={({ hours, minutes }) => {
          const newTime = dayjs(startTime)
            .hour(hours)
            .minute(minutes)
            .second(0)
            .millisecond(0)
            .toDate();
          setStartTime(newTime);
          setOpenStartTime(false);
        }}
      />

      <Text style={styles.label}>Sleep End</Text>
      <TouchableOpacity onPress={() => setOpenEndDate(true)}>
        <TextInput
          editable={false}
          placeholder="Select end date"
          value={formatDate(endDate)}
          style={[styles.input, styles.disabledInput]}
        />
      </TouchableOpacity>
      <DatePickerModal
        locale="en"
        mode="single"
        visible={openEndDate}
        onDismiss={() => setOpenEndDate(false)}
        date={endDate}
        onConfirm={({ date }) => {
          if (date) setEndDate(date);
          setOpenEndDate(false);
        }}
        validRange={{ endDate: new Date() }}
      />

      <TouchableOpacity onPress={() => setOpenEndTime(true)}>
        <TextInput
          editable={false}
          placeholder="Select end time"
          value={formatTime(endTime)}
          style={[styles.input, styles.disabledInput]}
        />
      </TouchableOpacity>
      <TimePickerModal
        visible={openEndTime}
        onDismiss={() => setOpenEndTime(false)}
        onConfirm={({ hours, minutes }) => {
          const newTime = dayjs(endTime)
            .hour(hours)
            .minute(minutes)
            .second(0)
            .millisecond(0)
            .toDate();
          setEndTime(newTime);
          setOpenEndTime(false);
        }}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        Save Sleep
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
