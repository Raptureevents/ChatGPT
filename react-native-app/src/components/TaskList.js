import React from 'react';
import ItemList from './ItemList';

export default function TaskList({ tasks }) {
  return <ItemList items={tasks} />;
}
