import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button, TextInput, RadioButton } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import dayjs from 'dayjs';

import { FeedingDetails, FeedingMethod, BreastSide } from '../../types/Feeding';

interface FeedingFormProps {
  onSubmit: (
    activity: Omit<
      {
        type: 'feeding';
        timestamp: number;
        details: FeedingDetails;
      },
      'kidId' | 'id' | 'createdAt' | 'updatedAt'
    >
  ) => void;
  initialData?: Omit<
    {
      type: 'feeding';
      timestamp: number;
      details: FeedingDetails;
    },
    'kidId' | 'id' | 'createdAt' | 'updatedAt'
  >;
}

export default function FeedingForm({
  onSubmit,
  initialData,
}: FeedingFormProps) {
  // use constants from FeedingMethod and BreastSide
  const [method, setMethod] = useState<FeedingMethod>(
    initialData?.details.method ?? FeedingMethod.BREAST
  );

  const [side, setSide] = useState<BreastSide>(
    initialData?.details.side ?? BreastSide.LEFT
  );

  const [amount, setAmount] = useState<string>(
    initialData?.details.amount?.toString() ?? ''
  );

  const [timestamp, setTimestamp] = useState<Date>(
    initialData ? new Date(initialData.timestamp) : new Date()
  );

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  const handleSubmit = () => {
    if (
      (method === FeedingMethod.BOTTLE || method === FeedingMethod.EBM) &&
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
    if (!date) return;

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
        onValueChange={(val) => setMethod(val as FeedingMethod)}
        value={method}
      >
        <View style={styles.radioRow}>
          <RadioButton value={FeedingMethod.BREAST} />
          <Text style={styles.radioLabel}>Breast</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value={FeedingMethod.BOTTLE} />
          <Text style={styles.radioLabel}>Bottle</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value={FeedingMethod.EBM} />
          <Text style={styles.radioLabel}>Expressed Breast Milk (EBM)</Text>
        </View>
        <View style={styles.radioRow}>
          <RadioButton value={FeedingMethod.SOLID} />
          <Text style={styles.radioLabel}>Solid</Text>
        </View>
      </RadioButton.Group>

      {(method === FeedingMethod.BOTTLE || method === FeedingMethod.EBM) && (
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

      {(method === FeedingMethod.BREAST || method === FeedingMethod.EBM) && (
        <>
          <Text style={styles.label}>Side</Text>
          <RadioButton.Group
            onValueChange={(val) => setSide(val as BreastSide)}
            value={side}
          >
            <View style={styles.radioRow}>
              <RadioButton value={BreastSide.LEFT} />
              <Text style={styles.radioLabel}>Left</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value={BreastSide.RIGHT} />
              <Text style={styles.radioLabel}>Right</Text>
            </View>
            <View style={styles.radioRow}>
              <RadioButton value={BreastSide.BOTH} />
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
