import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export type FilterType = 'all' | 'pending' | 'completed';

interface Props {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const FilterBar = ({ currentFilter, onFilterChange }: Props) => {
  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <View style={styles.container}>
      {filters.map((f) => {
        const isActive = currentFilter === f.value;
        return (
          <TouchableOpacity
            key={f.value}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onFilterChange(f.value)}
          >
            <Text style={[styles.text, isActive && styles.activeText]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeText: {
    color: '#6366F1',
    fontWeight: '600',
  },
});
