import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useCreateTask } from '../hooks/useTasks';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const CreateTaskModal = ({ visible, onClose }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const createTask = useCreateTask();

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setErrorMsg('');
    onClose();
  };

  const handleSubmit = () => {
    setErrorMsg('');
    if (!title.trim()) {
      setErrorMsg('Title is required');
      return;
    }
    createTask.mutate(
      { title: title.trim(), description: description.trim() || undefined },
      {
        onSuccess: handleClose,
        onError: (err: Error) => setErrorMsg(err.message || 'Failed to create task'),
      }
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.overlay}
      >
        <View style={styles.container}>
          <Text style={styles.headerTitle}>New Task</Text>
          
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <Input
            label="Title *"
            placeholder="What needs to be done?"
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <Input
            label="Description (Optional)"
            placeholder="Add details..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={{ height: 80, textAlignVertical: 'top' }}
          />

          <View style={styles.actions}>
            <Button 
              title="Cancel" 
              variant="secondary" 
              onPress={handleClose} 
              style={styles.cancelBtn} 
            />
            <Button 
              title="Save" 
              onPress={handleSubmit} 
              loading={createTask.isPending} 
              style={styles.saveBtn} 
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
  },
  saveBtn: {
    flex: 1,
    marginLeft: 8,
  },
});
