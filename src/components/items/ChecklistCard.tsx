import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChecklistNote } from '../../types';
import { Colors, Spacing } from '../../constants/colors';

interface ChecklistCardProps {
  checklist: ChecklistNote;
  isDark: boolean;
  onToggleItem?: (checklistId: string, itemId: string, current: boolean) => void;
}

export const ChecklistCard = ({ checklist, isDark, onToggleItem }: ChecklistCardProps) => {
  const completed = checklist.items.filter(i => i.isCompleted).length;
  const total = checklist.items.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <Animated.View entering={FadeInDown.delay(100)}>
      <View style={[styles.card, { backgroundColor: isDark ? Colors.zinc900 : '#fff' }]}>
        <Text style={[styles.title, { color: Colors.gold }]}>{checklist.title}</Text>

        <View style={[styles.progressTrack, { backgroundColor: isDark ? Colors.stone700 : Colors.stone200 }]}>
          <View style={[
            styles.progressFill,
            { width: `${progress}%`, backgroundColor: progress === 100 ? Colors.green600 : Colors.gold },
          ]} />
        </View>

        <Text style={[styles.progressText, { color: isDark ? Colors.stone500 : Colors.stone400 }]}>
          {completed}/{total} TAREAS COMPLETADAS
        </Text>

        {checklist.items.map(item => (
          <Pressable
            key={item.id}
            style={styles.itemRow}
            onPress={() => onToggleItem?.(checklist.id, item.id, item.isCompleted)}
          >
            <Text style={[styles.check, { color: item.isCompleted ? Colors.green600 : Colors.stone600 }]}>
              {item.isCompleted ? '☑' : '☐'}
            </Text>
            <Text style={[
              styles.itemText,
              { color: isDark ? Colors.stone300 : Colors.stone700 },
              item.isCompleted && styles.done,
            ]}>
              {item.text}
            </Text>
          </Pressable>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: Colors.gold + '30',
    marginBottom: Spacing.sm,
    gap: 8,
  },
  title: { fontFamily: 'PressStart2P_400Regular', fontSize: 10 },
  progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  progressText: { fontFamily: 'PressStart2P_400Regular', fontSize: 6 },
  itemRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  check: { fontSize: 16 },
  itemText: { fontFamily: 'Lora_400Regular', fontSize: 14, flex: 1 },
  done: { textDecorationLine: 'line-through', opacity: 0.5 },
});
