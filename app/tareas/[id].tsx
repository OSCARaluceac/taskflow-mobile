import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/ThemeContext';
import { useMisiones } from '../../src/hooks/useMisiones';
import { Colors, Spacing } from '../../src/constants/colors';

export default function DetalleMision() {
  const { id } = useLocalSearchParams();
  const { isDark } = useTheme();
  const { misiones } = useMisiones();
  
  const mision = misiones.find(m => m.id === id);
  const bg = isDark ? Colors.zinc950 : Colors.parchmentLight;
  const textColor = isDark ? Colors.stone200 : Colors.stone800;

  if (!mision) return null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <View style={[styles.container, { borderColor: Colors.gold }]}>
        <Text style={styles.header}>DETALLES DEL ENCARGO</Text>
        
        <View style={styles.infoBox}>
          <Text style={[styles.label, { color: Colors.gold }]}>TÍTULO:</Text>
          <Text style={[styles.title, { color: textColor }]}>{mision.title}</Text>
          
          <Text style={[styles.label, { color: Colors.gold, marginTop: 20 }]}>ESTADO:</Text>
          <Text style={[styles.status, { color: mision.completed ? '#4ade80' : Colors.rangoColors.S }]}>
            {mision.completed ? '✓ COMPLETADA' : '⏳ EN CURSO'}
          </Text>
        </View>

        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>VOLVER AL TABLÓN</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, margin: Spacing.xl, borderWidth: 2, padding: Spacing.xl },
  header: { fontFamily: 'PressStart2P_400Regular', fontSize: 10, color: Colors.gold, textAlign: 'center', marginBottom: 30 },
  infoBox: { flex: 1 },
  label: { fontFamily: 'PressStart2P_400Regular', fontSize: 7, marginBottom: 8 },
  title: { fontFamily: 'Lora_700Bold', fontSize: 22 },
  status: { fontFamily: 'PressStart2P_400Regular', fontSize: 9, marginTop: 5 },
  backBtn: { borderWidth: 1, borderColor: Colors.gold, padding: Spacing.md, alignItems: 'center' },
  backBtnText: { fontFamily: 'PressStart2P_400Regular', fontSize: 8, color: Colors.gold }
});