import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Button, TextInput, RadioButton } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import dayjs from 'dayjs';

import {
  FeedingDetails,
  FeedingMethod,
  BreastSide,
  MilkType,
} from '../../types/Feeding';

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
  kidId: string;
}

export default function FeedingForm({
  onSubmit,
  initialData,
  kidId,
}: FeedingFormProps) {
  const [method, setMethod] = useState<FeedingMethod>(
    initialData?.details.method ?? FeedingMethod.BREAST
  );

  const [side, setSide] = useState<BreastSide>(
    initialData?.details.side ?? BreastSide.LEFT
  );

  const [milkType, setMilkType] = useState<MilkType>(
    initialData?.details.milkType ?? MilkType.NA
  );

  const [amount, setAmount] = useState<string>(
    initialData?.details.amount?.toString() ?? ''
  );

  const [duration, setDuration] = useState<string>(
    initialData?.details.duration?.toString() ?? ''
  );

  const [foodName, setFoodName] = useState<string>(
    initialData?.details.foodName ?? ''
  );

  const [solidQuantity, setSolidQuantity] = useState<string>('');
  const [solidNotes, setSolidNotes] = useState<string>('');

  const [timestamp, setTimestamp] = useState<Date>(
    initialData ? new Date(initialData.timestamp) : new Date()
  );

  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openTimePicker, setOpenTimePicker] = useState(false);

  // Given the current method, return what milk types are valid
  const getAvailableMilkTypes = (): MilkType[] => {
    switch (method) {
      case FeedingMethod.BREAST:
        return [MilkType.BREASTMILK_DIRECT];
      case FeedingMethod.INFANTCUP: // replacing EBM with INFANTCUP
        return [
          MilkType.FORMULA,
          MilkType.BREASTMILK_EXPRESSED,
          MilkType.MIXED,
        ];
      case FeedingMethod.BOTTLE:
        return [
          MilkType.FORMULA,
          MilkType.BREASTMILK_EXPRESSED,
          MilkType.MIXED,
        ];
      case FeedingMethod.SOLID:
      default:
        return []; // no milk type
    }
  };

  const isMilkTypeAllowed = (type: MilkType) => {
    return getAvailableMilkTypes().includes(type);
  };

  // When method changes, auto‑set milkType defaults
  useEffect(() => {
    switch (method) {
      case FeedingMethod.BREAST:
        setMilkType(MilkType.BREASTMILK_DIRECT);
        break;
      case FeedingMethod.INFANTCUP:
        if (!isMilkTypeAllowed(milkType)) {
          setMilkType(MilkType.BREASTMILK_EXPRESSED);
        }
        break;
      case FeedingMethod.SOLID:
        setMilkType(MilkType.NA);
        break;
      case FeedingMethod.BOTTLE:
        // If existing milkType is not valid, default it
        if (!isMilkTypeAllowed(milkType)) {
          setMilkType(MilkType.FORMULA);
        }
        break;
    }
  }, [method]);

  const handleSubmit = () => {
    if (
      (method === FeedingMethod.BOTTLE || method === FeedingMethod.INFANTCUP) &&
      (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
    ) {
      Alert.alert('Validation Error', 'Please enter a valid amount in ml.');
      return;
    }

    if (
      method === FeedingMethod.BREAST &&
      (!duration || isNaN(Number(duration)) || Number(duration) <= 0)
    ) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid duration in minutes.'
      );
      return;
    }

    onSubmit({
      type: 'feeding',
      timestamp: timestamp.getTime(),
      details: {
        method,
        milkType: isMilkTypeAllowed(milkType) ? milkType : MilkType.NA,
        side: method === FeedingMethod.BREAST ? side : undefined,
        amount:
          method === FeedingMethod.BOTTLE || method === FeedingMethod.INFANTCUP
            ? Number(amount)
            : undefined,
        duration:
          method === FeedingMethod.BREAST ? Number(duration) : undefined,
        foodName: method === FeedingMethod.SOLID ? foodName : undefined,
        solidQuantity:
          method === FeedingMethod.SOLID ? solidQuantity : undefined,
        solidNotes: method === FeedingMethod.SOLID ? solidNotes : undefined,
      },
    });
  };

  const handleConfirmDate = ({ date }: { date: Date | undefined }) => {
    setOpenDatePicker(false);
    if (!date) return;
    const newDate = dayjs(timestamp)
      .year(date.getFullYear())
      .month(date.getMonth())
      .date(date.getDate())
      .toDate();
    setTimestamp(newDate);
  };

  const handleConfirmTime = ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => {
    setOpenTimePicker(false);
    const newTime = dayjs(timestamp)
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0)
      .toDate();
    setTimestamp(newTime);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Feeding Method</Text>
      <RadioButton.Group
        onValueChange={(val) => setMethod(val as FeedingMethod)}
        value={method}
      >
        {[
          FeedingMethod.BREAST,
          FeedingMethod.INFANTCUP,
          FeedingMethod.BOTTLE,
          FeedingMethod.SOLID,
        ].map((fm) => (
          <View key={fm} style={styles.radioRow}>
            <RadioButton value={fm} />
            <Text style={styles.radioLabel}>{fm.toUpperCase()}</Text>
          </View>
        ))}
      </RadioButton.Group>

      {/* Milk Type (only when more than one option exists) */}
      {getAvailableMilkTypes().length > 1 && (
        <>
          <Text style={styles.label}>Milk Type</Text>
          <RadioButton.Group
            onValueChange={(val) => setMilkType(val as MilkType)}
            value={milkType}
          >
            {getAvailableMilkTypes().map((type) => (
              <View key={type} style={styles.radioRow}>
                <RadioButton value={type} />
                <Text style={styles.radioLabel}>
                  {type.replace(/-/g, ' ').replace('n/a', 'N/A').toUpperCase()}
                </Text>
              </View>
            ))}
          </RadioButton.Group>
        </>
      )}

      {/* Side (only for breast) */}
      {method === FeedingMethod.BREAST && (
        <>
          <Text style={styles.label}>Side</Text>
          <RadioButton.Group
            onValueChange={(val) => setSide(val as BreastSide)}
            value={side}
          >
            {Object.values(BreastSide).map((s) => (
              <View key={s} style={styles.radioRow}>
                <RadioButton value={s} />
                <Text style={styles.radioLabel}>{s.toUpperCase()}</Text>
              </View>
            ))}
          </RadioButton.Group>
        </>
      )}

      {/* Amount (for bottle or infant cup) */}
      {(method === FeedingMethod.BOTTLE ||
        method === FeedingMethod.INFANTCUP) && (
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

      {/* Duration (for breast) */}
      {method === FeedingMethod.BREAST && (
        <>
          <TextInput
            label="Duration (minutes)"
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
            style={styles.input}
          />
          <Text style={styles.helpText}>Time spent feeding</Text>
        </>
      )}

      {/* Solid fields */}
      {method === FeedingMethod.SOLID && (
        <>
          <TextInput
            label="Food Name"
            value={foodName}
            onChangeText={setFoodName}
            style={styles.input}
          />
          <TextInput
            label="Quantity (e.g., 2 tbsp)"
            value={solidQuantity}
            onChangeText={setSolidQuantity}
            style={styles.input}
          />
          <TextInput
            label="Notes"
            value={solidNotes}
            onChangeText={setSolidNotes}
            style={styles.input}
          />
        </>
      )}

      {/* Date & Time pickers */}
      <Text style={[styles.label, { marginTop: 16 }]}>Feeding Time</Text>
      <View style={styles.datetimeRow}>
        <TouchableOpacity
          onPress={() => setOpenDatePicker(true)}
          style={styles.datetimeInput}
        >
          <TextInput
            editable={false}
            value={dayjs(timestamp).format('YYYY-MM-DD')}
            style={[styles.input, styles.disabledInput]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setOpenTimePicker(true)}
          style={styles.datetimeInput}
        >
          <TextInput
            editable={false}
            value={dayjs(timestamp).format('HH:mm')}
            style={[styles.input, styles.disabledInput]}
          />
        </TouchableOpacity>
      </View>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={openDatePicker}
        onDismiss={() => setOpenDatePicker(false)}
        date={timestamp}
        onConfirm={handleConfirmDate}
        validRange={{ endDate: new Date() }}
      />
      <TimePickerModal
        visible={openTimePicker}
        onDismiss={() => setOpenTimePicker(false)}
        onConfirm={handleConfirmTime}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        Save Feeding
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { marginTop: 12, fontWeight: '600', fontSize: 14 },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  radioLabel: { fontSize: 12 },
  input: { marginTop: 8 },
  helpText: { fontSize: 12, color: '#666', marginBottom: 8 },
  submitButton: { marginTop: 24 },
  disabledInput: { backgroundColor: '#f9f9f9' },
  datetimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  datetimeInput: { flex: 1 },
});
