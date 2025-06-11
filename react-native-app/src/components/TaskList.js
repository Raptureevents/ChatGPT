import React from 'react';

import ItemList from './ItemList';

export default function TaskList({ tasks, onToggle, onDelete }) {
  const items = tasks.map((t) => ({
    ...t,
    name: t.description + (t.done ? ' [DONE]' : ''),
  }));
  return (
    <ItemList
      items={items}
      onPressItem={onToggle}
      onLongPressItem={onDelete}
    />
  );

}
