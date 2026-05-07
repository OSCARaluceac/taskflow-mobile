import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/hooks/ThemeContext';

/**
 * ARCHIVO: app/_layout.tsx
 * DESCRIPCIÓN: Configuración global de navegación y proveedores de estado.
 */
export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        {/* El contenedor principal de pestañas */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />

        {/* Modal para la creación de misiones — Bonus: presentation modal */}
        <Stack.Screen 
          name="nueva-mision" 
          options={{ 
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerShown: false 
          }} 
        />

        {/* Pantalla de detalle para misiones específicas */}
        <Stack.Screen 
          name="tareas/[id]" 
          options={{ 
            headerShown: true,
            headerTitle: 'REGISTRO DE MISIÓN',
            headerTintColor: '#c5a028', // Colors.gold
            headerStyle: { backgroundColor: '#09090b' }, // Zinc 950 por defecto
            headerTitleStyle: { 
              fontFamily: 'PressStart2P_400Regular', 
              fontSize: 8 
            }
          }} 
        />
      </Stack>
    </ThemeProvider>
  );
}