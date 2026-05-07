import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useNotesStore } from '../src/store/notesStore';
import { Colors, Spacing } from '../src/constants/colors';

export default function NuevaNotaScreen() {
  const [type, setType] = useState<'text' | 'checklist' | 'idea'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [items, setItems] = useState<string[]>(['']);
  const { addNote, addChecklist } = useNotesStore();

  const handleSave = async () => {
    if (title.length < 3) return;
    
    const id = Date.now().toString();
    const now = Date.now();

    if (type === 'text') {
      addNote({ id, title, content, type: 'text', createdAt: now, updatedAt: now });
    } else if (type === 'checklist') {
      const checklistItems = items.filter(i => i.trim()).map((t, i) => ({ id: `${id}-${i}`, text: t, isCompleted: false }));
      addChecklist({ id, title, items: checklistItems, type: 'checklist', createdAt: now, updatedAt: now });
    }

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: Colors.zinc950 }}>
      <ScrollView contentContainerStyle={{ padding: Spacing.xl }}>
        <Text style={styles.label}>TIPO</Text>
        <View style={styles.row}>
          {['text', 'checklist', 'idea'].map((t: any) => (
            <Pressable key={t} onPress={() => setType(t)} style={[styles.tab, type === t && { backgroundColor: Colors.gold }]}>
              <Text style={[styles.tabText, type === t && { color: '#000' }]}>{t.toUpperCase()}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>TÍTULO</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Mínimo 3 caracteres..." placeholderTextColor={Colors.stone600} />

        {type === 'text' && (
          <TextInput style={[styles.input, { height: 120 }]} value={content} onChangeText={setContent} multiline placeholder="Contenido..." placeholderTextColor={Colors.stone600} />
        )}

        {type === 'checklist' && (
          items.map((item, i) => (
            <TextInput key={i} style={styles.input} value={item} onChangeText={(t) => {
              const next = [...items]; next[i] = t; setItems(next);
            }} placeholder={`Tarea ${i + 1}`} placeholderTextColor={Colors.stone600} />
          ))
        )}

        <Pressable style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>REGISTRAR</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  label: { color: Colors.gold, fontFamily: 'PressStart2P_400Regular', fontSize: 8, marginBottom: 10, marginTop: 15 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  tab: { flex: 1, padding: 10, borderWidth: 1, borderColor: Colors.gold, alignItems: 'center' },
  tabText: { color: Colors.gold, fontSize: 7, fontFamily: 'PressStart2P_400Regular' },
  input: { borderWidth: 1, borderColor: Colors.stone700, color: '#fff', padding: 12, marginBottom: 10, fontFamily: 'Lora_400Regular' },
  saveBtn: { backgroundColor: Colors.gold, padding: 15, alignItems: 'center', marginTop: 20 },
  saveBtnText: { fontFamily: 'PressStart2P_400Regular', fontSize: 10 }
});