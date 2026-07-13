import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import type { AuthUser } from '../../hooks/useAuth';

const QUICK_LINKS = [
  { key:'classes',     label:'My Classes',     desc:'View enrolled classes',    color:Colors.activeCard },
  { key:'performance', label:'My Performance', desc:'Track your scores & grades',color:Colors.accentDark },
  { key:'profile',     label:'My Profile',     desc:'View & edit your info',    color:Colors.accent },
];

interface Props {
  user: AuthUser;
  onNavigate: (route: string) => void;
  unreadCount: number;
}

export default function HomeScreen({ user, onNavigate, unreadCount }: Props) {
  const initials = (user.full_name || user.name || '').split(' ').map((n:string) => n[0]).slice(0,2).join('');
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Welcome card */}
      <View style={styles.welcome}>
        <Text style={styles.welcomeGreet}>Welcome back,</Text>
        <Text style={styles.welcomeName}>{user.full_name || user.name}</Text>
        <Text style={styles.welcomeSub}>{user.sr_code} · {user.section ?? user.course}</Text>
        <View style={styles.yearBadge}>
          <Text style={styles.yearBadgeText}>Year {user.year_level} · {user.course}</Text>
        </View>
      </View>
      {/* Stats */}
      <View style={styles.stats}>
        <View style={[styles.statCard, { backgroundColor:Colors.inputBg }]}>
          <Text style={[styles.statVal, { color:Colors.accent }]}>2</Text>
          <Text style={styles.statLabel}>Active Classes</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor:'#fdecea' }]}>
          <Text style={[styles.statVal, { color:Colors.danger }]}>{unreadCount}</Text>
          <Text style={styles.statLabel}>Notifications</Text>
        </View>
      </View>
      {/* Quick links */}
      <Text style={styles.sectionTitle}>Navigation</Text>
      {QUICK_LINKS.map((item) => (
        <TouchableOpacity key={item.key} style={styles.linkRow} onPress={() => onNavigate(item.key)} activeOpacity={0.75}>
          <View style={[styles.linkIcon, { backgroundColor: item.color }]}>
            <Text style={styles.linkIconText}>{item.label[0]}</Text>
          </View>
          <View style={{ flex:1 }}>
            <Text style={styles.linkLabel}>{item.label}</Text>
            <Text style={styles.linkDesc}>{item.desc}</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll:       { flex:1, backgroundColor:Colors.background },
  content:      { padding:16, paddingBottom:32 },
  welcome:      { backgroundColor:Colors.sidebar, borderRadius:16, padding:20, marginBottom:16 },
  welcomeGreet: { color:'#8fa8be', fontSize:12, fontWeight:'500' },
  welcomeName:  { color:'#fff', fontSize:20, fontWeight:'700', marginTop:4 },
  welcomeSub:   { color:'#8fa8be', fontSize:12, marginTop:2 },
  yearBadge:    { marginTop:12, alignSelf:'flex-start', backgroundColor:'rgba(255,255,255,0.12)', borderRadius:20, paddingHorizontal:12, paddingVertical:5 },
  yearBadgeText:{ color:'#fff', fontSize:11 },
  stats:        { flexDirection:'row', gap:12, marginBottom:20 },
  statCard:     { flex:1, borderRadius:14, padding:16 },
  statVal:      { fontSize:28, fontWeight:'800' },
  statLabel:    { fontSize:11, color:Colors.muted, marginTop:4 },
  sectionTitle: { color:Colors.muted, fontSize:10, fontWeight:'700', textTransform:'uppercase', letterSpacing:1, marginBottom:10 },
  linkRow:      { backgroundColor:'#fff', borderRadius:14, flexDirection:'row', alignItems:'center', padding:14, marginBottom:10, gap:14, shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.06, shadowRadius:8, elevation:2 },
  linkIcon:     { width:42, height:42, borderRadius:12, justifyContent:'center', alignItems:'center' },
  linkIconText: { color:'#fff', fontWeight:'800', fontSize:18 },
  linkLabel:    { fontSize:14, fontWeight:'600', color:Colors.text },
  linkDesc:     { fontSize:11, color:Colors.muted, marginTop:2 },
  chevron:      { color:'#bdc3c7', fontSize:22 },
});
