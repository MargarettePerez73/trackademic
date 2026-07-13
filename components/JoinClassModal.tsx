import React, { useState } from 'react';
import {
  KeyboardAvoidingView, Modal, Platform, Pressable,
  StyleSheet, Text, TextInput, View,
} from 'react-native';
import { Colors } from '../constants/Colors';

interface Props {
  visible: boolean;
  onClose: () => void;
  onJoin: (code: string) => void;
}

export function JoinClassModal({ visible, onClose, onJoin }: Props) {
  const [code, setCode] = useState('');

  const handleJoin = () => { onJoin(code.trim()); setCode(''); };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.backdrop}
      >
        <View style={styles.box}>
          <Text style={styles.title}>Join your respective class!</Text>
          <Text style={styles.label}>Class Code</Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Enter Class Code"
            placeholderTextColor="#b0bec5"
            style={styles.input}
            autoCapitalize="none"
          />
          <View style={styles.actions}>
            <Pressable style={[styles.btn, styles.btnClose]} onPress={onClose}>
              <Text style={styles.btnCloseText}>Close</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnJoin]} onPress={handleJoin}>
              <Text style={styles.btnJoinText}>Join</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  box: {
    backgroundColor: '#fff', borderRadius: 12, width: '100%', maxWidth: 340,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 24, elevation: 10,
  },
  title:  { fontSize: 15, fontWeight: '700', color: Colors.text, padding: 20, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  label:  { fontSize: 11, fontWeight: '700', color: Colors.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginHorizontal: 20, marginTop: 16, marginBottom: 8 },
  input: {
    marginHorizontal: 20, borderWidth: 1, borderColor: '#d0d0d0',
    borderRadius: 6, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 14, color: Colors.text,
  },
  actions:     { flexDirection: 'row', justifyContent: 'flex-end', gap: 10, padding: 20 },
  btn:         { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 6 },
  btnClose:    { backgroundColor: '#5d6d7e' },
  btnJoin:     { backgroundColor: Colors.accent },
  btnCloseText:{ color: '#fff', fontWeight: '600', fontSize: 13 },
  btnJoinText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});
