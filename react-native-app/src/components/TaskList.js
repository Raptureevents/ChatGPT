import React from 'react';
import { FlatList } from 'react-native';
import { List } from 'react-native-paper';

export default function TaskList({ tasks }) {
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <List.Item title={item.description} />}
    />
  );
}
