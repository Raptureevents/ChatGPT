import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import axios from 'axios';

export default function NotificationsScreen({ route }) {
  const { userId } = route.params;
  const [notes, setNotes] = useState([]);

  const load = async () => {
    const res = await axios.get('http://localhost:3001/api/notifications', { params: { userId } });
    setNotes(res.data);
  };

  useEffect(() => {
    load();
    const es = new EventSource('http://localhost:3001/api/stream');
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'notifications') load();
    };
    return () => es.close();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      {notes.map((n) => (
        <List.Item key={n.id} title={n.message} description={new Date(n.created_at).toLocaleString()} />
      ))}
    </View>
  );
}
