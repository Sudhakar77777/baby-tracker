import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { getAllActivities } from '../../storage/activities';
import { Activity } from '../../types/Activity';
import dayjs from 'dayjs';

interface ActivityListProps {
  kidId?: string;
  onSelectActivity?: (activity: Activity) => void;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  kidId,
  onSelectActivity,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      setLoading(true);
      try {
        const allActivities = await getAllActivities();
        // Filter by kidId if provided
        const filtered = kidId
          ? allActivities.filter((a) => a.kidId === kidId)
          : allActivities;
        // Sort descending by timestamp
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        setActivities(filtered);
      } catch (error) {
        console.error('Error loading activities', error);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, [kidId]);

  if (loading) {
    return <Text style={styles.loading}>Loading activities...</Text>;
  }

  if (activities.length === 0) {
    return <Text style={styles.empty}>No activities found.</Text>;
  }

  const renderItem = ({ item }: { item: Activity }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => onSelectActivity?.(item)}
      >
        <View style={styles.iconPlaceholder}>
          {/* You can replace this with an icon based on item.type */}
          <Text style={styles.iconText}>
            {item.type.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.typeText}>{item.type}</Text>
          <Text style={styles.timeText}>
            {dayjs(item.timestamp).format('MMM D, h:mm A')}
          </Text>
          {/* Optionally show summary/details */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={activities}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      style={styles.list}
      contentContainerStyle={{ paddingBottom: 50 }}
    />
  );
};

const styles = StyleSheet.create({
  loading: { textAlign: 'center', marginTop: 20, fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#666' },
  list: { flex: 1 },
  itemContainer: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF8800',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  infoContainer: { flex: 1 },
  typeText: { fontWeight: '600', fontSize: 16, textTransform: 'capitalize' },
  timeText: { color: '#666', fontSize: 14, marginTop: 2 },
});
