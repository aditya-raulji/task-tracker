import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../../theme';

interface GlassCardProps extends ViewProps {
  padding?: number;
}

export const GlassCard = ({ children, style, padding, ...props }: GlassCardProps) => {
  return (
    <View 
      style={[
        styles.card, 
        padding !== undefined && { padding },
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.bg.card,
    borderWidth: 1,
    borderColor: theme.colors.border.light,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.card,
  },
});
