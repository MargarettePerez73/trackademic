import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { getPerformance } from '../../api/classes';
import { AlertModal } from '../../components/AlertModal';
import { LoadingOverlay } from '../../components/LoadingOverlay';
import { DUMMY_PERFORMANCE } from '../../constants/Dummy';
import { Colors } from '../../constants/Colors';
import { useAlert } from '../../hooks/useAlert';
import type { AuthUser } from '../../hooks/useAuth';

interface Props { user: AuthUser }

export default function PerformanceScreen({ user }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [yearFilter, setYearFilter]    = useState('2025-2026');
  const { alert, showAlert, hideAlert, loading, showLoading, hideLoading } = useAlert();

  const load = useCallback(async () => {
    showLoading('Loading performance…');
    try {
      const res = await getPerformance(user.id);
      setData(res);
    } catch {
      setData(DUMMY_PERFORMANCE);
    } finally {
      hideLoading();
    }
  }, [user.id]);

  useEffect(() => { load(); }, [load]);

  const filtered = data.filter((d) => d.school_year === yearFilter);

  return (
    <View style={{ flex:1, backgroundColor:Colors.background }}>
      <LoadingOverlay visible={loading.show} message={loading.message} />
      <AlertModal alert={alert} onClose={hideAlert} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.title}>My Performance</Text>
        </View>
        {/* Column headers */}
        <View style={s.tableHeader}>
          {['Class Code','Classwork Title','Total','Score','Avg'].map((h) => (
            <Text key={h} style={[s.th, h==='Classwork Title'?{flex:2}:{flex:1}]}>{h}</Text>
          ))}
        </View>
        {/* Rows */}
        {filtered.map((row, i) => (
          <View key={i} style={[s.row, i%2===0?{}:{backgroundColor:'#fafbfc'}]}>
            <Text style={[s.td, s.codeCell]}>{row.class_code}</Text>
            <Text style={[s.td, s.titleCell]} numberOfLines={2}>{row.title}</Text>
            <Text style={s.td}>{row.total_items}</Text>
            <Text style={s.td}>{row.score}</Text>
            <Text style={[s.td, s.avgCell, { color: parseFloat(row.average)>=75 ? Colors.accent : Colors.danger }]}>{row.average}</Text>
          </View>
        ))}
        {filtered.length > 0 && (
          <View style={s.footer}>
            <Text style={s.footerText}>{filtered.length} records</Text>
            <Text style={s.footerAvg}>Avg: {(filtered.reduce((s:number,r:any)=>s+parseFloat(r.average),0)/filtered.length).toFixed(2)}%</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  header:      { padding:16, paddingTop:20 },
  title:       { fontSize:18, fontWeight:'700', color:Colors.text },
  tableHeader: { flexDirection:'row', backgroundColor:'#f8f9fa', borderTopWidth:1, borderBottomWidth:1, borderColor:'#e0e0e0', paddingHorizontal:8, paddingVertical:10 },
  th:          { flex:1, fontSize:10, fontWeight:'700', color:Colors.text, textTransform:'uppercase', letterSpacing:0.5 },
  row:         { flexDirection:'row', paddingHorizontal:8, paddingVertical:10, borderBottomWidth:1, borderBottomColor:'#f0f0f0', backgroundColor:'#fff' },
  td:          { flex:1, fontSize:11, color:Colors.muted },
  codeCell:    { fontFamily:'monospace', color:'#5d6d7e' },
  titleCell:   { flex:2, color:Colors.blue, fontSize:11 },
  avgCell:     { fontWeight:'700' },
  footer:      { flexDirection:'row', justifyContent:'space-between', paddingHorizontal:12, paddingVertical:10, backgroundColor:'#f8f9fa', borderTopWidth:1, borderTopColor:'#e0e0e0' },
  footerText:  { fontSize:12, color:Colors.muted },
  footerAvg:   { fontSize:12, fontWeight:'700', color:Colors.text },
});
