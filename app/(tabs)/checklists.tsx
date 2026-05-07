import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/ThemeContext';
import { Colors, Spacing } from '../../src/constants/colors';

/**
 * CORRECCIÓN: El archivo estaba vacío (sin export default), lo que causa un
 * crash en Expo Router al intentar renderizar esta ruta.
 */
export default function ChecklistsScreen() {
  const { isDark } = useTheme();
  const bg = isDark ? Colors.zinc950 : Colors.parchmentLight;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top']}>
      <View style={styles.container}>
        <Text style={[styles.icon, { color: Colors.gold + '50' }]}>📋</Text>
        <Text style={[styles.title, { color: isDark ? Colors.stone500 : Colors.stone400 }]}>
          PRÓXIMAMENTE
        </Text>
        <Text style={[styles.sub, { color: isDark ? Colors.stone600 : Colors.stone300 }]}>
          Módulo de listas en desarrollo
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  icon: { fontSize: 48, marginBottom: Spacing.lg },
  title: { fontFamily: 'PressStart2P_400Regular', fontSize: 9, marginBottom: Spacing.sm },
  sub: { fontFamily: 'Lora_400Regular', fontSize: 14 },
});
