import React from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';

type LabelProps = {
  children: React.ReactNode;
  required?: boolean;
  style?: TextStyle;
};

export const Label = ({ children, required, style }: LabelProps) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, style]}>
        {children}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  required: {
    color: 'red',
  },
});
