import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Kid } from '../../types/Kid';

interface SelectableKidCardProps {
  kid: Kid;
  isSelected: boolean;
  onSelect: (kidId: string) => void;
}

const SelectableKidCard: React.FC<SelectableKidCardProps> = ({
  kid,
  isSelected,
  onSelect,
}) => {
  const hasPhoto = !!kid.photoUri;

  return (
    <Pressable
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Select kid ${kid.name}`}
      onPress={() => onSelect(kid.id)}
      style={({ pressed }) => [
        styles.kidCard,
        isSelected && styles.kidCardSelected,
        pressed && { opacity: 0.6 },
      ]}
    >
      {hasPhoto ? (
        <Image source={{ uri: kid.photoUri }} style={styles.kidPhoto} />
      ) : (
        <View style={styles.kidIconContainer}>
          <Icon name="account" size={40} color="#888" />
        </View>
      )}
      <Text style={styles.kidName} numberOfLines={1} ellipsizeMode="tail">
        {kid.name}
      </Text>

      {isSelected && (
        <View style={styles.selectedOverlay}>
          <Icon name="check-circle" size={24} color="#6200ee" />
        </View>
      )}
    </Pressable>
  );
};

export default SelectableKidCard;

const styles = StyleSheet.create({
  kidCard: {
    width: 100,
    height: 132,
    margin: 6,
    borderRadius: 8,
    backgroundColor: '#bdda79ff',
    alignItems: 'center',
    paddingVertical: 6,
    position: 'relative',
  },
  kidCardSelected: {
    borderWidth: 2,
    borderColor: '#6200ee',
    backgroundColor: '#e8def8',
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
    shadowColor: '#6200ee',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
  },
  kidPhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  kidIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  kidName: {
    marginTop: 4,
    fontWeight: '600',
    fontSize: 14,
    maxWidth: 88,
    textAlign: 'center',
    color: '#333',
  },
});
