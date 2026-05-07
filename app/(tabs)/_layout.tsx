import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/ThemeContext';
import { Colors } from '../../src/constants/colors';

/**
 * CORRECCIÓN: Se añade la pestaña 'checklists' al layout (antes faltaba,
 * Expo Router la detectaba igual y podía generar una tab sin header).
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
        paddingBottom: 30,
        paddingTop: 10,
      },
      tabBarActiveTintColor: Colors.gold,
      tabBarInactiveTintColor: isDark ? Colors.stone600 : Colors.stone400,
      tabBarLabelStyle: {
        fontFamily: 'PressStart2P_400Regular',
        fontSize: 6,
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tareas',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="estadisticas"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="checklists"
        options={{
          title: 'Listas',
          tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
