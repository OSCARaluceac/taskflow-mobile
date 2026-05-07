import React, { useState, useMemo } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { useNotesStore } from "../../src/store/notesStore";
import { NoteCard } from "../../src/components/items/NoteCard";
import { Colors, Spacing } from "../../src/constants/colors";

const OptimizedList = FlashList as any;

export default function NotesScreen() {
  const notes = useNotesStore((state) => state.notes);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => 
    notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
  , [search, notes]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="LOCALIZAR NOTA..."
        placeholderTextColor={Colors.stone500}
        value={search}
        onChangeText={setSearch}
      />
      <OptimizedList
        data={filtered}
        renderItem={({ item }: any) => <NoteCard note={item} isDark={true} />}
        estimatedItemSize={100}
        contentContainerStyle={{ padding: Spacing.md }}
        ListEmptyComponent={<Text style={styles.empty}>SIN REGISTROS</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.zinc950 },
  searchBar: { margin: Spacing.md, padding: 12, borderWidth: 1, borderColor: Colors.gold, color: '#fff', fontFamily: 'Lora_400Regular' },
  empty: { color: Colors.stone500, textAlign: 'center', marginTop: 50, fontFamily: 'PressStart2P_400Regular', fontSize: 8 }
});