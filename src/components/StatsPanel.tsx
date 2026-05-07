import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../constants/colors';

/**
 * CORRECCIÓN: La interfaz original solo tenía { total, pendientes, porcentaje }.
 * HomeScreen y EstadisticasScreen pasan también 'completadas' con {...stats},
 * lo que causaba un error de tipos en TypeScript.
 */
interface StatsProps {
  total: number;
  completadas: number;
  pendientes: number;
  porcentaje: number;
  isDark: boolean;
}

export function StatsPanel({ total, completadas, pendientes, porcentaje, isDark }: StatsProps) {
  const cardBg = isDark ? Colors.zinc900 : Colors.parchment;
  const textColor = isDark ? Colors.stone200 : Colors.stone800;
  const subColor = isDark ? Colors.stone500 : Colors.stone400;

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor: Colors.gold + '40' }]}>
      <Text style={[styles.header, { color: Colors.gold }]}>ESTADO DEL GREMIO</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: subColor }]}>TOTAL</Text>
          <Text style={[styles.statValue, { color: textColor }]}>{total}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: subColor }]}>PENDIENTES</Text>
          <Text style={[styles.statValue, { color: Colors.blue600 }]}>{pendientes}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: subColor }]}>LOGRADAS</Text>
          <Text style={[styles.statValue, { color: Colors.green600 }]}>{completadas}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: subColor }]}>ÉXITO</Text>
          <Text style={[styles.statValue, { color: Colors.gold }]}>{porcentaje}%</Text>
        </View>
      </View>

      {/* Barra de progreso */}
      <View style={styles.progressSection}>
        <View style={[styles.progressTrack, { backgroundColor: isDark ? Colors.zinc800 : Colors.stone200 }]}>
          <View style={[styles.progressFill, { width: `${porcentaje}%` as any }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderWidth: 2,
    borderRadius: 2,
    marginBottom: Spacing.md,
  },
  header: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
  },
  progressSection: {
    marginTop: 4,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.gold,
    borderRadius: 2,
  },
});
