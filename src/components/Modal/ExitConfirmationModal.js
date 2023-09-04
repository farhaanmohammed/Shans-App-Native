import React from 'react';
import { View, Text, Button, Modal } from 'react-native';

const ExitConfirmationModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 20 }}>
          <Text>Are you sure you want to exit the app?</Text>
          <Button title="Cancel" onPress={onClose} />
          <Button title="Exit" onPress={onConfirm} />
        </View>
      </View>
    </Modal>
  );
};

export default ExitConfirmationModal;
