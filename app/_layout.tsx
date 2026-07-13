import React, { useEffect, useState } from 'react';
import { FlatList, Image } from 'react-native';

import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { DrawerNav } from '../components/DrawerNav';
import { Colors } from '../constants/Colors';
import { useAuth } from '../hooks/useAuth';
import ClassesScreen from './(tabs)/classes';
import HomeScreen from './(tabs)/index';
import PerformanceScreen from './(tabs)/performance';
import ProfileScreen from './(tabs)/profile';
import LoginScreen from './login';
import RegisterScreen from './register';

type Route = 'login' | 'register' | 'home' | 'classes' | 'performance' | 'profile';

const BOTTOM_TABS: { key: Route; label: string }[] = [
  { key:'home',        label:'Home'        },
  { key:'classes',     label:'Class'       },
  { key:'performance', label:'Performance' },
  { key:'profile',     label:'Profile'     },
];

const NOTIFICATIONS = [
  'Jason Magsino posted a new lesson',
  'New assignment: HTML & CSS Project',
  'Class reminder: Session today at 2:00 PM',
  'Grade posted for Quiz 1',
  'Announcement: Midterm exam schedule released',
];

export default function RootLayout() {
  const { user, login, logout, restoreSession } = useAuth();
  const [route, setRoute] = useState<Route>('login');
  const [drawer, setDrawer] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    if (!notifOpen) return;
    const t = setTimeout(() => setNotifOpen(false), 4500);
    return () => clearTimeout(t);
  }, [notifOpen]);




  useEffect(() => {
    restoreSession().then(() => {
      // If session restored in useAuth, user will be set and we navigate
    });
  }, []);

  useEffect(() => {
    if (user) setRoute('home');
  }, [user]);

  const handleLogin = (u: any) => { login(u); };
  const handleLogout = async () => { await logout(); setRoute('login'); };

  if (!user) {
    if (route === 'register') return <RegisterScreen onBack={() => setRoute('login')} />;
    return <LoginScreen onLogin={handleLogin} onGoRegister={() => setRoute('register')} />;
  }

  const screens: Record<string, React.ReactNode> = {
    home:        <HomeScreen user={user} onNavigate={(r) => setRoute(r as Route)} unreadCount={2} />,
    classes:     <ClassesScreen user={user} />,
    performance: <PerformanceScreen user={user} />,
    profile:     <ProfileScreen user={user} />,
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.root}>
        {/* Drawer */}
        <DrawerNav
          visible={drawer}
          onClose={() => setDrawer(false)}
          activeRoute={route as any}
          onNavigate={(r) => setRoute(r)}
          user={user}
          onLogout={handleLogout}
        />
        {/* Top Bar */}
        <SafeAreaView style={styles.topBar} edges={['top']}>
          <TouchableOpacity onPress={() => setDrawer(true)} style={styles.menuBtn}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <View style={styles.topLogo}>
            <Image
              source={require('../trackademic-new-logo.png')}
              style={styles.logoImg}
              resizeMode="contain"
            />
            <Text style={styles.topTitle}>Trackademic</Text>
          </View>

          <View style={styles.topRight}>
            <TouchableOpacity
              style={styles.bellBtn}
              onPress={() => setNotifOpen((v) => !v)}
              activeOpacity={0.8}
            >
              <Text>🔔</Text>
              <View style={styles.bellBadge}><Text style={styles.bellBadgeText}>{NOTIFICATIONS.length}</Text></View>
            </TouchableOpacity>

            {notifOpen && (
              <View style={styles.notifDropdownContainer}>
                <FlatList
                  data={NOTIFICATIONS}
                  keyExtractor={(_, i) => i.toString()}
                  scrollEnabled
                  nestedScrollEnabled
                  scrollEventThrottle={16}
                  renderItem={({ item }) => (
                    <TouchableOpacity style={styles.notifItem}>
                      <Text style={styles.notifItemText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {(user.full_name || user.name || '').split(' ').map((n:string)=>n[0]).slice(0,2).join('')}
              </Text>
            </View>
          </View>
        </SafeAreaView>
        {/* Screen content */}
        <View style={{ flex:1 }}>
          {screens[route] ?? screens['home']}
        </View>
        {/* Bottom Tab Bar */}
        <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
          {BOTTOM_TABS.map((tab) => {
            const active = route === tab.key;
            return (
              <TouchableOpacity key={tab.key} style={styles.tabBtn} onPress={() => setRoute(tab.key)}>
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
                {active && <View style={styles.tabDot} />}
              </TouchableOpacity>
            );
          })}
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root:       { flex:1, backgroundColor:Colors.background },
  topBar:     { backgroundColor:'#fff', borderBottomWidth:1, borderBottomColor:'#e8edf2', flexDirection:'row', alignItems:'center', paddingHorizontal:14, paddingVertical:10, gap:10, zIndex: 100, overflow: 'visible' },
  menuBtn:    { width:36, height:36, justifyContent:'center', alignItems:'center' },
  menuIcon:   { fontSize:20, color:Colors.sidebar },
  topLogo:    { flex:1, flexDirection:'row', alignItems:'center', gap:8 },
  logoImg:    { width:28, height:28 },

  topTitle:   { fontSize:16, fontWeight:'700', color:Colors.sidebar },
  topRight:   { flexDirection:'row', alignItems:'center', gap:10, position: 'relative', zIndex: 101 },
  bellBtn:    { position:'relative', width:32, height:32, justifyContent:'center', alignItems:'center' },
  bellBadge:  { position:'absolute', top:0, right:0, backgroundColor:'#e74c3c', borderRadius:8, width:16, height:16, justifyContent:'center', alignItems:'center' },
  bellBadgeText:{ color:'#fff', fontSize:9, fontWeight:'700' },

  notifDropdown: {
    position: 'absolute',
    top: 42,
    right: 0,
    width: 280,
    maxHeight: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8edf2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 30,
    zIndex: 999,
  },
  notifDropdownContainer: {
    position: 'absolute',
    top: 42,
    right: 0,
    width: 280,
    maxHeight: 300,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8edf2',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 30,
    zIndex: 999,
  },
  notifItem: { 
    paddingHorizontal: 14, 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  notifItemText: { color: Colors.text, fontSize: 13, fontWeight: '500', lineHeight: 18 },

  userAvatar: { width:30, height:30, borderRadius:15, backgroundColor:Colors.accent, justifyContent:'center', alignItems:'center' },
  userAvatarText:{ color:'#fff', fontWeight:'700', fontSize:12 },
  bottomBar:  { backgroundColor:'#fff', borderTopWidth:1, borderTopColor:'#e8edf2', flexDirection:'row' },
  tabBtn:     { flex:1, alignItems:'center', paddingVertical:10 },
  tabLabel:   { fontSize:10, fontWeight:'600', color:'#95a5a6' },
  tabLabelActive:{ color:Colors.accent },
  tabDot:     { width:4, height:4, borderRadius:2, backgroundColor:Colors.accent, marginTop:3 },
});
