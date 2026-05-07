import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/ThemeContext';
import { useMisiones } from '../../src/hooks/useMisiones';
import { Colors } from '../../src/constants/colors';

/**
 * ARCHIVO: app/(tabs)/_layout.tsx
 * REVISIÓN: Eliminación de indicadores numéricos (Badges) por petición de Niko.
 */
export default function TabsLayout() {
  const { isDark } = useTheme();
  
  const bg = isDark ? Colors.zinc950 : Colors.parchmentLight;

  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: { 
        backgroundColor: bg, 
        borderTopColor: Colors.gold + '40',
        height: 90, 
        paddingBottom: 35, // Elevación para evitar conflictos con el sistema
        paddingTop: 10,
      },
      tabBarActiveTintColor: Colors.gold,
      tabBarInactiveTintColor: isDark ? Colors.stone600 : Colors.stone400,
      tabBarLabelStyle: { 
        fontFamily: 'PressStart2P_400Regular', 
        fontSize: 7 
      },
    }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Tareas',
          tabBarIcon: ({ color }) => <Ionicons name="list" size={20} color={color} />,
          // Se ha eliminado el sistema de badges para limpiar la visión de Niko.
        }} 
      />

      <Tabs.Screen 
        name="estadisticas" 
        options={{ 
          title: 'Stats',
          tabBarIcon: ({ color }) => <Ionicons name="stats-chart" size={20} color={color} /> 
        }} 
      />

      <Tabs.Screen 
        name="perfil" 
        options={{ 
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={20} color={color} /> 
        }} 
      />
    </Tabs>
  );
}