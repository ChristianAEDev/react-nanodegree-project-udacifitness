import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function TextButton({ children, onPresse }) {
  return (
    <TouchableOpacity onPress={onPresse}>
      <Text>{children}</Text>
    </TouchableOpacity>
  )
}