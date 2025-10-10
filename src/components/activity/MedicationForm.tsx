import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TextInput, Button, RadioButton } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import dayjs from 'dayjs';
import { MedicationActivity, OmitMeta } from '../../types/Activity';
import { MedicationUnit } from '../../types/Medication';

interface MedicationFormProps {
  onSubmit: (activity: OmitMeta<MedicationActivity>) => void;
  initialData?: OmitMeta<MedicationActivity>;
  kidId: string;
}

export default function MedicationForm({
  onSubmit,
  initialData,
  kidId,
}: MedicationFormProps) {
  const [medicationName, setMedicationName] = useState(
    initialData?.details.name ?? ''
  );
  const [dose, setDose] = useState(initialData?.details.dose ?? '');
  const [reason, setReason] = useState(initialData?.details.reason ?? '');
  const [unit, setUnit] = useState<MedicationUnit>(
    initialData?.details.unit ?? 'ml'
  );
  const [date, setDate] = useState<Date | undefined>(
    initialData ? new Date(initialData.timestamp) : undefined
  );
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleSubmit = () => {
    if (!medicationName.trim()) {
      alert('Please enter medication name.');
      return;
    }
    if (!dose.trim() || isNaN(Number(dose)) || Number(dose) <= 0) {
      alert('Please enter a valid dose.');
      return;
    }
    if (!date) {
      alert('Please select a date.');
      return;
    }
    onSubmit({
      type: 'medication',
      timestamp: date.getTime(),
      kidId,
      details: {
        name: medicationName.trim(),
        dose: dose.trim(),
        unit,
        reason: reason.trim() || undefined,
      },
    });
  };

  return (
    <View>
      <TextInput
        label="Medication Name"
        value={medicationName}
        onChangeText={setMedicationName}
        style={styles.input}
      />
      <TextInput
        label="Dose"
        value={dose}
        onChangeText={setDose}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Reason (optional)"
        value={reason}
        onChangeText={setReason}
        style={styles.input}
      />

      <Text style={{ marginTop: 10 }}>Unit:</Text>
      <RadioButton.Group
        onValueChange={(value) => setUnit(value as 'ml' | 'drops' | 'tablet')}
        value={unit}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <RadioButton.Item label="ml" value="ml" />
          <RadioButton.Item label="drops" value="drops" />
          <RadioButton.Item label="tablet" value="tablet" />
        </View>
      </RadioButton.Group>

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
        Save Medication
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
