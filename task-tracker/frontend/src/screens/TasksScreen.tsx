import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, Platform } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { useTasks, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { TaskCard } from '../components/TaskCard';
import { FilterBar, FilterType } from '../components/FilterBar';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { EditTaskModal } from '../components/EditTaskModal';
import { Task } from '../types';
import { Button } from '../components/ui/Button';

export const TasksScreen = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const { data: tasks, isLoading, isError, refetch, isRefetching } = useTasks();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [filter, setFilter] = useState<FilterType>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  const filteredTasks = tasks?.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  }) || [];

  const completedCount = tasks?.filter(t => t.completed).length || 0;
  const totalCount = tasks?.length || 0;

  const renderEmptyState = () => {
    let msg = 'No tasks found';
    if (filter === 'all') msg = 'No tasks yet. Create your first task!';
    if (filter === 'pending') msg = 'No pending tasks 🎉';
    if (filter === 'completed') msg = 'No completed tasks yet';

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{msg}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Tasks</Text>
            {totalCount > 0 && (
              <Text style={styles.subtitle}>{completedCount}/{totalCount} completed</Text>
            )}
          </View>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <FilterBar currentFilter={filter} onFilterChange={setFilter} />

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#6366F1" />
          </View>
        ) : isError ? (
          <View style={styles.center}>
            <Text style={styles.errorText}>Failed to load tasks.</Text>
            <Button title="Retry" variant="secondary" onPress={() => refetch()} />
          </View>
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
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '400',
    lineHeight: 34,
  },
});
