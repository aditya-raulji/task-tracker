import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = ({ 
  title, 
  loading = false, 
  variant = 'primary', 
  style, 
  disabled,
  ...props 
}: ButtonProps) => {
  
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary': return styles.secondary;
      case 'danger': return styles.danger;
      default: return styles.primary;
    }
  };

  const getVariantTextStyle = () => {
    switch (variant) {
      case 'secondary': return styles.textSecondary;
      case 'danger': return styles.textDanger;
      default: return styles.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        disabled || loading ? styles.disabled : null,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#6366F1' : '#FFFFFF'} />
      ) : (
        <Text style={[styles.text, getVariantTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: '#6366F1',
  },
  secondary: {
    backgroundColor: '#EEF2FF',
  },
  danger: {
    backgroundColor: '#EF4444',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: '#6366F1',
  },
  textDanger: {
    color: '#FFFFFF',
  },
});
