import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { theme } from '../../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = ({ 
  title, 
  loading = false, 
  variant = 'primary', 
  fullWidth = true,
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

  const getSpinnerColor = () => {
    if (variant === 'secondary') return theme.colors.primary;
    return theme.colors.text.white;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        getVariantStyle(),
        disabled || loading ? styles.disabled : null,
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getSpinnerColor()} />
      ) : (
        <Text style={[styles.text, getVariantTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  danger: {
    backgroundColor: theme.colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: theme.fontSize.base,
    fontFamily: theme.fonts.bodyMedium,
  },
  textPrimary: {
    color: theme.colors.text.white,
  },
  textSecondary: {
    color: theme.colors.primary,
  },
  textDanger: {
    color: theme.colors.text.white,
  },
});
