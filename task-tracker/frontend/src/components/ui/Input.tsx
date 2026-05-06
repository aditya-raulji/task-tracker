import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { theme } from '../../theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  editable?: boolean;
  autoCorrect?: boolean;
}

export const Input = ({ label, error, style, ...props }: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={theme.colors.text.muted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontFamily: theme.fonts.bodyMedium,
    color: theme.colors.text.secondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: theme.colors.bg.input,
    borderWidth: 1.5,
    borderColor: theme.colors.border.default,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    fontSize: theme.fontSize.base,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.primary,
  },
  inputFocused: {
    borderColor: theme.colors.border.focus,
  },
  inputError: {
    borderColor: theme.colors.border.error,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.text.error,
    marginTop: 4,
    fontFamily: theme.fonts.body,
  },
});
