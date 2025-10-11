import React from 'react';
import { FlatList, View, StyleSheet, Image, Text } from 'react-native';
import { Kid } from '../../types/Kid';
import { List, IconButton, Divider } from 'react-native-paper';
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
      renderItem={({ item, index }) => {
        let genderStyle = styles.cardOther;
        if (item.gender === 'boy') genderStyle = styles.cardBoy;
        else if (item.gender === 'girl') genderStyle = styles.cardGirl;

        return (
          <View style={[styles.card, genderStyle]}>
            <List.Item
              title={`${item.name} — ${dayjs(item.birthdate).format(
                'MMM D, YYYY'
              )}`}
              description={item.gender ? capitalize(item.gender) : undefined}
              left={(props) =>
                item.photoUri ? (
                  <Image
                    source={{ uri: item.photoUri }}
                    style={styles.kidPhoto}
                  />
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
                    style={{ marginLeft: 2 }} // reduce margin left for icon if no photo
                  />
                )
              }
              right={(props) => (
                <View style={styles.actions}>
                  <IconButton
                    {...props}
                    icon="pencil"
                    onPress={() => onEdit(item)}
                    style={styles.actionIcon}
                  />
                  <IconButton
                    {...props}
                    icon="delete"
                    onPress={() => onDelete(item.id)}
                    style={styles.actionIcon}
                  />
                </View>
              )}
            />
          </View>
        );
      }}
      ItemSeparatorComponent={() => <Divider />}
    />
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 6,
    marginHorizontal: 12,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  cardBoy: {
    backgroundColor: '#DCEEFB', // baby blue
  },
  cardGirl: {
    backgroundColor: '#FDEDEC', // baby pink
  },
  cardOther: {
    backgroundColor: '#E6E6FA', // lavender
  },
  kidPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 4,
    marginRight: 8,
    marginVertical: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 80,
    paddingRight: 4,
  },
  actionIcon: {
    marginHorizontal: 0,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});
