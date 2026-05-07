import React, { useState, useEffect } from 'react';
import {
  Modal, View, Text, TextInput, Pressable, StyleSheet, ScrollView
} from 'react-native';
import { Mision, Rango, Categoria } from '../types';
import { Colors, Spacing } from '../constants/colors';

const RANGOS: Rango[] = ['D', 'C', 'B', 'A', 'S'];
const CATEGORIAS: Categoria[] = ['Recolección', 'Exploración', 'Captura', 'Escolta', 'Caza'];

interface Props {
  visible: boolean;
  mision: Mision | null;
  onSave: (id: string, data: Partial<Pick<Mision, 'title' | 'categoria' | 'rango'>>) => void;
  onClose: () => void;
  isDark: boolean;
}

export function EditModal({ visible, mision, onSave, onClose, isDark }: Props) {
  const [title, setTitle] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('Recolección');
  const [rango, setRango] = useState<Rango>('D');

  useEffect(() => {
    if (mision) {
      setTitle(mision.title);
      setCategoria(mision.categoria);
      setRango(mision.rango);
    }
  }, [mision]);

  const handleSave = () => {
    if (title.trim().length < 3 || !mision) return;
    onSave(mision.id, { title: title.trim(), categoria, rango });
    onClose();
  };

  const bg = isDark ? Colors.zinc900 : Colors.parchment;
  const inputBg = isDark ? Colors.zinc800 : '#fff';
  const textColor = isDark ? Colors.stone200 : Colors.stone800;
  const borderColor = isDark ? Colors.stone700 : Colors.stone400;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.container, { backgroundColor: bg, borderColor: Colors.wood }]}>
          <Text style={styles.modalTitle}>✎ MODIFICAR ENCARGO</Text>

          <TextInput
            style={[styles.input, { backgroundColor: inputBg, borderColor, color: textColor }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Título de la misión..."
            placeholderTextColor={Colors.stone400}
            autoFocus
          />

          {/* Categoría */}
          <Text style={[styles.sectionLabel, { color: isDark ? Colors.stone400 : Colors.stone500 }]}>CATEGORÍA</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
            {CATEGORIAS.map(c => (
              <Pressable
                key={c}
                onPress={() => setCategoria(c)}
                style={[
                  styles.chip,
                  { borderColor: categoria === c ? Colors.gold : borderColor },
                  categoria === c && { backgroundColor: 'rgba(197,160,40,0.1)' },
                ]}
              >
                <Text style={[styles.chipText, { color: categoria === c ? Colors.gold : (isDark ? Colors.stone400 : Colors.stone500) }]}>
                  {c}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Rango */}
          <Text style={[styles.sectionLabel, { color: isDark ? Colors.stone400 : Colors.stone500 }]}>RANGO</Text>
          <View style={styles.rangoRow}>
            {RANGOS.map(r => {
              const rColor = Colors.rangoColors[r];
              const active = rango === r;
              return (
                <Pressable
                  key={r}
                  onPress={() => setRango(r)}
                  style={[
                    styles.rangoBtn,
                    { borderColor: active ? rColor : borderColor },
                    active && { backgroundColor: rColor + '22' },
                  ]}
                >
                  <Text style={[styles.rangoBtnText, { color: active ? rColor : (isDark ? Colors.stone400 : Colors.stone500) }]}>
                    {r}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Botones */}
          <View style={styles.buttons}>
            <Pressable
              onPress={handleSave}
              style={({ pressed }) => [styles.btnSave, pressed && { opacity: 0.8 }]}
            >
              <Text style={styles.btnSaveText}>✓ GUARDAR</Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.btnCancel,
                { borderColor, backgroundColor: inputBg },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={[styles.btnCancelText, { color: isDark ? Colors.stone400 : Colors.stone500 }]}>CANCELAR</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  container: {
    width: '100%',
    maxWidth: 440,
    borderWidth: 4,
    padding: Spacing.xl,
  },
  modalTitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: Colors.gold,
    marginBottom: Spacing.xl,
    letterSpacing: 1,
  },
  input: {
    padding: Spacing.md,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Lora_700Bold',
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderRadius: 2,
  },
  chipText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
  },
  rangoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.xl,
  },
  rangoBtn: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  rangoBtnText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    fontWeight: '700',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  btnSave: {
    flex: 1,
    backgroundColor: Colors.gold,
    padding: Spacing.md,
    alignItems: 'center',
  },
  btnSaveText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: '#fff',
  },
  btnCancel: {
    paddingHorizontal: Spacing.xl,
    padding: Spacing.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
  },
});