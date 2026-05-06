import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useAppFonts } from './src/theme/fonts';
import { LinearGradient } from 'expo-linear-gradient';

const queryClient = new QueryClient();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

export default function App() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) return null;

  return (
    <LinearGradient
      colors={['#E8EAF6', '#F3F4F6', '#E0E7FF']}
      locations={[0, 0.5, 1]}
      style={{ flex: 1 }}
    >
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <AuthProvider>
            <NavigationContainer theme={navTheme}>
              <RootNavigator />
            </NavigationContainer>
          </AuthProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </LinearGradient>
  );
}
