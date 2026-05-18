import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/hooks/ThemeContext';
import { useFonts } from 'expo-font';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import {
  Lora_400Regular,
  Lora_700Bold,
  Lora_400Regular_Italic,
} from '@expo-google-fonts/lora';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../src/constants/colors';
import { useNotesStore } from '../src/store/notesStore';

SplashScreen.preventAutoHideAsync();

// Componente separado para cargar notas al arrancar.
// Se monta dentro de ThemeProvider para tener acceso al contexto.
function AppInit() {
  const fetchNotes = useNotesStore(s => s.fetchNotes);
  useEffect(() => {
    fetchNotes();
  }, []);
  return null;
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PressStart2P_400Regular,
    Lora_400Regular,
    Lora_700Bold,
    Lora_400Regular_Italic,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.zinc950, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.gold} />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AppInit />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        {/* Modales: se presentan desde abajo sobre el contenido actual */}
        <Stack.Screen
          name="nueva-mision"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="nueva-lista"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        {/* Pantallas de detalle con header */}
        <Stack.Screen
          name="tareas/[id]"
          options={{
            headerShown: true,
            headerTitle: 'DETALLE DE MISIÓN',
            headerTintColor: Colors.gold,
            headerStyle: { backgroundColor: Colors.zinc950 },
            headerTitleStyle: { fontFamily: 'PressStart2P_400Regular', fontSize: 8 },
          }}
        />
        <Stack.Screen
          name="notas/[id]"
          options={{
            headerShown: true,
            headerTitle: 'DETALLE DE NOTA',
            headerTintColor: Colors.gold,
            headerStyle: { backgroundColor: Colors.zinc950 },
            headerTitleStyle: { fontFamily: 'PressStart2P_400Regular', fontSize: 8 },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
