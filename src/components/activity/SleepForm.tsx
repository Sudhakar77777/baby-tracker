import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import dayjs from 'dayjs';

import { SleepActivity } from '../../types/Activity';
import { OmitMeta } from '../../types/Activity';

interface SleepFormProps {
  onSubmit: (activity: OmitMeta<SleepActivity>) => void;
  initialData?: OmitMeta<SleepActivity>;
  kidId: string;
}

export default function SleepForm({
  onSubmit,
  initialData,
  kidId,
}: SleepFormProps) {
  // Default start date is yesterday
  const defaultStartDate = dayjs().subtract(1, 'day').startOf('day').toDate();
  // Default start time 9pm yesterday
  const defaultStartTime = dayjs(defaultStartDate)
    .hour(21)
    .minute(0)
    .second(0)
    .toDate();

  // Default end date today
  const defaultEndDate = dayjs().startOf('day').toDate();
  // Default end time 6am today
  const defaultEndTime = dayjs(defaultEndDate)
    .hour(6)
    .minute(0)
    .second(0)
    .toDate();

  // States for date and time pickers
  const [startDate, setStartDate] = useState<Date>(
    initialData ? new Date(initialData.details.start) : defaultStartDate
  );
  const [startTime, setStartTime] = useState<Date>(
    initialData ? new Date(initialData.details.start) : defaultStartTime
  );
  const [endDate, setEndDate] = useState<Date>(
    initialData ? new Date(initialData.details.end) : defaultEndDate
  );
  const [endTime, setEndTime] = useState<Date>(
    initialData ? new Date(initialData.details.end) : defaultEndTime
  );

  const [openStartDate, setOpenStartDate] = useState(false);
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);

  // Duration override fields (hours and minutes)
  const [overrideHours, setOverrideHours] = useState<string>('');
  const [overrideMinutes, setOverrideMinutes] = useState<string>('');

  // Store total override duration in minutes internally
  const [overrideMinutesTotal, setOverrideMinutesTotal] = useState<
    number | null
  >(null);

  // Helper to combine date and time into one Date object
  const combineDateTime = (date: Date, time: Date): Date => {
    return dayjs(date)
      .hour(time.getHours())
      .minute(time.getMinutes())
      .second(0)
      .millisecond(0)
      .toDate();
  };

  // Compute duration in minutes between start and end datetime
  const computedDurationMinutes = Math.round(
    (combineDateTime(endDate, endTime).getTime() -
      combineDateTime(startDate, startTime).getTime()) /
      60000
  );

  // When duration override changes, update the overrideMinutesTotal accordingly
  useEffect(() => {
    if (overrideHours === '' && overrideMinutes === '') {
      setOverrideMinutesTotal(null);
      return; // no override
    }
    const h = parseInt(overrideHours) || 0;
    const m = parseInt(overrideMinutes) || 0;
    if (h < 0 || m < 0 || m > 59) return; // invalid input, ignore
    setOverrideMinutesTotal(h * 60 + m);
  }, [overrideHours, overrideMinutes]);

  // When overrideMinutesTotal changes, update override fields accordingly
  useEffect(() => {
    if (overrideMinutesTotal === null) {
      setOverrideHours('');
      setOverrideMinutes('');
    } else {
      const h = Math.floor(overrideMinutesTotal / 60);
      const m = overrideMinutesTotal % 60;
      setOverrideHours(h.toString());
      setOverrideMinutes(m.toString().padStart(2, '0'));
    }
  }, [overrideMinutesTotal]);

  // On submit, use override duration if set, else computed duration
  const handleSubmit = () => {
    const start = combineDateTime(startDate, startTime);
    const end = combineDateTime(endDate, endTime);

    // Validate end is after start if override not used or <= 0
    if ((!overrideMinutesTotal || overrideMinutesTotal <= 0) && end <= start) {
      Alert.alert('End time must be after start time.');
      return;
    }

    // Determine final duration (in minutes)
    const finalDuration = overrideMinutesTotal ?? computedDurationMinutes;

    // If override is used, compute end time from start + override duration
    const finalEnd = overrideMinutesTotal
      ? dayjs(start).add(overrideMinutesTotal, 'minute').toDate()
      : end;

    onSubmit({
      type: 'sleep',
      timestamp: Date.now(), // **current time on save**
      details: {
        start: start.getTime(),
        end: finalEnd.getTime(),
        duration: finalDuration,
      },
      kidId,
    });
  };

  // Formatters
  const formatDate = (date: Date) => dayjs(date).format('YYYY-MM-DD');
  const formatTime = (date: Date) => dayjs(date).format('HH:mm');

  return (
    <View>
      {/* Sleep Begin */}
      <Text style={styles.sectionHeader}>Sleep Begin</Text>
      <View style={styles.row}>
        <Pressable
          onPress={() => setOpenStartDate(true)}
          style={[styles.dateTimePicker, { marginRight: 12 }]}
        >
          <TextInput
            mode="flat"
            label="Date"
            editable={false}
            value={formatDate(startDate)}
            style={styles.flexInput}
          />
        </Pressable>
        <Pressable
          onPress={() => setOpenStartTime(true)}
          style={styles.dateTimePicker}
        >
          <TextInput
            mode="flat"
            label="Time"
            editable={false}
            value={formatTime(startTime)}
            style={styles.flexInput}
          />
        </Pressable>
      </View>

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
        hours={startTime.getHours()}
        minutes={startTime.getMinutes()}
      />

      {/* Sleep End */}
      <Text style={styles.sectionHeader}>Sleep End</Text>
      <View style={styles.row}>
        <Pressable
          onPress={() => setOpenEndDate(true)}
          style={[styles.dateTimePicker, { marginRight: 12 }]}
        >
          <TextInput
            mode="flat"
            label="Date"
            editable={false}
            value={formatDate(endDate)}
            style={styles.flexInput}
          />
        </Pressable>
        <Pressable
          onPress={() => setOpenEndTime(true)}
          style={styles.dateTimePicker}
        >
          <TextInput
            mode="flat"
            label="Time"
            editable={false}
            value={formatTime(endTime)}
            style={styles.flexInput}
          />
        </Pressable>
      </View>

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
        hours={endTime.getHours()}
        minutes={endTime.getMinutes()}
      />

      {/* Computed Duration (read-only) */}
      <Text style={styles.sectionHeader}>Duration (computed)</Text>
      <Text style={styles.durationText}>
        {Math.floor(computedDurationMinutes / 60)}h{' '}
        {computedDurationMinutes % 60}m
      </Text>

      {/* Override Duration Inputs */}
      <Text style={styles.sectionHeader}>
        Override Duration (hours, minutes)
      </Text>
      <View style={styles.row}>
        <TextInput
          mode="flat"
          label="Hours"
          keyboardType="numeric"
          style={[styles.flexInput, { marginRight: 8 }]}
          value={overrideHours}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) setOverrideHours(text);
          }}
          placeholder="0"
        />
        <TextInput
          mode="flat"
          label="Minutes"
          keyboardType="numeric"
          style={styles.flexInput}
          value={overrideMinutes}
          onChangeText={(text) => {
            if (/^\d*$/.test(text) && Number(text) < 60)
              setOverrideMinutes(text);
          }}
          placeholder="0"
        />
      </View>

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
  sectionHeader: {
    marginTop: 20,
    fontWeight: '600',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dateTimePicker: {
    flex: 0.45,
  },
  flexInput: {
    flex: 1,
  },
  durationText: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 32,
  },
});
