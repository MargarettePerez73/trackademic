import React, { useState } from 'react';
import {
  Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView,
  ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { login as apiLogin } from '../api/auth';
import { AlertModal } from '../components/AlertModal';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { Colors } from '../constants/Colors';
import { useAlert } from '../hooks/useAlert';
import type { AuthUser } from '../hooks/useAuth';

interface Props {
  onLogin: (user: AuthUser) => void;
  onGoRegister: () => void;
}

export default function LoginScreen({ onLogin, onGoRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const { alert, showAlert, hideAlert, loading, showLoading, hideLoading } = useAlert();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('error', 'Missing Fields', 'Please enter your email/username and password.');
      return;
    }
    showLoading('Signing you in…');
    try {
      const res = await apiLogin({ email: email.trim(), password });
      hideLoading();
      showAlert('success', 'Login Successful', `Welcome back, ${res.user.full_name || res.user.name}!`);
      setTimeout(() => { hideAlert(); onLogin(res.user); }, 1400);
    } catch (err: any) {
      hideLoading();
      showAlert('error', 'Login Failed', err.response?.data?.error ?? err.message ?? 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LoadingOverlay visible={loading.show} message={loading.message} />
      <AlertModal alert={alert} onClose={hideAlert} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Banner */}
          <View style={styles.banner}>
             <Image
               source={require('../trackademic-new-logo.png')}
               style={styles.logoImg}
               resizeMode="contain"
             />
            <Text style={styles.appName}>Trackademic</Text>
            <Text style={styles.appTagline}>Academic Progress Tracker</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BatStateU Student Portal</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.card}>
            <Text style={styles.formTitle}>Sign In</Text>
            <Text style={styles.formSub}>Enter your credentials to continue</Text>

            <Text style={styles.label}>Email or Username</Text>
            <TextInput value={email} onChangeText={setEmail}
              placeholder="Enter email or username" placeholderTextColor="#b0bec5"
              style={styles.input} autoCapitalize="none" keyboardType="email-address" />

            <Text style={styles.label}>Password</Text>
            <View style={styles.pwRow}>
              <TextInput value={password} onChangeText={setPassword}
                placeholder="Enter password" placeholderTextColor="#b0bec5"
                secureTextEntry={!showPw} style={[styles.input, { flex: 1 }]} />
              <Pressable onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                <Text style={styles.eyeIcon}>{showPw ? '🙈' : '👁'}</Text>
              </Pressable>
            </View>

            <Pressable style={styles.loginBtn} onPress={handleLogin}>
              <Text style={styles.loginBtnText}>Sign In</Text>
            </Pressable>

            {/* Demo hint */}
            <View style={styles.demo}>
              <Text style={styles.demoTitle}>Demo Credentials</Text>
              <Text style={styles.demoText}>Email: 23-72068@g.batstate-u.edu.ph</Text>
              <Text style={styles.demoText}>Password: password123</Text>
            </View>

            <Pressable onPress={onGoRegister}>
              <Text style={styles.regLink}>No account? <Text style={styles.regLinkAccent}>Register here</Text></Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: Colors.sidebar },
  scroll:    { flexGrow: 1 },
  banner:    { backgroundColor: Colors.sidebar, alignItems: 'center', paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24 },
  logoImg:   { width: 64, height: 64, marginBottom: 16 },
  appName:   { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  appTagline:{ color: '#8fa8be', fontSize: 13, marginTop: 4 },
  badge:     { marginTop: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 6 },
  badgeText: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  card:      { flex: 1, backgroundColor: Colors.background, borderTopLeftRadius: 0, padding: 24, paddingTop: 28 },
  formTitle: { color: Colors.text, fontSize: 20, fontWeight: '700', marginBottom: 4 },
  formSub:   { color: Colors.muted, fontSize: 12, marginBottom: 24 },
  label:     { color: '#5d6d7e', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  input:     { backgroundColor: Colors.inputBg, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, color: Colors.text, marginBottom: 16 },
  pwRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  eyeBtn:    { position: 'absolute', right: 14, top: 12 },
  eyeIcon:   { fontSize: 16 },
  loginBtn:  { backgroundColor: Colors.accent, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  demo:      { backgroundColor: '#eafaf6', borderWidth: 1, borderColor: '#a9dfcf', borderRadius: 10, padding: 14, marginBottom: 16 },
  demoTitle: { color: Colors.accent, fontWeight: '700', fontSize: 12, marginBottom: 4 },
  demoText:  { color: '#5d6d7e', fontSize: 12 },
  regLink:   { color: Colors.muted, fontSize: 13, textAlign: 'center', marginTop: 4 },
  regLinkAccent: { color: Colors.accent, fontWeight: '700' },
});
