import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Modal, Portal } from 'react-native-paper';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onCancel}
        contentContainerStyle={styles.modalContent}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonsContainer}>
          <Button title="Cancel" onPress={onCancel} color="gray" />
          <Button title="Confirm" onPress={onConfirm} color="red" />
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
