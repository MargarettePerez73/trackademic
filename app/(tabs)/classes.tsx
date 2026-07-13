import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, Pressable, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { getClasses } from '../../api/classes';
import { AlertModal } from '../../components/AlertModal';
import { JoinClassModal } from '../../components/JoinClassModal';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { DUMMY_CLASSES } from '../../constants/Dummy';
import { Colors } from '../../constants/Colors';
import { useAlert } from '../../hooks/useAlert';
import type { AuthUser } from '../../hooks/useAuth';
import { joinClass } from '../../api/classes';

interface Props { user: AuthUser }

export default function ClassesScreen({ user }: Props) {
  const [classes, setClasses] = useState<any[]>([]);
  const [yearFilter, setYearFilter] = useState('All School Years');
  const [semFilter, setSemFilter] = useState('All Semesters');
  const [joinVisible, setJoinVisible] = useState(false);
  const { alert, showAlert, hideAlert, loading, showLoading, hideLoading } = useAlert();

  const load = useCallback(async () => {
    showLoading('Loading classes…');
    try {
      const data = await getClasses(user.id);
      setClasses(data);
    } catch {
      setClasses(DUMMY_CLASSES as any[]);
    } finally {
      hideLoading();
    }
  }, [user.id]);

  useEffect(() => { load(); }, [load]);

  const years = ['All School Years', ...Array.from(new Set(classes.map((c) => c.school_year)))];
  const sems  = ['All Semesters',    ...Array.from(new Set(classes.map((c) => c.semester)))];

  const filtered = classes.filter((c) => {
    if (yearFilter !== 'All School Years' && c.school_year !== yearFilter) return false;
    if (semFilter  !== 'All Semesters'    && c.semester    !== semFilter)  return false;
    return true;
  });

  const handleJoin = async (code: string) => {
    if (!code) { showAlert('error', 'Missing Code', 'Please enter a class code.'); return; }
    setJoinVisible(false);
    showLoading('Joining class…');
    try {
      const res = await joinClass(user.id, code);
      hideLoading();
      showAlert('success', 'Joined!', res.message);
      load();
    } catch (err: any) {
      hideLoading();
      showAlert('error', 'Failed to Join', err.response?.data?.error ?? err.message);
    }
  };

  return (
    <View style={{ flex:1, backgroundColor:Colors.background }}>
      <LoadingOverlay visible={loading.show} message={loading.message} />
      <AlertModal alert={alert} onClose={hideAlert} />
      <JoinClassModal visible={joinVisible} onClose={() => setJoinVisible(false)} onJoin={handleJoin} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.topRow}>
          <Text style={s.pageTitle}>My Classes</Text>
          <TouchableOpacity style={s.joinBtn} onPress={() => setJoinVisible(true)}>
            <Text style={s.joinBtnText}>+ Join Class</Text>
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View style={s.filters}>
          {[
            { val:yearFilter, opts:years, set:setYearFilter },
            { val:semFilter,  opts:sems,  set:setSemFilter  },
          ].map((f, i) => (
            <View key={i} style={s.select}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {f.opts.map((o) => (
                  <Pressable key={o} onPress={() => f.set(o)}
                    style={[s.pill, f.val===o && s.pillActive]}>
                    <Text style={[s.pillText, f.val===o && s.pillTextActive]}>{o}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ))}
        </View>

        {/* Cards */}
        <View style={s.list}>
          {filtered.map((cls) => (
            <View key={cls.id} style={s.card}>
              <View style={[s.cardBanner, { backgroundColor: cls.banner_color }]}>
                <View style={{ flex:1 }}>
                  <Text style={s.cardTitle}>{cls.subject_name}</Text>
                  <Text style={s.cardCourse}>{cls.course_code}</Text>
                  <Text style={s.cardMeta}><Text style={s.bold}>Course Name: </Text>| {cls.subject_name.charAt(0)+cls.subject_name.slice(1).toLowerCase()}</Text>
                  <Text style={s.cardMeta}><Text style={s.bold}>Instructor: </Text>| {cls.instructor}</Text>
                  <Text style={s.cardMeta}><Text style={s.bold}>S.Y / Semester: </Text>| {cls.school_year} | {cls.semester}</Text>
                  <Text style={s.cardMeta}><Text style={s.bold}>Class Status: </Text>| {cls.status}</Text>
                </View>
                <View style={s.avatarPlaceholder}>
                  <Text style={s.avatarText}>{cls.instructor.split(' ').map((n:string)=>n[0]).slice(0,2).join('')}</Text>
                </View>
              </View>
              <View style={s.cardBody}>
                <Text style={s.schedLabel}>Schedule:</Text>
                {(cls.schedules || []).map((sc:string, i:number) => (
                  <Text key={i} style={s.schedText}>{sc}</Text>
                ))}
                <TouchableOpacity style={s.viewBtn}>
                  <Text style={s.viewBtnText}>View Class</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  topRow:    { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:16, paddingTop:20, paddingBottom:12 },
  pageTitle: { fontSize:18, fontWeight:'700', color:Colors.text },
  joinBtn:   { backgroundColor:Colors.accent, paddingHorizontal:14, paddingVertical:8, borderRadius:8 },
  joinBtnText:{ color:'#fff', fontSize:12, fontWeight:'700' },
  filters:   { paddingHorizontal:16, marginBottom:8, gap:8 },
  select:    {},
  pill:      { borderWidth:1, borderColor:'#d0d8e0', borderRadius:20, paddingHorizontal:12, paddingVertical:6, marginRight:8, backgroundColor:'#fff' },
  pillActive:{ backgroundColor:Colors.sidebar, borderColor:Colors.sidebar },
  pillText:  { fontSize:12, color:Colors.muted },
  pillTextActive:{ color:'#fff', fontWeight:'600' },
  list:      { paddingHorizontal:16, gap:16, paddingBottom:32 },
  card:      { backgroundColor:'#fff', borderRadius:12, overflow:'hidden', shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.08, shadowRadius:8, elevation:3 },
  cardBanner:{ padding:16, flexDirection:'row', alignItems:'flex-start', gap:12 },
  cardTitle: { color:'#fff', fontWeight:'700', fontSize:12, textTransform:'uppercase', marginBottom:2 },
  cardCourse:{ color:'rgba(255,255,255,0.75)', fontSize:11, marginBottom:8 },
  cardMeta:  { color:'rgba(255,255,255,0.8)', fontSize:11, marginBottom:2 },
  bold:      { fontWeight:'700' },
  avatarPlaceholder:{ width:40, height:40, borderRadius:20, backgroundColor:'rgba(255,255,255,0.25)', justifyContent:'center', alignItems:'center' },
  avatarText:{ color:'#fff', fontWeight:'700', fontSize:13 },
  cardBody:  { padding:16, borderTopWidth:1, borderTopColor:'#f0f0f0' },
  schedLabel:{ fontSize:12, fontWeight:'700', color:Colors.text, marginBottom:4 },
  schedText: { fontSize:12, color:Colors.muted, marginBottom:2 },
  viewBtn:   { marginTop:12, borderWidth:1, borderColor:Colors.accent, borderRadius:6, paddingVertical:7, paddingHorizontal:14, alignSelf:'flex-start' },
  viewBtnText:{ color:Colors.accent, fontSize:12, fontWeight:'600' },
});
