import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/hooks/ThemeContext';
import { useFonts } from 'expo-font';
import {
  PressStart2P_400Regular,
} from '@expo-google-fonts/press-start-2p';
import {
  Lora_400Regular,
  Lora_700Bold,
  Lora_400Regular_Italic,
} from '@expo-google-fonts/lora';
import * as SplashScreen from 'expo-splash-screen';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../src/constants/colors';

SplashScreen.preventAutoHideAsync();

/**
 * CORRECCIONES:
 * 1. useFonts carga PressStart2P y Lora — sin esto pantalla en blanco en iOS.
 * 2. SplashScreen se oculta una vez las fuentes están listas.
 * 3. Se registran todas las rutas (nueva-nota, notas/[id]) para que el Stack
 *    las reconozca y no genere headers por defecto incorrectos.
 */
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
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Modal para crear misión */}
        <Stack.Screen
          name="nueva-mision"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        />

        {/* Modal para crear nota */}
        <Stack.Screen
          name="nueva-nota"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: false,
          }}
        />

        {/* Detalle de misión */}
        <Stack.Screen
          name="tareas/[id]"
          options={{
            headerShown: true,
            headerTitle: 'REGISTRO DE MISIÓN',
            headerTintColor: Colors.gold,
            headerStyle: { backgroundColor: Colors.zinc950 },
            headerTitleStyle: {
              fontFamily: 'PressStart2P_400Regular',
              fontSize: 8,
            },
          }}
        />

        {/* Detalle de nota */}
        <Stack.Screen
          name="notas/[id]"
          options={{
            headerShown: true,
            headerTitle: 'DETALLE DE NOTA',
            headerTintColor: Colors.gold,
            headerStyle: { backgroundColor: Colors.zinc950 },
            headerTitleStyle: {
              fontFamily: 'PressStart2P_400Regular',
              fontSize: 8,
            },
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
