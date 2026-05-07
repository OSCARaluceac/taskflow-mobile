import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  ScrollView, useColorScheme, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useMisiones } from '../hooks/useMisiones';
import { Rango, Categoria } from '../types';
import { Colors, Spacing } from '../constants/colors';
import { useTheme } from '../hooks/ThemeContext';

const RANGOS: Rango[] = ['D', 'C', 'B', 'A', 'S'];
const CATEGORIAS: Categoria[] = ['Recolección', 'Exploración', 'Captura', 'Escolta', 'Caza'];

const CATEGORIA_ICONS: Record<Categoria, string> = {
  Recolección: '🌿',
  Exploración: '🗺',
  Captura: '🔒',
  Escolta: '🛡',
  Caza: '⚔️',
};

export default function AddTaskScreen() {
    const { agregar } = useMisiones(); // ➔ Esta es la línea vital que te faltaba
    const { isDark } = useTheme();
  
    const [title, setTitle] = useState('');
    const [categoria, setCategoria] = useState<Categoria>('Recolección');
    const [rango, setRango] = useState<Rango>('D');
    const [saving, setSaving] = useState(false);

  const bg = isDark ? Colors.zinc950 : Colors.parchmentLight;
  const cardBg = isDark ? Colors.zinc900 : Colors.parchment;
  const inputBg = isDark ? Colors.zinc800 : '#fff';
  const textColor = isDark ? Colors.stone200 : Colors.stone800;
  const borderColor = isDark ? Colors.stone700 : Colors.stone400;
  const labelColor = isDark ? Colors.stone400 : Colors.stone500;

  const handleSubmit = async () => {
    if (title.trim().length < 3) {
      Alert.alert('Título inválido', 'El título debe tener al menos 3 caracteres.');
      return;
    }
    setSaving(true);
    try {
      await agregar(title.trim(), categoria, rango);
      router.back();
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={[styles.content, { backgroundColor: bg }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Form card */}
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: Colors.wood + '40' }]}>

          {/* Title input */}
          <Text style={[styles.label, { color: labelColor }]}>TÍTULO DE LA MISIÓN</Text>
          <TextInput
            style={[styles.titleInput, { backgroundColor: inputBg, borderColor, color: textColor }]}
            placeholder="Describe el encargo..."
            placeholderTextColor={Colors.stone400}
            value={title}
            onChangeText={setTitle}
            autoFocus
            multiline
            maxLength={120}
          />
          <Text style={[styles.charCount, { color: labelColor }]}>{title.length}/120</Text>

          {/* Categoria */}
          <Text style={[styles.label, { color: labelColor }]}>CATEGORÍA</Text>
          <View style={styles.categoriaGrid}>
            {CATEGORIAS.map(c => {
              const active = categoria === c;
              return (
                <Pressable
                  key={c}
                  onPress={() => setCategoria(c)}
                  style={({ pressed }) => [
                    styles.categoriaBtn,
                    { borderColor: active ? Colors.gold : borderColor, backgroundColor: inputBg },
                    active && { backgroundColor: 'rgba(197,160,40,0.1)', borderColor: Colors.gold },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={styles.categoriaIcon}>{CATEGORIA_ICONS[c]}</Text>
                  <Text style={[styles.categoriaText, { color: active ? Colors.gold : labelColor }]}>
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Rango */}
          <Text style={[styles.label, { color: labelColor }]}>RANGO DE DIFICULTAD</Text>
          <View style={styles.rangoRow}>
            {RANGOS.map(r => {
              const rColor = Colors.rangoColors[r];
              const active = rango === r;
              return (
                <Pressable
                  key={r}
                  onPress={() => setRango(r)}
                  style={({ pressed }) => [
                    styles.rangoBtn,
                    { borderColor: active ? rColor : borderColor, backgroundColor: inputBg },
                    active && { backgroundColor: rColor + '22' },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={[styles.rangoBtnText, { color: active ? rColor : labelColor }]}>
                    {r}
                  </Text>
                  {active && (
                    <View style={[styles.rangoActive, { backgroundColor: rColor }]} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Info rango */}
          <View style={[styles.rangoInfo, { backgroundColor: Colors.rangoColors[rango] + '10', borderColor: Colors.rangoColors[rango] + '40' }]}>
            <Text style={[styles.rangoInfoText, { color: Colors.rangoColors[rango] }]}>
              {rango === 'S' && '★ RANGO S — Solo para los más veteranos del Gremio'}
              {rango === 'A' && '⬆ RANGO A — Peligrosidad elevada. Experiencia requerida.'}
              {rango === 'B' && '◆ RANGO B — Dificultad moderada-alta. Preparación necesaria.'}
              {rango === 'C' && '◇ RANGO C — Para aventureros en formación.'}
              {rango === 'D' && '○ RANGO D — Misiones de iniciación. Riesgo bajo.'}
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <Pressable
          onPress={handleSubmit}
          disabled={saving}
          style={({ pressed }) => [
            styles.publishBtn,
            pressed && { opacity: 0.85 },
            saving && { opacity: 0.6 },
          ]}
        >
          <Text style={styles.publishBtnText}>
            {saving ? '⏳ PUBLICANDO...' : '⚔ PUBLICAR ENCARGO'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.cancelBtn, { borderColor }, pressed && { opacity: 0.7 }]}
        >
          <Text style={[styles.cancelBtnText, { color: labelColor }]}>CANCELAR</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  card: {
    borderWidth: 2,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  label: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    marginBottom: Spacing.sm,
    letterSpacing: 1,
  },
  titleInput: {
    padding: Spacing.md,
    borderWidth: 1,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Lora_700Bold',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 4,
  },
  charCount: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    textAlign: 'right',
    marginBottom: Spacing.xl,
  },
  categoriaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.xl,
  },
  categoriaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 2,
  },
  categoriaIcon: {
    fontSize: 14,
  },
  categoriaText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
  },
  rangoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  rangoBtn: {
    flex: 1,
    height: 52,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  rangoBtnText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    fontWeight: '700',
  },
  rangoActive: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  rangoInfo: {
    borderWidth: 1,
    padding: Spacing.md,
    borderRadius: 2,
    marginBottom: Spacing.lg,
  },
  rangoInfoText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    lineHeight: 14,
  },
  publishBtn: {
    backgroundColor: Colors.gold,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  publishBtnText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
    color: '#fff',
    letterSpacing: 1,
  },
  cancelBtn: {
    borderWidth: 2,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
  },
});