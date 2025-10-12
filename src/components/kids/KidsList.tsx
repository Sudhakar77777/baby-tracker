import React from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Image,
  Text,
  Platform,
} from 'react-native';
import { Kid } from '../../types/Kid';
import { List, IconButton, Divider } from 'react-native-paper';
import dayjs from 'dayjs';

interface KidsListProps {
  kids: Kid[];
  loading: boolean;
  onEdit: (kid: Kid) => void;
  onDelete: (id: string) => void;
}

const KidsList = ({ kids, loading, onEdit, onDelete }: KidsListProps) => {
  if (!kids.length && !loading) {
    return <Text style={styles.emptyText}>No kids added yet.</Text>;
  }

  const renderItem = ({ item }: { item: Kid }) => {
    return <KidCard kid={item} onEdit={onEdit} onDelete={onDelete} />;
  };

  return (
    <FlatList
      data={kids}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <Divider />}
      initialNumToRender={5}
      windowSize={5}
      maxToRenderPerBatch={5}
      removeClippedSubviews={true}
    />
  );
};

export default React.memo(KidsList);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface KidCardProps {
  kid: Kid;
  onEdit: (kid: Kid) => void;
  onDelete: (id: string) => void;
}

const KidCard = React.memo(({ kid, onEdit, onDelete }: KidCardProps) => {
  let genderStyle = styles.cardOther;
  if (kid.gender === 'boy') genderStyle = styles.cardBoy;
  else if (kid.gender === 'girl') genderStyle = styles.cardGirl;

  return (
    <View style={[styles.card, genderStyle]}>
      <List.Item
        title={kid.name}
        description={`${dayjs(kid.birthdate).format('MMM D, YYYY')}${
          kid.gender ? `  ${capitalize(kid.gender)}` : ''
        }`}
        left={(props) =>
          kid.photoUri ? (
            <Image source={{ uri: kid.photoUri }} style={styles.kidPhoto} />
          ) : (
            <List.Icon
              {...props}
              icon={
                kid.gender === 'boy'
                  ? 'baby-bottle-outline'
                  : kid.gender === 'girl'
                  ? 'baby-carriage'
                  : 'baby-face-outline'
              }
              style={{ marginLeft: 2 }}
            />
          )
        }
        right={(props) => (
          <View style={styles.actions}>
            <IconButton
              {...props}
              icon="pencil"
              onPress={() => onEdit(kid)}
              style={styles.actionIcon}
            />
            <IconButton
              {...props}
              icon="delete"
              onPress={() => onDelete(kid.id)}
              style={styles.actionIcon}
            />
          </View>
        )}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 8,
    marginVertical: 6,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
    }),
  },
  cardBoy: {
    backgroundColor: '#DCEEFB',
  },
  cardGirl: {
    backgroundColor: '#FDEDEC',
  },
  cardOther: {
    backgroundColor: '#E6E6FA',
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
    paddingRight: 0,
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
