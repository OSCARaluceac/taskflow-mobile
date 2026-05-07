import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown, FadeOutLeft } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Note } from '../../types';
import { Colors, Spacing } from '../../constants/colors';

// Definición estricta de la interfaz para satisfacer a TypeScript
interface NoteCardProps {
  note: Note;
  isDark: boolean;
}

export const NoteCard = ({ note, isDark }: NoteCardProps) => {
  return (
    <Animated.View 
      entering={FadeInDown.delay(100)} 
      exiting={FadeOutLeft}
    >
      <Pressable 
        onPress={() => router.push(`/notas/${note.id}`)}
        style={[styles.card, { backgroundColor: isDark ? Colors.zinc900 : '#fff' }]}
      >
        <Text style={[styles.title, { color: Colors.gold }]}>{note.title}</Text>
        <Text 
          numberOfLines={2} 
          style={[styles.content, { color: isDark ? Colors.stone400 : Colors.stone600 }]}
        >
          {note.content}
        </Text>
        <Text style={styles.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: { 
    padding: Spacing.md, 
    borderRadius: 2, 
    borderWidth: 1, 
    borderColor: Colors.gold + '30', 
    marginBottom: Spacing.sm 
  },
  title: { fontFamily: 'PressStart2P_400Regular', fontSize: 10, marginBottom: 8 },
  content: { fontFamily: 'Lora_400Regular', fontSize: 14, lineHeight: 20 },
  date: { fontSize: 9, marginTop: 10, opacity: 0.5, textAlign: 'right', color: Colors.gold }
});