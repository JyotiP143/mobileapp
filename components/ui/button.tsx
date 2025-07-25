import React from 'react';
import {
    GestureResponderEvent,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

// Define variant and size types
type Variant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type Size = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  style,
  textStyle,
}) => {
  const containerStyles = [
    styles.base,
    variants[variant],
    sizes[size],
    disabled && styles.disabled,
    style,
  ];

  const labelStyles = [
    styles.label,
    textVariants[variant],
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={containerStyles}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={labelStyles}>{children}</Text>
    </TouchableOpacity>
  );
};

// Base styles
const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

// Variant background styles
const variants: Record<Variant, ViewStyle> = {
  default: {
    backgroundColor: '#007bff',
  },
  destructive: {
    backgroundColor: '#dc3545',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  secondary: {
    backgroundColor: '#6c757d',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
  },
};

// Text colors per variant
const textVariants: Record<Variant, TextStyle> = {
  default: {
    color: '#ffffff',
  },
  destructive: {
    color: '#ffffff',
  },
  outline: {
    color: '#333333',
  },
  secondary: {
    color: '#ffffff',
  },
  ghost: {
    color: '#333333',
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
};

// Size padding
const sizes: Record<Size, ViewStyle> = {
  default: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  icon: {
    width: 48,
    height: 48,
  },
};

export default Button;
