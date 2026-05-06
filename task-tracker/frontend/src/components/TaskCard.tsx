import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../types';
import { theme } from '../theme';
import { GlassCard } from './ui/GlassCard';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskCard = ({ task, onToggle, onDelete, onEdit }: TaskCardProps) => {
  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });

  return (
    <GlassCard 
      style={[styles.card, task.completed && styles.cardCompleted]} 
      padding={theme.spacing.lg}
    >
      <View style={styles.content}>
        <TouchableOpacity 
          style={[styles.checkbox, task.completed && styles.checkboxChecked]}
          onPress={() => onToggle(task._id, !task.completed)}
          activeOpacity={0.8}
        >
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>
        
        <View style={styles.textContainer}>
          <Text style={[styles.title, task.completed && styles.titleCompleted]}>
            {task.title}
          </Text>
          {task.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}
          
          <View style={styles.bottomRow}>
            <Text style={styles.date}>{formattedDate}</Text>
            
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(task)}>
                <Text style={styles.actionIcon}>✏</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDelete]} onPress={() => onDelete(task._id)}>
                <Text style={[styles.actionIcon, styles.deleteIcon]}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.md,
  },
  cardCompleted: {
    opacity: 0.65,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: theme.colors.bg.white,
    marginRight: theme.spacing.md,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  checkmark: {
    color: theme.colors.text.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.fonts.bodyMedium,
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.text.muted,
  },
  description: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.muted,
    marginTop: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  date: {
    fontSize: 11,
    fontFamily: theme.fonts.body,
    color: '#D1D5DB',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: theme.colors.bg.white,
    borderWidth: 1,
    borderColor: theme.colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnDelete: {
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  actionIcon: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  deleteIcon: {
    color: theme.colors.error,
  },
});
