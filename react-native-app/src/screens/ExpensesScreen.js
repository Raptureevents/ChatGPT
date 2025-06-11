import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import ItemList from '../components/ItemList';
import axios from 'axios';

export default function ExpensesScreen({ route }) {
  const { userId } = route.params;
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState('');

  const loadExpenses = async () => {
    const res = await axios.get('http://localhost:3001/api/expenses', { params: { userId } });
    setExpenses(res.data);
  };

  const addExpense = async () => {
    await axios.post('http://localhost:3001/api/expenses', { userId, name });
    setName('');
    loadExpenses();
  };


  const deleteExpense = async (item) => {
    await axios.delete(`http://localhost:3001/api/expenses/${item.id}`);
    loadExpenses();
  };

  useEffect(() => {
    loadExpenses();
    const es = new EventSource('http://localhost:3001/api/stream');
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'expenses') loadExpenses();
    };
    return () => es.close();

  }, []);

  return (
    <View style={{ padding: 20 }}>
      <TextInput label="Expense" value={name} onChangeText={setName} />
      <Button onPress={addExpense} mode="contained" style={{ marginTop: 10 }}>
        Add
      </Button>

      <ItemList items={expenses} onLongPressItem={deleteExpense} />

    </View>
  );
}
