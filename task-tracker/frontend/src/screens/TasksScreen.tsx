import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, Platform, Animated } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { useTasks, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { TaskCard } from '../components/TaskCard';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { EditTaskModal } from '../components/EditTaskModal';
import { Task } from '../types';
import { GlassCard } from '../components/ui/GlassCard';
import { theme } from '../theme';

type FilterType = 'all' | 'pending' | 'completed';

export const TasksScreen = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const { data: tasks, isLoading, isError, refetch, isRefetching } = useTasks();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [filter, setFilter] = useState<FilterType>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const pulseAnim = new Animated.Value(0.5);

  useEffect(() => {
    if (isLoading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 0.5, duration: 800, useNativeDriver: true })
        ])
      ).start();
    }
  }, [isLoading]);

  const handleLogout = async () => {
    queryClient.clear();
    await logout();
  };

  const handleToggle = (id: string, completed: boolean) => {
    updateTask.mutate({ id, data: { completed } });
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask.mutate(id) },
    ]);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
  };

  const allTasks = tasks ?? [];
  const pendingCount = allTasks.filter(t => !t.completed).length;
  const doneCount = allTasks.filter(t => t.completed).length;

  const filteredTasks = allTasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const renderEmptyState = () => {
    if (isLoading) return null;
    let title = 'No tasks yet';
    let sub = 'Tap + to create your first task';
    if (filter === 'pending') { title = 'All caught up!'; sub = 'No pending tasks left.'; }
    if (filter === 'completed') { title = 'Nothing here'; sub = 'You haven\'t completed any tasks yet.'; }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🌱</Text>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySub}>{sub}</Text>
      </View>
    );
  };

  const renderSkeleton = () => (
    <View style={{ paddingHorizontal: theme.spacing.xl, gap: 10 }}>
      {[1, 2, 3].map(i => (
        <Animated.View key={i} style={{ opacity: pulseAnim }}>
          <GlassCard style={styles.skeletonCard} />
        </Animated.View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Tasks</Text>
            {allTasks.length > 0 && (
              <Text style={styles.subtitle}>{pendingCount} pending · {doneCount} done</Text>
            )}
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutIcon}>🚪</Text>
          </TouchableOpacity>
        </View>

        <GlassCard style={styles.filterCard} padding={4}>
          {(['all', 'pending', 'completed'] as FilterType[]).map((f) => {
            const isActive = filter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterPill, isActive && styles.activePill]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </GlassCard>

        {isLoading ? (
          renderSkeleton()
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TaskCard 
                task={item} 
                onToggle={handleToggle} 
                onDelete={handleDelete} 
                onEdit={handleEdit} 
              />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyState}
            refreshing={isRefetching}
            onRefresh={refetch}
            showsVerticalScrollIndicator={false}
          />
        )}

        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => setShowCreateModal(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        <CreateTaskModal 
          visible={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />

        <EditTaskModal 
          task={editingTask} 
          visible={editingTask !== null} 
          onClose={() => setEditingTask(null)} 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 56 : 16,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.heading,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.text.muted,
    fontFamily: theme.fonts.body,
    marginTop: 2,
  },
  logoutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    fontSize: 14,
  },
  filterCard: {
    flexDirection: 'row',
    borderRadius: theme.radius.full,
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: theme.radius.full,
  },
  activePill: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontFamily: theme.fonts.bodyMedium,
    color: theme.colors.text.secondary,
  },
  activeFilterText: {
    color: theme.colors.text.white,
  },
  listContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: 100,
    gap: 10,
  },
  skeletonCard: {
    height: 72,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bodyMedium,
    color: '#374151',
  },
  emptySub: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.muted,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 52,
    height: 52,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.fab,
  },
  fabText: {
    fontSize: 24,
    color: theme.colors.text.white,
    fontWeight: '300',
    marginTop: -2,
  },
});
