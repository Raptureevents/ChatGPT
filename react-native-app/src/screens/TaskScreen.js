import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import TaskList from '../components/TaskList';
import axios from 'axios';

export default function TaskScreen({ route }) {
  const { userId } = route.params;
  const [tasks, setTasks] = useState([]);
  const [desc, setDesc] = useState('');

  const loadTasks = async () => {
    const res = await axios.get('http://localhost:3001/api/tasks', { params: { userId } });
    setTasks(res.data);
  };

  const addTask = async () => {
    await axios.post('http://localhost:3001/api/tasks', { userId, description: desc });
    setDesc('');
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <TextInput label="Task description" value={desc} onChangeText={setDesc} />
      <Button onPress={addTask} mode="contained" style={{ marginTop: 10 }}>
        Add
      </Button>
      <TaskList tasks={tasks} />
    </View>
  );
}
