import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useUpdateTask } from '../hooks/useTasks';
import { Task } from '../types';
import { theme } from '../theme';
import { GlassCard } from './ui/GlassCard';

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
        style={styles.backdrop}
      >
        <TouchableOpacity style={styles.touchableBackdrop} activeOpacity={1} onPress={handleClose} />
        
        <GlassCard style={styles.container} padding={theme.spacing.xl}>
          <View style={styles.handle} />
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
            numberOfLines={3}
            style={styles.textArea}
          />

          <View style={styles.actions}>
            <Button 
              title="Cancel" 
              variant="secondary" 
              onPress={handleClose} 
              style={styles.flex1} 
            />
            <View style={{ width: 12 }} />
            <Button 
              title="Save" 
              onPress={handleSubmit} 
              loading={updateTask.isPending} 
              style={styles.flex1} 
            />
          </View>
        </GlassCard>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  touchableBackdrop: {
    flex: 1,
  },
  container: {
    backgroundColor: theme.colors.bg.glassStrong,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing.xl,
    borderWidth: 0,
    borderTopWidth: 1,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.text.error,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
    marginBottom: theme.spacing.md,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
  },
  flex1: {
    flex: 1,
  },
});
