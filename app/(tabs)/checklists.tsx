import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  Pressable, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useTheme } from '../../src/hooks/ThemeContext';
import { useNotesStore } from '../../src/store/notesStore';
import { Colors, Spacing } from '../../src/constants/colors';
import { ChecklistNote } from '../../src/types';
import Animated, { FadeInDown } from 'react-native-reanimated';

function ChecklistRow({ checklist, isDark, onDelete, onToggle }: {
  checklist: ChecklistNote;
  isDark: boolean;
  onDelete: (id: string) => void;
  onToggle: (checklistId: string, itemId: string, current: boolean) => void;
}) {
  const done = checklist.items.filter(i => i.isCompleted).length;
  const total = checklist.items.length;
  const pct = total > 0 ? (done / total) * 100 : 0;

  const confirmDelete = () => {
    if (window.confirm(`¿Eliminar la lista "${checklist.title}"?`)) {
      onDelete(checklist.id);
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(100)}>
      <View style={[styles.card, { backgroundColor: isDark ? Colors.zinc900 : '#fff', borderColor: Colors.gold + '30' }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: Colors.gold }]} numberOfLines={1}>
            {checklist.title}
          </Text>
          <Pressable onPress={confirmDelete} hitSlop={12}>
            <Text style={styles.deleteIcon}>✕</Text>
          </Pressable>
        </View>

        {/* Barra de progreso */}
        <View style={[styles.progressTrack, { backgroundColor: isDark ? Colors.stone700 : Colors.stone200 }]}>
          <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: pct === 100 ? Colors.green600 : Colors.gold }]} />
        </View>

        <Text style={[styles.progressText, { color: isDark ? Colors.stone400 : Colors.stone600 }]}>
          {done}/{total} COMPLETADAS
        </Text>

        {/* Primeros 3 items como preview */}
        {checklist.items.slice(0, 3).map(item => (
          <Pressable key={item.id} style={styles.itemRow} onPress={() => onToggle(checklist.id, item.id, item.isCompleted)}>
            <Text style={[styles.itemCheck, { color: item.isCompleted ? Colors.green600 : Colors.stone600 }]}>
              {item.isCompleted ? '☑' : '☐'}
            </Text>
            <Text style={[
              styles.itemText,
              { color: isDark ? Colors.stone400 : Colors.stone700 },
              item.isCompleted && styles.itemDone,
            ]}>
              {item.text}
            </Text>
          </Pressable>
        ))}
        {checklist.items.length > 3 && (
          <Text style={[styles.moreText, { color: Colors.stone500 }]}>
            +{checklist.items.length - 3} más...
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

export default function ChecklistsScreen() {
  const { isDark } = useTheme();
  const { checklists, isLoading, error, fetchNotes, deleteNote, toggleChecklistItem } = useNotesStore();
  const bg = isDark ? Colors.zinc950 : Colors.parchmentLight;

  // Recarga al volver a la pantalla (por si se creó un checklist nuevo)
  useFocusEffect(useCallback(() => { fetchNotes(); }, []));

  const handleDelete = async (id: string) => {
    await deleteNote(id, 'checklist');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.gold }]}>LISTAS</Text>
        <Pressable
          style={styles.addBtn}
          onPress={() => router.push('/nueva-lista')}
        >
          <Text style={styles.addBtnText}>+ NUEVA</Text>
        </Pressable>
      </View>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.gold} />
          <Text style={[styles.loadingText, { color: Colors.stone500 }]}>CARGANDO...</Text>
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>⚠ {error}</Text>
          <Pressable onPress={fetchNotes} style={styles.retryBtn}>
            <Text style={styles.retryText}>REINTENTAR</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !error && (
        <FlatList
          data={checklists}
          keyExtractor={c => c.id}
          contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md }}
          renderItem={({ item }) => (
            <ChecklistRow checklist={item} isDark={isDark} onDelete={handleDelete} onToggle={toggleChecklistItem} />
          )}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={[styles.emptyIcon, { color: Colors.gold + '40' }]}>📋</Text>
              <Text style={[styles.emptyText, { color: Colors.stone500 }]}>SIN LISTAS</Text>
              <Text style={[styles.emptySub, { color: Colors.stone600 }]}>
                Crea tu primera lista pulsando + NUEVA
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gold + '20',
  },
  title: { fontFamily: 'PressStart2P_400Regular', fontSize: 12 },
  addBtn: {
    borderWidth: 1,
    borderColor: Colors.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addBtnText: { fontFamily: 'PressStart2P_400Regular', fontSize: 7, color: Colors.gold },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: 12 },
  loadingText: { fontFamily: 'PressStart2P_400Regular', fontSize: 7, marginTop: 8 },
  errorText: { fontFamily: 'Lora_400Regular', fontSize: 14, color: '#ef4444', textAlign: 'center' },
  retryBtn: { borderWidth: 1, borderColor: Colors.gold, paddingHorizontal: 16, paddingVertical: 8 },
  retryText: { fontFamily: 'PressStart2P_400Regular', fontSize: 7, color: Colors.gold },
  emptyIcon: { fontSize: 48 },
  emptyText: { fontFamily: 'PressStart2P_400Regular', fontSize: 9 },
  emptySub: { fontFamily: 'Lora_400Regular', fontSize: 13, textAlign: 'center' },
  card: {
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: 2,
    gap: 8,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontFamily: 'PressStart2P_400Regular', fontSize: 9, flex: 1, marginRight: 8 },
  deleteIcon: { color: '#ef4444', fontSize: 14 },
  progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  progressText: { fontFamily: 'PressStart2P_400Regular', fontSize: 6 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemCheck: { fontSize: 16 },
  itemText: { fontFamily: 'Lora_400Regular', fontSize: 13, flex: 1 },
  itemDone: { opacity: 0.4, textDecorationLine: 'line-through' },
  moreText: { fontFamily: 'Lora_400Regular', fontSize: 12, fontStyle: 'italic' },
});
