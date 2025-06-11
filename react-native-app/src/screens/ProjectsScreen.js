import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import ItemList from '../components/ItemList';
import axios from 'axios';

export default function ProjectsScreen({ route }) {
  const { userId } = route.params;
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');

  const loadProjects = async () => {
    const res = await axios.get('http://localhost:3001/api/projects', { params: { userId } });
    setProjects(res.data);
  };

  const addProject = async () => {
    await axios.post('http://localhost:3001/api/projects', { userId, name });
    setName('');
    loadProjects();
  };

  const deleteProject = async (item) => {
    await axios.delete(`http://localhost:3001/api/projects/${item.id}`);
    loadProjects();
  };

  useEffect(() => {
    loadProjects();
    const es = new EventSource('http://localhost:3001/api/stream');
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'projects') loadProjects();
    };
    return () => es.close();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <TextInput label="Project name" value={name} onChangeText={setName} />
      <Button onPress={addProject} mode="contained" style={{ marginTop: 10 }}>
        Add
      </Button>
      <ItemList items={projects} onLongPressItem={deleteProject} />
    </View>
  );
}
