import React from 'react';
import { Image, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface AvatarProps {
  uri?: string;           // Image URL
  fallback?: string;      // Fallback initials or text
  size?: number;          // Diameter of avatar
  style?: StyleProp<ViewStyle>; // Optional custom styling
}

const Avatar: React.FC<AvatarProps> = ({
  uri,
  fallback = '?',
  size = 40,
  style,
}) => {
  const avatarSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View style={[styles.container, avatarSize, style]}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, avatarSize]}
        />
      ) : (
        <Text style={[styles.fallbackText, { fontSize: size / 2.5 }]}>
          {fallback}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  fallbackText: {
    color: '#555',
    fontWeight: 'bold',
  },
});

export default Avatar;
