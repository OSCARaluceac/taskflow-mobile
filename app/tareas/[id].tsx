import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../src/hooks/ThemeContext';
import { Mision } from '../../src/types';
import { Colors, Spacing } from '../../src/constants/colors';

/**
 * CORRECCIÓN: El componente original llamaba a useMisiones() que crea su propia
 * instancia de estado con una lista vacía (useMisiones no es un store global).
 * La solución correcta es leer directamente de AsyncStorage con el id de la ruta.
 */
export default function DetalleMision() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isDark } = useTheme();
  const [mision, setMision] = useState<Mision | null>(null);
  const [loading, setLoading] = useState(true);

  const bg = isDark ? Colors.zinc950 : Colors.parchmentLight;
  const textColor = isDark ? Colors.stone200 : Colors.stone800;
  const rangoColor = mision ? Colors.rangoColors[mision.rango] : Colors.gold;

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem('taskflow_misiones');
        if (raw) {
          const list: Mision[] = JSON.parse(raw);
          setMision(list.find(m => m.id === id) ?? null);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <ActivityIndicator color={Colors.gold} />
      </View>
    );
  }

  if (!mision) {
    return (
      <View style={[styles.center, { backgroundColor: bg }]}>
        <Text style={[styles.notFound, { color: Colors.stone400 }]}>Misión no encontrada</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← VOLVER</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      <View style={[styles.container, { borderColor: rangoColor + '60' }]}>
        {/* Rango badge */}
        <View style={[styles.rangoBadge, { backgroundColor: rangoColor + '20', borderColor: rangoColor }]}>
          <Text style={[styles.rangoText, { color: rangoColor }]}>RANGO {mision.rango}</Text>
        </View>

        <Text style={[styles.categoria, { color: Colors.gold }]}>
          {mision.categoria.toUpperCase()}
        </Text>

        <Text style={[styles.title, { color: textColor }]}>{mision.title}</Text>

        <View style={[styles.statusBadge, {
          backgroundColor: mision.completed ? Colors.green600 + '20' : Colors.gold + '15',
          borderColor: mision.completed ? Colors.green600 : Colors.gold,
        }]}>
          <Text style={[styles.statusText, { color: mision.completed ? Colors.green600 : Colors.gold }]}>
            {mision.completed ? '✓ COMPLETADA' : '⏳ EN CURSO'}
          </Text>
        </View>

        <View style={[styles.metaBox, { borderColor: Colors.stone200, backgroundColor: isDark ? Colors.zinc900 : Colors.stone100 }]}>
          <Text style={[styles.metaLabel, { color: isDark ? Colors.stone500 : Colors.stone400 }]}>ID DEL ENCARGO</Text>
          <Text style={[styles.metaValue, { color: isDark ? Colors.stone300 : Colors.stone600 }]}>{mision.id}</Text>
        </View>

        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { borderColor: Colors.gold }, pressed && { opacity: 0.7 }]}
        >
          <Text style={styles.backBtnText}>← VOLVER AL TABLÓN</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, margin: Spacing.xl, borderWidth: 2, padding: Spacing.xl },
  rangoBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 2,
    marginBottom: Spacing.lg,
  },
  rangoText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
  },
  categoria: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    marginBottom: Spacing.sm,
    letterSpacing: 1,
  },
  title: {
    fontFamily: 'Lora_700Bold',
    fontSize: 24,
    lineHeight: 32,
    marginBottom: Spacing.xl,
  },
  statusBadge: {
    borderWidth: 1,
    padding: Spacing.md,
    borderRadius: 2,
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  statusText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
  },
  metaBox: {
    borderWidth: 1,
    padding: Spacing.md,
    borderRadius: 2,
    marginBottom: Spacing.xl,
  },
  metaLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
    marginBottom: 6,
  },
  metaValue: {
    fontFamily: 'Lora_400Regular',
    fontSize: 12,
  },
  notFound: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    marginBottom: Spacing.xl,
  },
  backBtn: {
    borderWidth: 1,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: 'auto',
  },
  backBtnText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    color: Colors.gold,
  },
});
