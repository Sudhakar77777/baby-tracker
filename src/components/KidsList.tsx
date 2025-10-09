import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Kid } from '../types/Kid';
import { List, IconButton, Divider } from 'react-native-paper';
import { Image, Text } from 'react-native';
import dayjs from 'dayjs';

interface KidsListProps {
  kids: Kid[];
  loading: boolean;
  onEdit: (kid: Kid) => void;
  onDelete: (id: string) => void;
}

export default function KidsList({
  kids,
  loading,
  onEdit,
  onDelete,
}: KidsListProps) {
  if (!kids.length && !loading) {
    return <Text style={styles.emptyText}>No kids added yet.</Text>;
  }

  return (
    <FlatList
      data={kids}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <List.Item
          title={`${index + 1}. ${item.name} — ${dayjs(item.birthdate).format(
            'MMM D, YYYY'
          )}`}
          description={item.gender ? capitalize(item.gender) : undefined}
          left={(props) =>
            item.photoUri ? (
              <Image source={{ uri: item.photoUri }} style={styles.kidPhoto} />
            ) : (
              <List.Icon
                {...props}
                icon={
                  item.gender === 'boy'
                    ? 'baby-bottle-outline'
                    : item.gender === 'girl'
                    ? 'baby-carriage'
                    : 'baby-face-outline'
                }
              />
            )
          }
          right={(props) => (
            <View style={styles.actions}>
              <IconButton
                {...props}
                icon="pencil"
                onPress={() => onEdit(item)}
              />
              <IconButton
                {...props}
                icon="delete"
                onPress={() => onDelete(item.id)}
              />
            </View>
          )}
        />
      )}
      ItemSeparatorComponent={() => <Divider />}
    />
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const styles = StyleSheet.create({
  kidPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});
