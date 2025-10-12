import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ActivityType } from '../../types/Activity';

interface SelectableActivityCardProps {
  type: ActivityType;
  isSelected: boolean;
  disabled: boolean;
  onSelect: (type: ActivityType) => void;
}

const ACTIVITY_ICONS: Record<ActivityType, string> = {
  feeding: 'baby-bottle',
  sleep: 'bed',
  diaper: 'baby',
  bath: 'bathtub',
  medication: 'pill',
  note: 'note-text',
  milestone: 'star',
};

const SelectableActivityCard: React.FC<SelectableActivityCardProps> = ({
  type,
  isSelected,
  disabled,
  onSelect,
}) => {
  return (
    <Pressable
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${
        disabled ? 'Disabled: ' : ''
      }Select activity type ${type}`}
      accessibilityState={{ disabled, selected: isSelected }}
      onPress={() => !disabled && onSelect(type)}
      style={({ pressed }) => [
        styles.activityTypeCard,
        isSelected && styles.activityTypeCardSelected,
        disabled && styles.disabledCard,
        pressed && !disabled && { opacity: 0.6 },
      ]}
      disabled={disabled}
    >
      <View style={styles.activityIconWrapper}>
        <Icon
          name={ACTIVITY_ICONS[type]}
          size={50}
          color={disabled ? '#aaa' : '#6200ee'}
        />
      </View>
      <Text style={[styles.activityTypeText, disabled && { color: '#aaa' }]}>
        {type.toUpperCase()}
      </Text>

      {isSelected && (
        <View style={styles.selectedOverlay}>
          <Icon name="check-circle" size={24} color="#6200ee" />
        </View>
      )}
    </Pressable>
  );
};

export default SelectableActivityCard;

const styles = StyleSheet.create({
  activityTypeCard: {
    width: 70,
    height: 70,
    margin: 6,
    borderRadius: 8,
    backgroundColor: '#bdda79ff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  activityTypeCardSelected: {
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  disabledCard: {
    backgroundColor: '#ddd',
  },
  activityIconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  activityTypeText: {
    marginTop: 0,
    marginBottom: 2,
    fontWeight: '800',
    fontSize: 10,
    color: '#6200ee',
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
});
