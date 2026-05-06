import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useCreateTask } from '../hooks/useTasks';
import { theme } from '../theme';
import { GlassCard } from './ui/GlassCard';

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
        style={styles.backdrop}
      >
        <TouchableOpacity style={styles.touchableBackdrop} activeOpacity={1} onPress={handleClose} />
        
        <GlassCard style={styles.container} padding={theme.spacing.xl}>
          <View style={styles.handle} />
          <Text style={styles.headerTitle}>New Task</Text>
          
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <Input
            label="Title *"
            placeholder="What needs to be done?"
            value={title}
            onChangeText={setTitle}
            autoFocus={true}
          />

          <Input
            label="Description (Optional)"
            placeholder="Add details..."
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
              title="Create" 
              onPress={handleSubmit} 
              loading={createTask.isPending} 
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
