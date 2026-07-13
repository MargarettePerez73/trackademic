import React from 'react';
import {
  Animated, Image, Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import type { AuthUser } from '../hooks/useAuth';

type RouteKey = 'home' | 'classes' | 'performance' | 'profile';

interface Props {
  visible: boolean;
  onClose: () => void;
  activeRoute: RouteKey;
  onNavigate: (route: RouteKey) => void;
  user: AuthUser;
  onLogout: () => void;
}

const NAV_ITEMS: { key: RouteKey; label: string }[] = [
  { key: 'home',        label: 'Home' },
  { key: 'classes',     label: 'Class' },
  { key: 'performance', label: 'My Performance' },
];

export function DrawerNav({ visible, onClose, activeRoute, onNavigate, user, onLogout }: Props) {
  if (!visible) return null;
  const initials = (user.full_name || user.name || '')
    .split(' ').map((n: string) => n[0]).slice(0, 2).join('');

  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <SafeAreaView style={styles.drawer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Image
              source={require('../trackademic-new-logo.png')}
              style={styles.logoImg}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.logoName}>Trackademic</Text>
              <Text style={styles.logoSub}>Academic Tracker</Text>
            </View>
          </View>
          <View style={styles.userCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName} numberOfLines={1}>{user.full_name || user.name}</Text>
              <Text style={styles.userSub} numberOfLines={1}>{user.sr_code} · Student</Text>
            </View>
          </View>
        </View>

        {/* Nav */}
        <View style={styles.nav}>
          <Text style={styles.navLabel}>Navigation</Text>
          {NAV_ITEMS.map((item) => {
            const active = activeRoute === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.navItem, active && styles.navItemActive]}
                onPress={() => { onNavigate(item.key); onClose(); }}
              >
                <Text style={[styles.navText, active && styles.navTextActive]}>{item.label}</Text>
                <Text style={[styles.chevron, active && { color: Colors.accent }]}>›</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.profileBtn} onPress={() => { onNavigate('profile'); onClose(); }}>
            <Text style={styles.profileBtnText}>👤  Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 },
  drawer: {
    position: 'absolute', top: 0, left: 0, bottom: 0, width: 260,
    backgroundColor: Colors.sidebar, zIndex: 50,
    shadowColor: '#000', shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 20,
  },
  header:     { padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.sidebarBorder },
  logoRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  logoImg:    { width: 36, height: 36 },
  logoName:   { color: '#fff', fontWeight: '700', fontSize: 14 },
  logoSub:    { color: Colors.sidebarLabel, fontSize: 10 },
  userCard:   { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12, padding: 12 },
  avatar:     { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  userName:   { color: '#fff', fontSize: 12, fontWeight: '600' },
  userSub:    { color: Colors.sidebarLabel, fontSize: 10 },
  nav:        { flex: 1, padding: 12 },
  navLabel:   { color: Colors.sidebarLabel, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2, marginLeft: 10, marginBottom: 6, marginTop: 8 },
  navItem:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 13, borderRadius: 10, marginBottom: 2 },
  navItemActive: { backgroundColor: 'rgba(249,115,22,0.18)' },
  navText:    { flex: 1, color: '#c8d8e8', fontSize: 14, fontWeight: '500' },
  navTextActive: { color: '#fff' },
  chevron:    { color: '#5d7a96', fontSize: 18 },
  footer:     { padding: 12, borderTopWidth: 1, borderTopColor: Colors.sidebarBorder },
  profileBtn: { paddingHorizontal: 12, paddingVertical: 12, borderRadius: 10, marginBottom: 4 },
  profileBtnText: { color: '#c8d8e8', fontSize: 14, fontWeight: '500' },
  logoutBtn:  { paddingHorizontal: 12, paddingVertical: 12, borderRadius: 10 },
  logoutText: { color: '#e57373', fontSize: 14, fontWeight: '600' },
});
