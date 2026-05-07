import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/ThemeContext';
import { useMisiones } from '../../src/hooks/useMisiones';
import { StatsPanel } from '../../src/components/StatsPanel';
import { Colors, Spacing } from '../../src/constants/colors';

export default function EstadisticasScreen() {
  const { isDark } = useTheme();
  const { stats } = useMisiones();

  const bg = isDark ? Colors.zinc950 : Colors.parchmentLight;
  const textColor = isDark ? Colors.stone200 : Colors.stone800;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: Colors.gold }]}>REPORTE TÁCTICO</Text>
        
        <View style={styles.content}>
          {/* Reutilizamos tu panel de estadísticas con datos reales */}
          <StatsPanel {...stats} isDark={isDark} />

          <View style={[styles.detailCard, { backgroundColor: isDark ? Colors.zinc900 : Colors.parchment, borderColor: Colors.gold + '40' }]}>
            <Text style={[styles.detailTitle, { color: Colors.gold }]}>ANÁLISIS DE RENDIMIENTO</Text>
            <Text style={[styles.detailText, { color: textColor }]}>
              Misiones Totales: {stats.total}
            </Text>
            <Text style={[styles.detailText, { color: textColor }]}>
              Tasa de Éxito: {stats.porcentaje}%
            </Text>
            <Text style={[styles.detailText, { color: textColor }]}>
              Pendientes: {stats.pendientes}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: Spacing.lg },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: Spacing.xl,
    letterSpacing: 2,
  },
  content: { gap: Spacing.xl },
  detailCard: {
    borderWidth: 2,
    padding: Spacing.xl,
    borderRadius: 2,
  },
  detailTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    marginBottom: Spacing.lg,
  },
  detailText: {
    fontFamily: 'Lora_400Regular',
    fontSize: 16,
    marginBottom: Spacing.sm,
  }
});