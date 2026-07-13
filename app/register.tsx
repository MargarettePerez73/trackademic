import React, { useState } from 'react';
import {
  Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { register as apiRegister } from '../api/auth';
import { AlertModal } from '../components/AlertModal';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { Colors } from '../constants/Colors';
import { useAlert } from '../hooks/useAlert';

interface Props { onBack: () => void }

export default function RegisterScreen({ onBack }: Props) {
  const [form, setForm] = useState({ srCode:'', fullName:'', email:'', username:'', password:'' });
  const [showPw, setShowPw] = useState(false);
  const { alert, showAlert, hideAlert, loading, showLoading, hideLoading } = useAlert();

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleRegister = async () => {
    const { srCode, fullName, email, username, password } = form;
    if (!srCode || !fullName || !email || !username || !password) {
      showAlert('error', 'Incomplete Form', 'All fields are required.'); return;
    }
    if (password.length < 8) {
      showAlert('error', 'Weak Password', 'Password must be at least 8 characters.'); return;
    }
    showLoading('Creating your account…');
    try {
      await apiRegister({ sr_code: srCode, full_name: fullName, name: fullName, username, email, password });
      hideLoading();
      showAlert('success', 'Registration Successful!', 'Your account has been created. You can now sign in.');
      setTimeout(() => { hideAlert(); onBack(); }, 2000);
    } catch (err: any) {
      hideLoading();
      showAlert('error', 'Registration Failed', err.response?.data?.error ?? err.message ?? 'Something went wrong.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LoadingOverlay visible={loading.show} message={loading.message} />
      <AlertModal alert={alert} onClose={hideAlert} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Image
          source={require('../trackademic-new-logo.png')}
          style={styles.logoImg}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSub}>Student Registration</Text>
        </View>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            {[
              { key:'srCode',   label:'SR Code',        placeholder:'e.g. 23-72068',                    type:'default' },
              { key:'fullName', label:'Full Name',       placeholder:'e.g. Juan Dela Cruz',              type:'words' },
              { key:'email',    label:'Email Address',   placeholder:'yourname@g.batstate-u.edu.ph',     type:'email-address' },
              { key:'username', label:'Username',        placeholder:'Choose a username',                type:'default' },
              { key:'password', label:'Password',        placeholder:'At least 8 characters',            type:'default' },
            ].map((f) => (
              <View key={f.key}>
                <Text style={styles.label}>{f.label}</Text>
                <View style={styles.inputWrap}>
                  <TextInput
                    value={form[f.key as keyof typeof form]}
                    onChangeText={set(f.key as keyof typeof form)}
                    placeholder={f.placeholder}
                    placeholderTextColor="#b0bec5"
                    secureTextEntry={f.key === 'password' && !showPw}
                    keyboardType={f.type as any}
                    autoCapitalize={f.key === 'email' || f.key === 'username' || f.key === 'password' ? 'none' : 'words'}
                    style={styles.input}
                  />
                  {f.key === 'password' && (
                    <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
                      <Text>{showPw ? '🙈' : '👁'}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
            <Text style={styles.disclaimer}>
              By registering, you agree to the BatStateU-TNEd Trackademic terms and privacy policy.
            </Text>
            <Pressable style={styles.btn} onPress={handleRegister}>
              <Text style={styles.btnText}>Create Account</Text>
            </Pressable>
            <Pressable onPress={onBack}>
              <Text style={styles.signinLink}>Already have an account? <Text style={{ color: Colors.accent, fontWeight:'700' }}>Sign In</Text></Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: Colors.sidebar },
  header:     { flexDirection:'row', alignItems:'center', gap:12, padding:16, paddingTop:52 },
  backBtn:    { width:32, height:32, borderRadius:16, backgroundColor:'rgba(255,255,255,0.12)', justifyContent:'center', alignItems:'center' },
  backIcon:   { color:'#fff', fontSize:22, lineHeight:26 },
  logoImg:    { width:34, height:34 },
  headerTitle:{ color:'#fff', fontWeight:'700', fontSize:15 },
  headerSub:  { color:'#8fa8be', fontSize:11 },
  scroll:     { flexGrow:1 },
  card:       { flex:1, backgroundColor:Colors.background, padding:20, paddingTop:24 },
  label:      { color:'#5d6d7e', fontSize:11, fontWeight:'700', textTransform:'uppercase', letterSpacing:0.8, marginBottom:6, marginTop:4 },
  inputWrap:  { position:'relative', marginBottom:12 },
  input:      { backgroundColor:Colors.inputBg, borderRadius:10, paddingHorizontal:14, paddingVertical:13, fontSize:14, color:Colors.text },
  eyeBtn:     { position:'absolute', right:14, top:12 },
  disclaimer: { color:Colors.muted, fontSize:11, lineHeight:17, marginBottom:20, marginTop:8 },
  btn:        { backgroundColor:Colors.accent, borderRadius:10, paddingVertical:14, alignItems:'center', marginBottom:14 },
  btnText:    { color:'#fff', fontWeight:'700', fontSize:15 },
  signinLink: { color:Colors.muted, fontSize:13, textAlign:'center' },
});
