import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../constants/colors';

interface StatsProps {
  total: number;
  pendientes: number;
  porcentaje: number; // El porcentaje que vamos a integrar
  isDark: boolean;
}

export function StatsPanel({ total, pendientes, porcentaje, isDark }: StatsProps) {
  const cardBg = isDark ? Colors.zinc900 : Colors.parchment;
  const textColor = isDark ? Colors.stone200 : Colors.stone800;

  return (
    <View style={[styles.container, { backgroundColor: cardBg, borderColor: Colors.gold + '40' }]}>
      <Text style={[styles.header, { color: Colors.gold }]}>ESTADO DEL GREMIO</Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: isDark ? Colors.stone500 : Colors.stone400 }]}>TOTAL</Text>
          <Text style={[styles.statValue, { color: textColor }]}>{total}</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: isDark ? Colors.stone500 : Colors.stone400 }]}>PENDIENTES</Text>
          <Text style={[styles.statValue, { color: Colors.rangoColors.S }]}>{pendientes}</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: isDark ? Colors.stone500 : Colors.stone400 }]}>ÉXITO</Text>
          <Text style={[styles.statValue, { color: Colors.gold }]}>{porcentaje}%</Text>
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
});