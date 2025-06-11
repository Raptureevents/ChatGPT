import React from 'react';
import { FlatList } from 'react-native';
import { List } from 'react-native-paper';

export default function ItemList({ items }) {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <List.Item title={item.name || item.description} />}
    />
  );
}
