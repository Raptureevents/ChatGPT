import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import TaskList from '../components/TaskList';
import axios from 'axios';

export default function TaskScreen({ route }) {

  const { userId, role } = route.params;
  const [tasks, setTasks] = useState([]);
  const [desc, setDesc] = useState('');

  const [assignee, setAssignee] = useState('');
  const [comment, setComment] = useState('');

  const loadTasks = async () => {
    const res = await axios.get('http://localhost:3001/api/tasks', { params: { assigneeId: userId } });

    setTasks(res.data);
  };

  const addTask = async () => {

    const body = { userId, description: desc, assigneeId: role === 'user' ? userId : Number(assignee) || userId, comments: role === 'user' ? '' : comment };
    await axios.post('http://localhost:3001/api/tasks', body);
    setDesc('');
    setAssignee('');
    setComment('');
    loadTasks();
  };

  const toggleTask = async (task) => {
    await axios.put(`http://localhost:3001/api/tasks/${task.id}`, {
      description: task.description,
      assigneeId: task.assignee_id,
      comments: task.comments,
      reviewed: task.reviewed,
      approved: task.approved,

      done: !task.done,
    });
    loadTasks();
  };

  const deleteTask = async (task) => {
    await axios.delete(`http://localhost:3001/api/tasks/${task.id}`);
    loadTasks();
  };

  useEffect(() => {
    loadTasks();
    const es = new EventSource('http://localhost:3001/api/stream');
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'tasks') loadTasks();
    };
    return () => es.close();

  }, []);

  return (
    <View style={{ padding: 20 }}>
      <TextInput label="Task description" value={desc} onChangeText={setDesc} />
      {role !== 'user' && (
        <>
          <TextInput label="Assign to user id" value={assignee} onChangeText={setAssignee} style={{ marginTop: 10 }} />
          <TextInput label="Comment" value={comment} onChangeText={setComment} style={{ marginTop: 10 }} />
        </>
      )}
      <Button onPress={addTask} mode="contained" style={{ marginTop: 10 }}>
        Add
      </Button>
      <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />

    </View>
  );
}
