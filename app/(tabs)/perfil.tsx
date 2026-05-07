import { View, Text, Image, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/ThemeContext';
import { Colors, Spacing } from '../../src/constants/colors';

export default function PerfilScreen() {
  const { isDark } = useTheme();
  const bg = isDark ? Colors.zinc950 : Colors.parchmentLight;
  const textColor = isDark ? Colors.stone200 : Colors.stone800;

  const handleLogout = () => {
    Alert.alert(
      "CONFIRMACIÓN DE RETIRADA",
      "¿Estás seguro de que deseas abandonar el puesto de mando?",
      [
        { text: "PERMANECER", style: "cancel" },
        { text: "RETIRARSE", style: "destructive", onPress: () => console.log('Sesión cerrada') }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['top']}>
      <View style={styles.container}>
        {/* Foto Placeholder - Requerimiento Paso 5 */}
        <View style={[styles.avatarContainer, { borderColor: Colors.gold }]}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }} 
            style={styles.avatarImage} 
          />
        </View>
        
        <Text style={[styles.name, { color: Colors.gold }]}>Osk</Text>
        <Text style={[styles.email, { color: isDark ? Colors.stone400 : Colors.stone500 }]}>
          osk@gremio.taskflow
        </Text>

        <View style={[styles.statsBox, { borderColor: Colors.gold + '30' }]}>
          <Text style={[styles.statText, { color: textColor }]}>RANGO: VETERANO</Text>
        </View>

        <Pressable 
          style={({ pressed }) => [
            styles.logoutBtn, 
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
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
    paddingTop: Spacing.xs // Elevación del módulo
  },
  avatarContainer: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    borderWidth: 2, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: Spacing.md,
    overflow: 'hidden'
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  name: { 
    fontFamily: 'PressStart2P_400Regular', 
    fontSize: 14, 
    marginBottom: Spacing.xs 
  },
  email: { 
    fontFamily: 'Lora_400Regular', 
    fontSize: 12, 
    marginBottom: Spacing.xl 
  },
  statsBox: { 
    width: '100%', 
    padding: Spacing.md, 
    borderWidth: 1, 
    marginBottom: Spacing.xl, 
    alignItems: 'center' 
  },
  statText: { 
    fontFamily: 'PressStart2P_400Regular', 
    fontSize: 8 
  },
  logoutBtn: { 
    backgroundColor: Colors.rangoColors.S, 
    padding: Spacing.md, 
    width: '100%', 
    alignItems: 'center',
    borderRadius: 2
  },
  logoutText: { 
    fontFamily: 'PressStart2P_400Regular', 
    fontSize: 9, 
    color: '#fff' 
  }
});