import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useNotesStore } from '../../src/store/notesStore';
import { Colors, Spacing } from '../../src/constants/colors';

export default function DetalleNota() {
  const { id } = useLocalSearchParams();
  const { notes, deleteNote } = useNotesStore();
  const nota = notes.find(n => n.id === id);

  if (!nota) return null;

  const confirmarEliminacion = () => {
    Alert.alert(
      "ELIMINAR REGISTRO",
      "¿Confirmas la purga de esta información, Niko?",
      [
        { text: "CANCELAR", style: "cancel" },
        { 
          text: "ELIMINAR", 
          style: "destructive", 
          onPress: async () => {
            deleteNote(nota.id, 'text');
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            router.back();
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{nota.title}</Text>
      <Text style={styles.content}>{nota.content}</Text>
      
      <Pressable style={styles.deleteBtn} onPress={confirmarEliminacion}>
        <Text style={styles.deleteText}>ELIMINAR DE MEMORIA</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#09090b', padding: Spacing.xl },
  title: { color: Colors.gold, fontFamily: 'PressStart2P_400Regular', fontSize: 16, marginBottom: 20 },
  content: { color: '#ccc', fontFamily: 'Lora_400Regular', fontSize: 16, lineHeight: 24 },
  deleteBtn: { 
    marginTop: 'auto', 
    borderWidth: 1, // ⬅️ Corregido de borderWeight a borderWidth
    borderColor: '#ff4444', 
    padding: 15, 
    alignItems: 'center' 
  }, deleteText: { color: '#ff4444', fontFamily: 'PressStart2P_400Regular', fontSize: 8 }
});