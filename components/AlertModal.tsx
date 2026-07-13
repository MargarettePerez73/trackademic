import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';
import type { AlertState } from '../hooks/useAlert';

interface Props {
  alert: AlertState | null;
  onClose: () => void;
}

export function AlertModal({ alert, onClose }: Props) {
  if (!alert) return null;

  const config = {
    success: { icon: '✓', iconBg: '#e6f9f4', iconColor: Colors.accent,  btnBg: Colors.accent },
    error:   { icon: '✕', iconBg: '#fdecea', iconColor: Colors.danger,  btnBg: Colors.danger },
    info:    { icon: 'ℹ', iconBg: '#e8f4fd', iconColor: Colors.blue,   btnBg: Colors.blue  },
  }[alert.type];

  return (
    <Modal transparent animationType="fade" visible>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.box} onPress={() => {}}>
          <View style={[styles.iconCircle, { backgroundColor: config.iconBg }]}>
            <Text style={[styles.iconText, { color: config.iconColor }]}>{config.icon}</Text>
          </View>
          <Text style={styles.title}>{alert.title}</Text>
          <Text style={styles.msg}>{alert.message}</Text>
          <Pressable
            style={[styles.btn, { backgroundColor: config.btnBg }]}
            onPress={onClose}
          >
            <Text style={styles.btnText}>OK</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  box: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24,
    alignItems: 'center', width: '100%', maxWidth: 300,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 24, elevation: 10,
  },
  iconCircle: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  iconText: { fontSize: 24, fontWeight: '700' },
  title: { color: Colors.text, fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  msg:   { color: Colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  btn:   { width: '100%', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
