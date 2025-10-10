import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button, TextInput, RadioButton } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import dayjs from 'dayjs';
import { Activity } from '../../types/Activity';

interface FeedingFormProps {
  onSubmit: (
    activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt' | 'kidId'>
  ) => void;
}

export default function FeedingForm({ onSubmit }: FeedingFormProps) {
  const [method, setMethod] = useState<'breast' | 'bottle' | 'ebm'>('breast');
  const [side, setSide] = useState<'left' | 'right' | 'both'>('left');
  const [amount, setAmount] = useState<string>(''); // ml
  const [timestamp, setTimestamp] = useState<Date>(new Date());

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const handleSubmit = () => {
    if (
      (method === 'bottle' || method === 'ebm') &&
      (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
    ) {
      alert('Please enter a valid amount in ml.');
      return;
    }
    onSubmit({
      type: 'feeding',
      timestamp: timestamp.getTime(),
      details: {
        method,
        side,
        amount: amount ? Number(amount) : undefined,
      },
    });
  };

  function handleConfirmDate({ date }: { date: Date | undefined }) {
    setOpenDatePicker(false);
    if (!date) return; // bail if undefined

    const newDate = dayjs(timestamp)
      .year(date.getFullYear())
      .month(date.getMonth())
      .date(date.getDate())
      .toDate();

    setTimestamp(newDate);
  }

  return (
    <View>
      <Text style={styles.label}>Feeding Method</Text>
      <RadioButton.Group
        onValueChange={(val) => setMethod(val as any)}
        value={method}
      >
        <View style={styles.radioRow}>
          <RadioButton value="breast" />
          <Text style={styles.radioLabel}>Breast</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="bottle" />
          <Text style={styles.radioLabel}>Bottle</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value="ebm" />
          <Text style={styles.radioLabel}>Expressed Breast Milk (EBM)</Text>
        </View>
      </RadioButton.Group>

      {(method === 'bottle' || method === 'ebm') && (
        <>
          <TextInput
            label="Amount (ml)"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />
          <Text style={styles.helpText}>Enter amount in milliliters</Text>
        </>
      )}

      {(method === 'breast' || method === 'ebm') && (
        <>
          <Text style={styles.label}>Side</Text>
          <RadioButton.Group
            onValueChange={(val) => setSide(val as any)}
            value={side}
          >
            <View style={styles.radioRow}>
              <RadioButton value="left" />
              <Text style={styles.radioLabel}>Left</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="right" />
              <Text style={styles.radioLabel}>Right</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value="both" />
              <Text style={styles.radioLabel}>Both</Text>
            </View>
          </RadioButton.Group>
        </>
      )}

      <Text style={[styles.label, { marginTop: 16 }]}>Feeding Time</Text>

      <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
        <TextInput
          editable={false}
          placeholder="Select date"
          value={dayjs(timestamp).format('YYYY-MM-DD')}
          style={[styles.input, styles.disabledInput]}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={openDatePicker}
        onDismiss={() => setOpenDatePicker(false)}
        date={timestamp}
        onConfirm={handleConfirmDate}
        validRange={{ endDate: new Date() }}
      />

      <TouchableOpacity onPress={() => setOpenTimePicker(true)}>
        <TextInput
          editable={false}
          placeholder="Select time"
          value={dayjs(timestamp).format('HH:mm')}
          style={[styles.input, styles.disabledInput]}
          pointerEvents="none"
        />
      </TouchableOpacity>

      <TimePickerModal
        visible={openTimePicker}
        onDismiss={() => setOpenTimePicker(false)}
        onConfirm={({ hours, minutes }) => {
          setOpenTimePicker(false);
          const newTime = dayjs(timestamp)
            .hour(hours)
            .minute(minutes)
            .second(0)
            .millisecond(0)
            .toDate();
          setTimestamp(newTime);
        }}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        Save Feeding
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: 12,
    fontWeight: '600',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 16,
  },
  input: {
    marginTop: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
  },
  submitButton: {
    marginTop: 24,
  },
  disabledInput: {
    backgroundColor: '#f9f9f9',
  },
});
