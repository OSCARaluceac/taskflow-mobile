import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useNotesStore } from '../src/store/notesStore';
import { Colors, Spacing } from '../src/constants/colors';
import { useTheme } from '../src/hooks/ThemeContext';

export default function NuevaListaScreen() {
  const { isDark } = useTheme();
  const { addChecklist } = useNotesStore();

  const [title, setTitle] = useState('');
  const [items, setItems] = useState<string[]>(['']);

  const bg = isDark ? Colors.zinc950 : Colors.parchmentLight;
  const cardBg = isDark ? Colors.zinc900 : '#fff';
  const textColor = isDark ? '#f5f5f0' : '#1a1a1a';
  const borderColor = Colors.gold + '40';

  const addItem = () => setItems(prev => [...prev, '']);
  const updateItem = (index: number, value: string) =>
    setItems(prev => prev.map((t, i) => (i === index ? value : t)));
  const removeItem = (index: number) =>
    setItems(prev => prev.filter((_, i) => i !== index));

  const handleCreate = async () => {
    if (title.trim().length < 3) {
      Alert.alert('TÍTULO DEMASIADO CORTO', 'El título necesita al menos 3 caracteres.');
      return;
    }
    const validItems = items.filter(t => t.trim().length > 0);
    try {
      await addChecklist(title.trim(), validItems);
      router.back();
    } catch {
      Alert.alert('ERROR', 'No se pudo crear la lista. Comprueba la conexión.');
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={[styles.back, { color: Colors.gold }]}>← VOLVER</Text>
        </Pressable>
        <Text style={[styles.headerTitle, { color: Colors.gold }]}>NUEVA LISTA</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Título */}
        <Text style={[styles.label, { color: Colors.stone500 }]}>TÍTULO</Text>
        <TextInput
          style={[styles.input, { backgroundColor: cardBg, color: textColor, borderColor }]}
          value={title}
          onChangeText={setTitle}
          placeholder="Nombre de la lista..."
          placeholderTextColor={Colors.stone600}
          maxLength={100}
        />

        {/* Items */}
        <Text style={[styles.label, { color: Colors.stone500 }]}>ELEMENTOS</Text>
        {items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <TextInput
              style={[styles.itemInput, { backgroundColor: cardBg, color: textColor, borderColor }]}
              value={item}
              onChangeText={v => updateItem(index, v)}
              placeholder={`Elemento ${index + 1}...`}
              placeholderTextColor={Colors.stone600}
            />
            {items.length > 1 && (
              <Pressable onPress={() => removeItem(index)} hitSlop={8}>
                <Text style={styles.removeBtn}>✕</Text>
              </Pressable>
            )}
          </View>
        ))}

        <Pressable onPress={addItem} style={[styles.addItemBtn, { borderColor }]}>
          <Text style={[styles.addItemText, { color: Colors.gold }]}>+ AÑADIR ELEMENTO</Text>
        </Pressable>

        {/* Crear */}
        <Pressable
          onPress={handleCreate}
          style={[styles.createBtn, { borderColor: Colors.gold }]}
        >
          <Text style={[styles.createText, { color: Colors.gold }]}>CREAR LISTA</Text>
        </Pressable>
      </ScrollView>
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
  },
  back: { fontFamily: 'PressStart2P_400Regular', fontSize: 7 },
  headerTitle: { fontFamily: 'PressStart2P_400Regular', fontSize: 10 },
  scroll: { padding: Spacing.lg, gap: Spacing.md },
  label: { fontFamily: 'PressStart2P_400Regular', fontSize: 7, marginBottom: 4 },
  input: {
    borderWidth: 1,
    padding: 12,
    fontFamily: 'Lora_400Regular',
    fontSize: 15,
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemInput: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    fontFamily: 'Lora_400Regular',
    fontSize: 14,
  },
  removeBtn: { color: '#ef4444', fontSize: 16, paddingHorizontal: 4 },
  addItemBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    padding: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  addItemText: { fontFamily: 'PressStart2P_400Regular', fontSize: 7 },
  createBtn: {
    borderWidth: 1,
    padding: 14,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  createText: { fontFamily: 'PressStart2P_400Regular', fontSize: 9 },
});
