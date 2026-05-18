import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/ThemeContext';
import { useNotesStore } from '../../src/store/notesStore';
import { Colors, Spacing } from '../../src/constants/colors';

export default function DetalleNota() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
  const { notes, deleteNote } = useNotesStore();

  const nota = notes.find(n => n.id === id) ?? null;

  const bg = isDark ? Colors.zinc950 : Colors.parchmentLight;
  const textColor = isDark ? Colors.stone200 : Colors.stone800;
  const subtextColor = isDark ? Colors.stone500 : Colors.stone500;
  const cardBg = isDark ? Colors.zinc900 : '#fff';

  if (!nota) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <Text style={[styles.notFound, { color: Colors.stone400 }]}>NOTA NO ENCONTRADA</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>VOLVER</Text>
        </Pressable>
      </View>
    );
  }

  const confirmarEliminacion = () => {
    Alert.alert(
      'ELIMINAR NOTA',
      `¿Eliminar "${nota.title}"?`,
      [
        { text: 'CANCELAR', style: 'cancel' },
        {
          text: 'ELIMINAR',
          style: 'destructive',
          onPress: async () => {
            await deleteNote(nota.id, 'note');
            router.back();
          },
        },
      ]
    );
  };

  const fecha = new Date(nota.createdAt).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor: Colors.gold + '30' }]}>
          <Text style={[styles.tipo, { color: Colors.gold }]}>NOTA</Text>
          <Text style={[styles.titulo, { color: textColor }]}>{nota.title}</Text>
          <Text style={[styles.fecha, { color: subtextColor }]}>{fecha}</Text>
        </View>

        {nota.content ? (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: Colors.gold + '20' }]}>
            <Text style={[styles.label, { color: subtextColor }]}>CONTENIDO</Text>
            <Text style={[styles.contenido, { color: textColor }]}>{nota.content}</Text>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: cardBg, borderColor: Colors.gold + '10' }]}>
            <Text style={[styles.vacio, { color: subtextColor }]}>Sin contenido</Text>
          </View>
        )}

        <Pressable style={[styles.deleteBtn, { borderColor: Colors.red500 }]} onPress={confirmarEliminacion}>
          <Text style={[styles.deleteBtnText, { color: Colors.red500 }]}>ELIMINAR NOTA</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  card: { borderWidth: 1, borderRadius: 2, padding: Spacing.lg, gap: Spacing.sm },
  tipo: { fontFamily: 'PressStart2P_400Regular', fontSize: 7, letterSpacing: 1 },
  titulo: { fontFamily: 'Lora_700Bold', fontSize: 22, lineHeight: 30 },
  fecha: { fontFamily: 'Lora_400Regular', fontSize: 12 },
  label: { fontFamily: 'PressStart2P_400Regular', fontSize: 7, marginBottom: 4 },
  contenido: { fontFamily: 'Lora_400Regular', fontSize: 16, lineHeight: 26 },
  vacio: { fontFamily: 'Lora_400Regular', fontSize: 14, textAlign: 'center', padding: Spacing.md },
  deleteBtn: { borderWidth: 1, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.lg },
  deleteBtnText: { fontFamily: 'PressStart2P_400Regular', fontSize: 8 },
  notFound: { fontFamily: 'PressStart2P_400Regular', fontSize: 9, marginBottom: Spacing.xl, textAlign: 'center' },
  backBtn: { borderWidth: 1, borderColor: Colors.gold, paddingHorizontal: 16, paddingVertical: 10 },
  backBtnText: { fontFamily: 'PressStart2P_400Regular', fontSize: 8, color: Colors.gold },
});
