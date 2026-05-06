import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';

export const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<Record<string, object | undefined>>>();

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: async (data) => {
      await login(data.token, data.user);
    },
    onError: (error: Error) => {
      setErrorMsg(error.message || 'Signup failed');
    },
  });

  const handleSignup = () => {
    setErrorMsg('');
    if (!name || !email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email');
      return;
    }

    signupMutation.mutate({ name, email, password });
  };

  const isPending = signupMutation.isPending;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topSection}>
          <View style={styles.iconPlaceholder}>
            <Text style={styles.iconText}>T</Text>
          </View>
          <Text style={styles.title}>Join us.</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <GlassCard style={styles.formSection}>
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          
          <Input
            label="Name"
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!isPending}
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isPending}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            autoCorrect={false}
            editable={!isPending}
          />

          <Button 
            title={isPending ? 'Signing up...' : 'Sign Up'}
            onPress={handleSignup} 
            loading={isPending} 
            style={styles.submitBtn}
          />
          {isPending && (
            <Text style={styles.connectingText}>
              ☕ Server is waking up, this may take up to 30s on first use
            </Text>
          )}
        </GlassCard>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  topSection: {
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  iconPlaceholder: {
    width: 56,
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  iconText: {
    color: theme.colors.text.white,
    fontSize: theme.fontSize.xxl,
    fontFamily: theme.fonts.heading,
  },
  title: {
    fontSize: theme.fontSize.xxl,
    fontFamily: theme.fonts.heading,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: theme.fonts.body,
    color: theme.colors.text.muted,
  },
  formSection: {
    marginBottom: 24,
  },
  submitBtn: {
    marginTop: theme.spacing.xs,
  },
  errorText: {
    color: theme.colors.text.error,
    fontSize: 12,
    fontFamily: theme.fonts.body,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: theme.colors.text.secondary,
    fontSize: 13,
    fontFamily: theme.fonts.body,
  },
  link: {
    color: theme.colors.accent,
    fontSize: 13,
    fontFamily: theme.fonts.bodyMedium,
  },
  connectingText: {
    color: theme.colors.text.muted,
    fontSize: 11,
    fontFamily: theme.fonts.body,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    opacity: 0.8,
  },
});
