import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Activity } from '../../types/Activity';

dayjs.extend(duration);

interface SleepFormProps {
  onSubmit: (
    activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'kidId'>
  ) => void;
}

export default function SleepForm({ onSubmit }: SleepFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);

  const [openStartDate, setOpenStartDate] = useState(false);
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);

  // Combine date and time to full Date object
  const combineDateTime = (date: Date | undefined, time: Date | undefined) => {
    if (!date || !time) return undefined;
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

    if (!start || !end) {
      Alert.alert('Please select both start and end date & time.');
      return;
    }
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
      duration: durationMinutes,
      details: { start: start.getTime(), end: end.getTime() },
    });
  };

  const formatDate = (date: Date | undefined) =>
    date ? dayjs(date).format('YYYY-MM-DD') : '';
  const formatTime = (date: Date | undefined) =>
    date ? dayjs(date).format('HH:mm') : '';

  return (
    <View>
      <Text style={styles.label}>Sleep Start</Text>
      <TouchableOpacity onPress={() => setOpenStartDate(true)}>
        <TextInput
          editable={false}
          placeholder="Select start date"
          value={formatDate(startDate)}
          style={[styles.input, styles.disabledInput]}
          pointerEvents="none"
        />
      </TouchableOpacity>
      <DatePickerModal
        locale="en"
        mode="single"
        visible={openStartDate}
        onDismiss={() => setOpenStartDate(false)}
        date={startDate}
        onConfirm={({ date }) => {
          setOpenStartDate(false);
          setStartDate(date);
        }}
        validRange={{ endDate: new Date() }}
      />

      <TouchableOpacity onPress={() => setOpenStartTime(true)}>
        <TextInput
          editable={false}
          placeholder="Select start time"
          value={formatTime(startTime)}
          style={[styles.input, styles.disabledInput]}
          pointerEvents="none"
        />
      </TouchableOpacity>
      <TimePickerModal
        visible={openStartTime}
        onDismiss={() => setOpenStartTime(false)}
        onConfirm={({ hours, minutes }) => {
          setOpenStartTime(false);
          const d = startTime || new Date();
          setStartTime(
            dayjs(d)
              .hour(hours)
              .minute(minutes)
              .second(0)
              .millisecond(0)
              .toDate()
          );
        }}
      />

      <Text style={styles.label}>Sleep End</Text>
      <TouchableOpacity onPress={() => setOpenEndDate(true)}>
        <TextInput
          editable={false}
          placeholder="Select end date"
          value={formatDate(endDate)}
          style={[styles.input, styles.disabledInput]}
          pointerEvents="none"
        />
      </TouchableOpacity>
      <DatePickerModal
        locale="en"
        mode="single"
        visible={openEndDate}
        onDismiss={() => setOpenEndDate(false)}
        date={endDate}
        onConfirm={({ date }) => {
          setOpenEndDate(false);
          setEndDate(date);
        }}
        validRange={{ endDate: new Date() }}
      />

      <TouchableOpacity onPress={() => setOpenEndTime(true)}>
        <TextInput
          editable={false}
          placeholder="Select end time"
          value={formatTime(endTime)}
          style={[styles.input, styles.disabledInput]}
          pointerEvents="none"
        />
      </TouchableOpacity>
      <TimePickerModal
        visible={openEndTime}
        onDismiss={() => setOpenEndTime(false)}
        onConfirm={({ hours, minutes }) => {
          setOpenEndTime(false);
          const d = endTime || new Date();
          setEndTime(
            dayjs(d)
              .hour(hours)
              .minute(minutes)
              .second(0)
              .millisecond(0)
              .toDate()
          );
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
