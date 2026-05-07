import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Mision } from '../types';
import { Colors, Spacing } from '../constants/colors';

interface Props {
  mision: Mision;
  onToggle: (id: string) => void;
  onEdit: (mision: Mision) => void;
  onDelete: (id: string) => void;
  isDark: boolean;
}

export function TaskCard({ mision, onToggle, onEdit, onDelete, isDark }: Props) {
  const rangoColor = Colors.rangoColors[mision.rango] || Colors.stone500;
  const completed = mision.completed;

  return (
    <View style={[
      styles.card,
      { backgroundColor: isDark ? Colors.zinc800 : '#fff' },
      completed && { opacity: 0.6, backgroundColor: isDark ? Colors.zinc850 : Colors.stone100 },
    ]}>
      {/* Indicador de rango lateral */}
      <View style={[styles.rangoBar, { backgroundColor: rangoColor }]} />

      <View style={styles.content}>
        {/* Header: categoria | rango */}
        <View style={styles.metaRow}>
          <Text style={[styles.metaText, { color: Colors.gold }]}>
            {mision.categoria.toUpperCase()} | RANGO {mision.rango}
          </Text>
          <View style={[styles.rangoBadge, { borderColor: rangoColor }]}>
            <Text style={[styles.rangoBadgeText, { color: rangoColor }]}>{mision.rango}</Text>
          </View>
        </View>

        {/* Título */}
        <Text
          style={[
            styles.title,
            { color: isDark ? Colors.stone100 : Colors.stone800 },
            completed && styles.titleCompleted,
          ]}
          numberOfLines={2}
        >
          {mision.title}
        </Text>
      </View>

      {/* Acciones */}
      <View style={styles.actions}>
        <Pressable
          onPress={() => onToggle(mision.id)}
          style={({ pressed }) => [styles.btn, styles.btnGold, pressed && { opacity: 0.7 }]}
          accessibilityLabel={completed ? 'Deshacer' : 'Completar'}
        >
          <Text style={styles.btnGoldText}>{completed ? '↩' : '✓'}</Text>
        </Pressable>

        <Pressable
          onPress={() => onEdit(mision)}
          style={({ pressed }) => [
            styles.btn,
            { borderColor: isDark ? Colors.stone600 : Colors.stone400 },
            pressed && { opacity: 0.7 },
          ]}
          accessibilityLabel="Editar"
        >
          <Text style={[styles.btnText, { color: isDark ? Colors.stone400 : Colors.stone500 }]}>✎</Text>
        </Pressable>

        <Pressable
          onPress={() => onDelete(mision.id)}
          style={({ pressed }) => [styles.btn, styles.btnRed, pressed && { opacity: 0.7 }]}
          accessibilityLabel="Eliminar"
        >
          <Text style={styles.btnRedText}>✕</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.stone200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  rangoBar: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    paddingRight: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 7,
    fontFamily: 'PressStart2P_400Regular',
    letterSpacing: 0.5,
  },
  rangoBadge: {
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  rangoBadgeText: {
    fontSize: 7,
    fontFamily: 'PressStart2P_400Regular',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Lora_700Bold',
    lineHeight: 20,
    marginTop: 2,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    textDecorationColor: Colors.gold,
  },
  actions: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 4,
    padding: Spacing.sm,
  },
  btn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.stone400,
  },
  btnText: {
    fontSize: 12,
  },
  btnGold: {
    borderColor: Colors.gold,
  },
  btnGoldText: {
    color: Colors.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  btnRed: {
    borderColor: Colors.red500,
    backgroundColor: 'rgba(239,68,68,0.08)',
  },
  btnRedText: {
    color: Colors.red500,
    fontSize: 12,
    fontWeight: '700',
  },
});