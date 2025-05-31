import React from 'react';
import {
  View,
  Text,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

const Loading = () => {
  return (
    <Modal transparent animationType="fade" visible>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.text}>Uploading image...</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              Alert.alert('Please wait', 'Image is still uploading')
            }
          >
            <Text style={styles.buttonText}>Loading</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    width: '80%',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#2563eb',
    fontWeight: '600',
  },
});

export default Loading;
