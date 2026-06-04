import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';

// TODO: Replace with full navigation setup once packages are installed
// See src/navigation/index.tsx for the navigation structure

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#161210" />
      <Text style={styles.brand}>BookAirportRide</Text>
      <Text style={styles.tagline}>Luxury Airport Transfers</Text>
      <Text style={styles.placeholder}>Mobile app coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161210',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  brand: {
    fontFamily: 'serif',
    fontSize: 28,
    fontWeight: '600',
    color: '#fdfcfa',
    letterSpacing: 1,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '300',
    color: '#c4623a',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 32,
  },
  placeholder: {
    fontSize: 14,
    color: '#fdfcfa',
    opacity: 0.4,
    letterSpacing: 0.5,
  },
});
