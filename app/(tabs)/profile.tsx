import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image, Pressable, SafeAreaView, ScrollView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { updateProfile } from '../../api/classes';
import { AlertModal } from '../../components/AlertModal';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { Colors } from '../../constants/Colors';
import { useAlert } from '../../hooks/useAlert';
import type { AuthUser } from '../../hooks/useAuth';

interface Props { user: AuthUser; onUpdate?: (u: AuthUser) => void }

export default function ProfileScreen({ user, onUpdate }: Props) {
  const [tab, setTab] = useState<'personal' | 'qr'>('personal');
  const [form, setForm] = useState({
    full_name:  user.full_name || user.name || '',
    section:    user.section   || '',
    year_level: String(user.year_level ?? 1),
  });
  const { alert, showAlert, hideAlert, loading, showLoading, hideLoading } = useAlert();
  const initials = form.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('');

  const handleUpdate = async () => {
    showLoading('Updating profile…');
    try {
      await updateProfile(user.id, {
        full_name: form.full_name,
        section:   form.section,
        year_level: Number(form.year_level),
      });
      hideLoading();
      showAlert('success', 'Profile Updated', 'Your profile has been saved successfully.');
    } catch (err: any) {
      hideLoading();
      showAlert('error', 'Update Failed', err.response?.data?.error ?? err.message);
    }
  };

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:Colors.background }}>
      <LoadingOverlay visible={loading.show} message={loading.message} />
      <AlertModal alert={alert} onClose={hideAlert} />
      {/* Banner */}
      <View style={s.banner}>
        <View style={s.avatar}><Text style={s.avatarText}>{initials}</Text></View>
        <View style={s.bannerInfo}>
          <Text style={s.bannerName}>{form.full_name}</Text>
          <Text style={s.bannerSub}>{form.section}</Text>
        </View>
        <TouchableOpacity style={s.updatePhotoBtn}><Text style={s.updatePhotoBtnText}>Update Photo</Text></TouchableOpacity>
      </View>
      {/* Tabs */}
      <View style={s.tabs}>
        {(['personal','qr'] as const).map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} style={[s.tab, tab===t && s.tabActive]}>
            <Text style={[s.tabText, tab===t && s.tabTextActive]}>
              {t === 'personal' ? 'Personal Info' : 'Download QR Code'}
            </Text>
          </Pressable>
        ))}
      </View>
      {tab === 'personal' ? (
        <ScrollView contentContainerStyle={s.form} showsVerticalScrollIndicator={false}>
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>About Me</Text>
              <View style={s.sectionAccent} />
            </View>
            {[
              { key:'full_name', label:'Full Name', placeholder:'Your full name' },
              { key:'section',   label:'Section',   placeholder:'e.g. BSIT BA-3103' },
              { key:'year_level',label:'Year Level', placeholder:'e.g. 3', type:'numeric' },
            ].map((f) => (
              <View key={f.key} style={s.field}>
                <Text style={s.fieldLabel}>{f.label}</Text>
                <TextInput
                  value={form[f.key as keyof typeof form]}
                  onChangeText={(v) => setForm((prev) => ({ ...prev, [f.key]: v }))}
                  placeholder={f.placeholder}
                  placeholderTextColor="#b0bec5"
                  keyboardType={(f.type as any) ?? 'default'}
                  style={s.fieldInput}
                />
              </View>
            ))}
            <View style={s.field}>
              <Text style={s.fieldLabel}>SR Code</Text>
              <TextInput value={user.sr_code} editable={false} style={[s.fieldInput, { color:Colors.muted }]} />
            </View>
            <View style={s.field}>
              <Text style={s.fieldLabel}>Email</Text>
              <TextInput value={user.email} editable={false} style={[s.fieldInput, { color:Colors.muted }]} />
            </View>
            <TouchableOpacity style={s.saveBtn} onPress={handleUpdate}>
              <Text style={s.saveBtnText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={s.qrContainer}>
          <Text style={s.qrTitle}>My QR Code</Text>
          <View style={s.qrCard}>
            <View style={s.qrAvatar}><Text style={s.qrAvatarText}>{initials}</Text></View>
            <Text style={s.qrName}>{form.full_name}</Text>
            <Text style={s.qrSrCode}>Sr Code: {user.sr_code}</Text>
            {/* Icon-style QR Code using MaterialCommunityIcons */}
            <View style={s.qrIconWrap}>
              <View style={s.qrIconTile}>
                <MaterialCommunityIcons name="qrcode" size={48} color={Colors.accent} />
              </View>
              <Text style={s.qrIconSub}>{user.sr_code}</Text>
            </View>
            <View style={s.qrBrand}>
              <Image
                source={require('../../trackademic-new-logo.png')}
                style={s.qrLogoImg}
                resizeMode="contain"
              />
              <Text style={s.qrBrandName}>Trackademic</Text>
            </View>
          </View>
          <TouchableOpacity style={s.downloadBtn}>
            <Text style={s.downloadBtnText}>⬇  Download ID</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  banner:       { backgroundColor:Colors.sidebar, height:120, flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingTop:16, gap:12 },
  avatar:       { width:60, height:60, borderRadius:30, backgroundColor:Colors.accent, justifyContent:'center', alignItems:'center', borderWidth:3, borderColor:'rgba(255,255,255,0.2)' },
  avatarText:   { color:'#fff', fontWeight:'800', fontSize:22 },
  bannerInfo:   { flex:1 },
  bannerName:   { color:'#fff', fontWeight:'700', fontSize:15 },
  bannerSub:    { color:'#8fa8be', fontSize:12 },
  updatePhotoBtn:{ backgroundColor:Colors.accent, paddingHorizontal:12, paddingVertical:6, borderRadius:6 },
  updatePhotoBtnText:{ color:'#fff', fontSize:11, fontWeight:'600' },
  tabs:         { flexDirection:'row', borderBottomWidth:1, borderBottomColor:'#e0e8f0', backgroundColor:'#fff' },
  tab:          { flex:1, paddingVertical:14, alignItems:'center', borderBottomWidth:2, borderBottomColor:'transparent' },
  tabActive:    { borderBottomColor:Colors.accent },
  tabText:      { fontSize:13, color:Colors.muted, fontWeight:'500' },
  tabTextActive:{ color:Colors.accent, fontWeight:'700' },
  form:         { padding:16, paddingBottom:32 },
  section:      { backgroundColor:'#fff', borderRadius:14, overflow:'hidden', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:8, elevation:2 },
  sectionHeader:{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingVertical:14, borderBottomWidth:1, borderBottomColor:'#f0f0f0' },
  sectionTitle: { fontSize:14, fontWeight:'700', color:Colors.text },
  sectionAccent:{ width:16, height:16, borderRadius:3, backgroundColor:Colors.accent },
  field:        { paddingHorizontal:16, paddingVertical:10, borderBottomWidth:1, borderBottomColor:'#f5f5f5' },
  fieldLabel:   { fontSize:11, fontWeight:'600', color:Colors.muted, marginBottom:6, textTransform:'uppercase', letterSpacing:0.6 },
  fieldInput:   { backgroundColor:Colors.inputBg, borderRadius:8, paddingHorizontal:12, paddingVertical:10, fontSize:13, color:Colors.text },
  saveBtn:      { margin:16, backgroundColor:Colors.accent, borderRadius:10, paddingVertical:14, alignItems:'center' },
  saveBtnText:  { color:'#fff', fontWeight:'700', fontSize:14 },
  qrContainer:  { flex:1, alignItems:'center', padding:20 },
  qrTitle:      { fontSize:15, fontWeight:'700', color:Colors.text, marginBottom:20, alignSelf:'flex-start' },
  qrCard:       { backgroundColor:'#fff', borderRadius:16, borderWidth:1, borderColor:'#e0e0e0', padding:24, alignItems:'center', width:220, shadowColor:'#000', shadowOffset:{width:0,height:4}, shadowOpacity:0.08, shadowRadius:12, elevation:4 },
  qrAvatar:     { width:64, height:64, borderRadius:32, backgroundColor:Colors.accent, justifyContent:'center', alignItems:'center', borderWidth:2, borderColor:Colors.blue },
  qrAvatarText: { color:'#fff', fontWeight:'800', fontSize:24 },
  qrName:       { fontSize:15, fontWeight:'700', color:Colors.text, marginTop:12 },
  qrSrCode:     { fontSize:12, color:Colors.muted, marginTop:4, marginBottom:16 },
  qrIconWrap:      { width:120, height:120, backgroundColor:'#f8f9fa', borderWidth:1, borderColor:'#e0e0e0', borderRadius:4, justifyContent:'center', alignItems:'center', gap:8 },
  qrIconTile:      { width:56, height:56, borderRadius:10, backgroundColor:'rgba(0,0,0,0.04)', justifyContent:'center', alignItems:'center' },
  qrIconSub:       { fontSize:8, color:Colors.muted, marginTop:4 },
  qrBrand:      { flexDirection:'row', alignItems:'center', gap:6, marginTop:16 },
  qrLogoImg:    { width:20, height:20 },
  qrBrandName:  { fontSize:12, fontWeight:'700', color:Colors.text },
  downloadBtn:  { marginTop:20, backgroundColor:Colors.blue, paddingHorizontal:24, paddingVertical:12, borderRadius:10 },
  downloadBtnText:{ color:'#fff', fontWeight:'700', fontSize:13 },
});
