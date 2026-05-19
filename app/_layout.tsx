import { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { ThemeProvider } from '../src/hooks/ThemeContext';
import { useFonts } from 'expo-font';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { Lora_400Regular, Lora_700Bold, Lora_400Regular_Italic } from '@expo-google-fonts/lora';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../src/constants/colors';
import { useAuthStore } from '../src/store/authStore';
import { useNotesStore } from '../src/store/notesStore';
import { setApiToken } from '../src/lib/api';

SplashScreen.preventAutoHideAsync();

// Gestiona la sesión: si no hay token redirige al login,
// si hay token inyecta el token en api.ts y carga los datos.
function AuthGate() {
  const { token } = useAuthStore();
  const { fetchNotes } = useNotesStore();
  const segments = useSegments();

  useEffect(() => {
    // Inyectar token en todas las peticiones de api.ts
    setApiToken(token);

    const inAuthScreen = segments[0] === 'login';

    if (!token && !inAuthScreen) {
      router.replace('/login');
    } else if (token && inAuthScreen) {
      router.replace('/(tabs)');
    }
  }, [token, segments]);

  // Cargar datos cuando haya sesión activa
  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

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
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
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
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="nueva-mision" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="nueva-lista" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
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
