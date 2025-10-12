import React from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import { Activity } from '../../types/Activity';
import { AppContext } from '../../context/AppContext';
import { getFallbackIconForKid } from '../../utils/kidUtils';

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
}

const iconMap: Record<string, string> = {
  feeding: 'baby-bottle',
  sleep: 'bed',
  diaper: 'baby',
  bath: 'bathtub',
  medication: 'pill',
  note: 'note-text',
  milestone: 'star',
};

function getDetailsSummary(item: Activity): string {
  const { type, details } = item;

  switch (type) {
    case 'note':
      return `${details.content || ''}`;
    case 'feeding':
      return `${details.method}${
        details.amount ? `, ${details.amount}ml` : ''
      }`;
    case 'sleep':
      const durationMins = details.duration
        ? Math.round(details.duration / 60000)
        : 0;
      return `Duration: ${durationMins} min`;
    case 'diaper':
      const wet = details.wet ? 'Wet' : '';
      const dirty = details.dirty ? 'Dirty' : '';
      return [wet, dirty].filter(Boolean).join(', ') || 'Dry';
    case 'medication':
      return `${details.name} - ${details.dose}`;
    case 'bath':
      return 'Bath given';
    case 'milestone':
      return `${details.event || ''}`;
    default:
      return '';
  }
}

function ActivityList(props: ActivityListProps) {
  const { activities, onEdit, onDelete } = props;
  const { kids } = React.useContext(AppContext)!;

  if (activities.length === 0) {
    return <Text style={styles.empty}>No activities found.</Text>;
  }

  function renderItem({ item }: { item: Activity }) {
    const kid = kids.find((k) => k.id === item.kidId);

    return (
      <View style={styles.itemContainer}>
        <View style={styles.left}>
          {kid?.photoUri ? (
            <Image source={{ uri: kid.photoUri }} style={styles.kidPhoto} />
          ) : (
            <Icon
              name={getFallbackIconForKid(kid?.id || '')}
              size={28}
              color="#888"
              style={styles.kidPhoto}
            />
          )}
          <Icon
            name={iconMap[item.type]}
            size={36}
            color="#6200ee"
            style={styles.icon}
          />

          <View style={styles.textContainer}>
            <Text style={styles.type}>{item.type}</Text>
            {/* <Text style={styles.kidId}>Kid ID: {item.kidId}</Text> */}
            <Text style={styles.timestamp}>
              {dayjs(item.timestamp).format('MMM D, h:mm A')}
            </Text>
            {/* <Text style={styles.timestampSmall}>
              Created: {dayjs(item.createdAt).format('MMM D, h:mm A')}
            </Text>
            <Text style={styles.timestampSmall}>
              Updated: {dayjs(item.updatedAt).format('MMM D, h:mm A')}
            </Text> */}
            <Text style={styles.details}>{getDetailsSummary(item)}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(item)}>
            <Icon name="pencil" size={22} color="#6200ee" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            style={{ marginLeft: 12 }}
          >
            <Icon name="delete" size={22} color="#b00020" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

export default ActivityList;

const styles = StyleSheet.create({
  empty: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  list: {
    paddingBottom: 50,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'flex-start',
  },
  left: {
    flexDirection: 'row',
    flex: 1,
  },
  icon: {
    marginRight: 8,
    marginTop: 6,
  },
  kidPhoto: {
    width: 32,
    height: 32,
    borderRadius: 14,
    marginRight: 8,
    marginTop: 8,
    backgroundColor: '#eee',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  textContainer: {
    flex: 1,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'capitalize',
    color: '#333',
  },
  kidId: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 13,
    color: '#555',
  },
  timestampSmall: {
    fontSize: 12,
    color: '#999',
  },
  details: {
    fontSize: 14,
    color: '#444',
    marginTop: 6,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 6,
  },
});
