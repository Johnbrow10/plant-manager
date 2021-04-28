import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

// interface ButtonProps extends TouchableOpacityProps {
//   title: string;
// }

export function Button() {
  return (
    <TouchableOpacity style={styles.container}>
      <Text style={styles.text} >
        Confirmar
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 48,
    height: 56,
  },
  text: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fonts.heading,
  },
  buttonText: {
    color: colors.white,
    fontSize: 24,
    paddingBottom: 7
  }
})