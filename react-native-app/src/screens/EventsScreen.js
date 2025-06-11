import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import ItemList from '../components/ItemList';
import axios from 'axios';

export default function EventsScreen({ route }) {
  const { userId } = route.params;
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');

  const loadEvents = async () => {
    const res = await axios.get('http://localhost:3001/api/events', { params: { userId } });
    setEvents(res.data);
  };

  const addEvent = async () => {
    await axios.post('http://localhost:3001/api/events', { userId, name });
    setName('');
    loadEvents();
  };

  const deleteEvent = async (item) => {
    await axios.delete(`http://localhost:3001/api/events/${item.id}`);
    loadEvents();
  };

  useEffect(() => {
    loadEvents();
    const es = new EventSource('http://localhost:3001/api/stream');
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'events') loadEvents();
    };
    return () => es.close();

  }, []);

  return (
    <View style={{ padding: 20 }}>
      <TextInput label="Event name" value={name} onChangeText={setName} />
      <Button onPress={addEvent} mode="contained" style={{ marginTop: 10 }}>
        Add
      </Button>
      <ItemList items={events} onLongPressItem={deleteEvent} />

    </View>
  );
}
