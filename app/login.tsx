import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { Colors, Spacing } from '../src/constants/colors';

export default function LoginScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, isLoading, error } = useAuthStore();

  const handleSubmit = async () => {
    if (username.trim().length < 3) {
      Alert.alert('ERROR', 'El usuario debe tener al menos 3 caracteres.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('ERROR', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    try {
      if (mode === 'login') {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), password);
      }
      router.replace('/(tabs)');
    } catch {
      // El error ya está en el store, se muestra abajo
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>⚔</Text>
          <Text style={styles.title}>TASKFLOW</Text>
          <Text style={styles.subtitle}>TABLÓN DE ENCARGOS</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          {/* Tabs */}
          <View style={styles.tabs}>
            <Pressable
              style={[styles.tab, mode === 'login' && styles.tabActive]}
              onPress={() => setMode('login')}
            >
              <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                ACCEDER
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, mode === 'register' && styles.tabActive]}
              onPress={() => setMode('register')}
            >
              <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>
                REGISTRARSE
              </Text>
            </Pressable>
          </View>

          {/* Fields */}
          <Text style={styles.label}>AVENTURERO</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Nombre de usuario"
            placeholderTextColor={Colors.stone600}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>CONTRASEÑA</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={Colors.stone600}
            secureTextEntry
          />

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          ) : null}

          {/* Submit */}
          <Pressable
            style={[styles.btn, isLoading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? <ActivityIndicator color="#000" />
              : <Text style={styles.btnText}>
                  {mode === 'login' ? '⚔ ENTRAR AL GREMIO' : '✦ UNIRSE AL GREMIO'}
                </Text>
            }
          </Pressable>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.zinc950 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  header: { alignItems: 'center', marginBottom: Spacing.xxxl ?? 40 },
  logo: { fontSize: 48, marginBottom: 12 },
  title: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    color: Colors.gold,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    color: Colors.stone500,
    letterSpacing: 2,
  },
  card: {
    borderWidth: 1,
    borderColor: Colors.gold + '40',
    padding: Spacing.xl,
  },
  tabs: { flexDirection: 'row', marginBottom: Spacing.xl ?? 20, gap: 8 },
  tab: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.stone700,
    padding: 10,
    alignItems: 'center',
  },
  tabActive: { borderColor: Colors.gold, backgroundColor: Colors.gold + '15' },
  tabText: { fontFamily: 'PressStart2P_400Regular', fontSize: 7, color: Colors.stone500 },
  tabTextActive: { color: Colors.gold },
  label: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 7,
    color: Colors.stone500,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.stone700,
    color: Colors.stone200,
    fontFamily: 'Lora_400Regular',
    fontSize: 15,
    padding: 12,
    marginBottom: 4,
  },
  errorBox: {
    borderWidth: 1,
    borderColor: Colors.red500,
    padding: 10,
    marginTop: 12,
  },
  errorText: {
    fontFamily: 'Lora_400Regular',
    fontSize: 13,
    color: Colors.red500,
  },
  btn: {
    backgroundColor: Colors.gold,
    padding: 16,
    alignItems: 'center',
    marginTop: Spacing.xl ?? 20,
  },
  btnText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 9,
    color: '#000',
  },
});
