import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useUpdateTask } from '../hooks/useTasks';
import { Task } from '../types';

interface Props {
  task: Task | null;
  visible: boolean;
  onClose: () => void;
}

export const EditTaskModal = ({ task, visible, onClose }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const updateTask = useUpdateTask();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setErrorMsg('');
    }
  }, [task]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    if (!task) return;
    setErrorMsg('');
    if (!title.trim()) {
      setErrorMsg('Title is required');
      return;
    }
    
    updateTask.mutate(
      { 
        id: task._id, 
        data: { 
          title: title.trim(), 
          description: description.trim() || undefined 
        } 
      },
      {
        onSuccess: handleClose,
        onError: (err: Error) => setErrorMsg(err.message || 'Failed to update task'),
      }
    );
  };

  if (!task) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.overlay}
      >
        <View style={styles.container}>
          <Text style={styles.headerTitle}>Edit Task</Text>
          
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <Input
            label="Title *"
            value={title}
            onChangeText={setTitle}
            autoFocus={true}
          />

          <Input
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            multiline={true}
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
              title="Save Changes" 
              onPress={handleSubmit} 
              loading={updateTask.isPending} 
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
