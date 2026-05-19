import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../constants/colors';
import { useTheme } from '../hooks/ThemeContext';
import { loginApi, registerApi, setToken } from '../lib/api';

export default function LoginScreen() {
  const { isDark } = useTheme();
  const bg = isDark ? Colors.zinc950 : Colors.parchment;
  const card = isDark ? Colors.zinc900 : Colors.stone100;
  const text = isDark ? Colors.parchment : Colors.zinc950;
  const sub = isDark ? Colors.stone400 : Colors.stone600;
  const border = isDark ? Colors.zinc800 : Colors.stone200;

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!username.trim() || !password.trim()) {
      setError('Completa todos los campos.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (mode === 'register') {
        await registerApi(username.trim(), password);
        // Tras registrarse, hacer login automático
        const { token } = await loginApi(username.trim(), password);
        setToken(token);
      } else {
        const { token } = await loginApi(username.trim(), password);
        setToken(token);
      }
      router.replace('/(tabs)');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors.gold }]}>TASKFLOW</Text>
          <Text style={[styles.subtitle, { color: sub }]}>
            {mode === 'login' ? 'Accede al tablón de misiones' : 'Crea tu cuenta de aventurero'}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
          <View style={[styles.toggle, { backgroundColor: isDark ? Colors.zinc800 : Colors.stone200 }]}>
            {(['login', 'register'] as const).map(m => (
              <Pressable
                key={m}
                style={[styles.toggleBtn, mode === m && { backgroundColor: Colors.gold }]}
                onPress={() => { setMode(m); setError(null); }}
              >
                <Text style={[styles.toggleText, { color: mode === m ? Colors.zinc950 : sub }]}>
                  {m === 'login' ? 'Entrar' : 'Registrarse'}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.fields}>
            <Text style={[styles.label, { color: sub }]}>USUARIO</Text>
            <TextInput
              style={[styles.input, { color: text, borderColor: border, backgroundColor: bg }]}
              value={username}
              onChangeText={setUsername}
              placeholder="tu_nombre_de_aventurero"
              placeholderTextColor={isDark ? Colors.stone600 : Colors.stone400}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={[styles.label, { color: sub }]}>CONTRASEÑA</Text>
            <TextInput
              style={[styles.input, { color: text, borderColor: border, backgroundColor: bg }]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={isDark ? Colors.stone600 : Colors.stone400}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={Colors.zinc950} />
              : <Text style={styles.btnText}>
                  {mode === 'login' ? 'ENTRAR AL GREMIO' : 'UNIRSE AL GREMIO'}
                </Text>
            }
          </Pressable>
        </View>

        <Text style={[styles.footer, { color: sub }]}>
          El tablón de misiones te espera, aventurero.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl, gap: Spacing.xl },
  header: { alignItems: 'center', gap: Spacing.sm },
  title: { fontFamily: 'PressStart2P_400Regular', fontSize: 22, letterSpacing: 4 },
  subtitle: { fontFamily: 'Lora_400Regular_Italic', fontSize: 14, textAlign: 'center' },
  card: { borderRadius: 12, borderWidth: 1, padding: Spacing.xl, gap: Spacing.lg },
  toggle: { flexDirection: 'row', borderRadius: 8, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: Spacing.sm, borderRadius: 6, alignItems: 'center' },
  toggleText: { fontFamily: 'PressStart2P_400Regular', fontSize: 8 },
  fields: { gap: Spacing.sm },
  label: { fontFamily: 'PressStart2P_400Regular', fontSize: 7, letterSpacing: 1 },
  input: { borderWidth: 1, borderRadius: 8, padding: Spacing.md, fontFamily: 'Lora_400Regular', fontSize: 15 },
  errorText: { color: Colors.red500, fontFamily: 'Lora_400Regular', fontSize: 13, textAlign: 'center' },
  btn: { backgroundColor: Colors.gold, borderRadius: 8, paddingVertical: Spacing.md, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: 'PressStart2P_400Regular', fontSize: 9, color: Colors.zinc950 },
  footer: { fontFamily: 'Lora_400Regular_Italic', fontSize: 12, textAlign: 'center' },
});
