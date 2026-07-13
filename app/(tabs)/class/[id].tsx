import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '../../../constants/Colors';

type Lesson = { title: string; type: string; due: string; progress: number };
type File = { title: string; type: string; size: string; uploadedBy: string };

const MOCK_FILES: Record<string, File[]> = {
  '1': [
    { title: 'Course Syllabus', type: 'PDF', size: '2.4 MB', uploadedBy: 'Jason C. Magsino' },
    { title: 'Chapter 1 Slides', type: 'PDF', size: '5.1 MB', uploadedBy: 'Jason C. Magsino' },
    { title: 'HTML Cheat Sheet', type: 'PDF', size: '1.8 MB', uploadedBy: 'Jason C. Magsino' },
    { title: 'Sample Code Repository', type: 'ZIP', size: '12.3 MB', uploadedBy: 'Jason C. Magsino' },
  ],
  '2': [
    { title: 'React Framework Guide', type: 'PDF', size: '3.5 MB', uploadedBy: 'Jason C. Magsino' },
    { title: 'Flutter Basics Tutorial', type: 'PDF', size: '4.2 MB', uploadedBy: 'Jason C. Magsino' },
    { title: 'Project Starter Template', type: 'ZIP', size: '8.7 MB', uploadedBy: 'Jason C. Magsino' },
    { title: 'Emerging Tech Trends 2025', type: 'PDF', size: '2.1 MB', uploadedBy: 'Jason C. Magsino' },
  ],
};

const MOCK_LESSONS: Record<string, Lesson[]> = {
  '1': [
    { title: 'Lesson 1: Intro to the Subject', type: 'Lesson', due: 'Mon', progress: 100 },
    { title: 'Classwork: Activity A', type: 'Classwork', due: 'Wed', progress: 60 },
    { title: 'Quiz 1 Review', type: 'Quiz', due: 'Fri', progress: 10 },
  ],
  '2': [
    { title: 'Lesson 1: Fundamentals', type: 'Lesson', due: 'Tue', progress: 40 },
    { title: 'Lab: Emerging Tech Demo', type: 'Lab', due: 'Thu', progress: 0 },
    { title: 'Assignment 1', type: 'Assignment', due: 'Sat', progress: 25 },
  ],
};

export default function ClassDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const id = params.id ?? '1';

  const mockClass = {
    code: id === '2' ? 'ag09adet' : 'ag08itoc',
    subject: id === '2' ? 'APPLICATION DEVELOPMENT AND EMERGING TECHNOLOGIES' : 'WEB SYSTEMS AND TECHNOLOGIES',
    instructor: 'Jason C. Magsino',
    schedules: id === '2'
      ? ['Mon 01:00 PM - 06:00 PM', 'Wed 01:00 PM - 06:00 PM', 'Sat 07:00 AM - 12:00 PM']
      : ['Tue 02:00 PM - 04:00 PM', 'Fri 04:00 PM - 07:00 PM'],
    files: MOCK_FILES[id] ?? MOCK_FILES['1'],
    lessons: MOCK_LESSONS[id] ?? MOCK_LESSONS['1'],
    status: id === '2' ? 'Active' : 'Archived',
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.headerCard, { backgroundColor: id === '2' ? '#f97316' : '#5d6d7e' }]}>
          <Text style={styles.headerTitle}>{mockClass.subject}</Text>
          <Text style={styles.headerCode}>Class Code: {mockClass.code}</Text>
          <Text style={styles.headerMeta}>Instructor: {mockClass.instructor}</Text>
          <Text style={styles.headerMeta}>Status: {mockClass.status}</Text>
          <Text style={styles.headerMeta}>Schedule:</Text>
          {mockClass.schedules.map((s, i) => (
            <Text key={i} style={styles.headerScheduleText}>• {s}</Text>
          ))}
        </View>

        {/* Files */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📁 Class Files</Text>
          {mockClass.files.map((f, i) => (
            <View key={i} style={styles.fileCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName}>{f.title}</Text>
                <Text style={styles.fileMeta}>{f.type} • {f.size}</Text>
                <Text style={styles.fileUploaded}>By {f.uploadedBy}</Text>
              </View>
              <View style={styles.downloadIcon}>
                <Text style={styles.downloadText}>⬇</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Lessons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Lessons & Assignments</Text>
          {mockClass.lessons.map((l, i) => (
            <View key={i} style={styles.lessonCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.lessonTitle}>{l.title}</Text>
                <Text style={styles.lessonMeta}>{l.type} • Due: {l.due}</Text>
              </View>
              <View style={styles.progressPill}>
                <Text style={styles.progressText}>{l.progress}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Placeholder bottom */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },

  headerCard: {
    borderRadius: 16,
    padding: 18,
    overflow: 'hidden',
  },
  headerTitle: { color: '#fff', fontWeight: '800', fontSize: 16, textTransform: 'uppercase' },
  headerCode: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '700', marginTop: 8 },
  headerMeta: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 4 },
  headerScheduleText: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 2 },

  section: { marginTop: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: Colors.text, marginBottom: 10 },

  fileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  fileName: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  fileMeta: { fontSize: 11, color: Colors.muted, marginBottom: 2 },
  fileUploaded: { fontSize: 10, color: Colors.muted, fontStyle: 'italic' },
  downloadIcon: { backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  downloadText: { fontSize: 16, color: Colors.accent },

  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lessonTitle: { fontSize: 13, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  lessonMeta: { fontSize: 11, color: Colors.muted },

  progressPill: { backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  progressText: { fontSize: 12, fontWeight: '800', color: Colors.text },
});

