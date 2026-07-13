import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';

export function ProfileQrIcon({ srCode, initials }: { srCode: string; initials: string }) {
  return (
    <View style={styles.qrPlaceholderIconWrap}>
      <View style={styles.qrIcon}>
        <Text style={styles.qrIconText}>⌁</Text>
      </View>
      <Text style={styles.qrPlaceholderSub}>{srCode}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  qrPlaceholderIconWrap: {
    width: 120,
    height: 120,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  qrIcon: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrIconText: {
    color: Colors.accent,
    fontSize: 34,
    fontWeight: '900',
    lineHeight: 34,
  },
  qrPlaceholderSub: {
    fontSize: 8,
    color: Colors.muted,
    marginTop: 2,
  },
});

