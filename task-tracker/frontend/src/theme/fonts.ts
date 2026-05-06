import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_600SemiBold_Italic,
  PlayfairDisplay_400Regular_Italic,
} from '@expo-google-fonts/playfair-display';

export function useAppFonts() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    PlayfairDisplay_600SemiBold_Italic,
    PlayfairDisplay_400Regular_Italic,
  });
  return fontsLoaded;
}
