import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/ThemeContext';
import { useMisiones } from '../../src/hooks/useMisiones';
import { Colors, Spacing } from '../../src/constants/colors';

/**
 * CORRECCIÓN: Se elimina la imagen de via.placeholder.com (da 404 en muchos
 * entornos) y se reemplaza por un avatar SVG-style con View + Text.
 * También se añaden stats reales del hook para enriquecer la pantalla.
 */
export default function PerfilScreen() {
  const { isDark } = useTheme();
  const { stats } = useMisiones();
  const bg = isDark ? Colors.zinc950 : Colors.parchmentLight;
  const textColor = isDark ? Colors.stone200 : Colors.stone800;
  const cardBg = isDark ? Colors.zinc900 : Colors.parchment;

  const handleLogout = () => {
    Alert.alert(
      'CONFIRMACIÓN DE RETIRADA',
      '¿Estás seguro de que deseas abandonar el puesto de mando?',
      [
        { text: 'PERMANECER', style: 'cancel' },
        { text: 'RETIRARSE', style: 'destructive', onPress: () => console.log('Sesión cerrada') },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['top']}>
      <View style={styles.container}>
        {/* Avatar generado con View (no depende de URLs externas) */}
        <View style={[styles.avatarContainer, { borderColor: Colors.gold, backgroundColor: Colors.gold + '20' }]}>
          <Text style={styles.avatarEmoji}>⚔️</Text>
        </View>

        <Text style={[styles.name, { color: Colors.gold }]}>Aventurero</Text>
        <Text style={[styles.email, { color: isDark ? Colors.stone400 : Colors.stone500 }]}>
          osk@gremio.taskflow
        </Text>

        {/* Stats del gremio */}
        <View style={[styles.statsGrid, { backgroundColor: cardBg, borderColor: Colors.gold + '30' }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.gold }]}>{stats.total}</Text>
            <Text style={[styles.statLabel, { color: isDark ? Colors.stone500 : Colors.stone400 }]}>MISIONES</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: Colors.gold + '30' }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.green600 }]}>{stats.completadas}</Text>
            <Text style={[styles.statLabel, { color: isDark ? Colors.stone500 : Colors.stone400 }]}>LOGRADAS</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: Colors.gold + '30' }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.gold }]}>{stats.porcentaje}%</Text>
            <Text style={[styles.statLabel, { color: isDark ? Colors.stone500 : Colors.stone400 }]}>ÉXITO</Text>
          </View>
        </View>

        <View style={[styles.rankBox, { borderColor: Colors.gold + '40', backgroundColor: Colors.gold + '08' }]}>
          <Text style={[styles.rankLabel, { color: isDark ? Colors.stone400 : Colors.stone500 }]}>RANGO ACTUAL</Text>
          <Text style={[styles.rankValue, { color: Colors.gold }]}>★ VETERANO</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutBtn,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>CERRAR SESIÓN</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.xl,
    paddingTop: Spacing.xl,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  name: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  email: {
    fontFamily: 'Lora_400Regular',
    fontSize: 13,
    marginBottom: Spacing.xl,
  },
  statsGrid: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 2,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 16,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 6,
  },
  divider: {
    width: 1,
    height: 40,
  },
  rankBox: {
    width: '100%',
    padding: Spacing.lg,
    borderWidth: 1,
    borderRadius: 2,
    marginBottom: Spacing.xl,
    alignItems: 'center',
    gap: 8,
  },
  rankLabel: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
  },
  rankValue: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 11,
  },
  logoutBtn: {
    backgroundColor: Colors.red500,
    padding: Spacing.lg,
    width: '100%',
    alignItems: 'center',
    borderRadius: 2,
  },
  logoutText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: '#fff',
  },
});
