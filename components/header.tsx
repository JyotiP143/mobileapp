import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  buttonText: string;
  onButtonPress: () => void;
  rightButtonText?: string;
  onRightButtonPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  icon,
  buttonText,
  onButtonPress,
  rightButtonText,
  onRightButtonPress,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="#fff" />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.buttonContainer}>
        {rightButtonText && onRightButtonPress && (
          <TouchableOpacity style={styles.secondaryButton} onPress={onRightButtonPress}>
            <Ionicons name="grid-outline" size={16} color="#fff" />
            <Text style={styles.secondaryButtonText}>{rightButtonText}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.primaryButton} onPress={onButtonPress}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={styles.primaryButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#2a2a2a',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#4285f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285f4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#404040',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});