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

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <TextInput label="Expense" value={name} onChangeText={setName} />
      <Button onPress={addExpense} mode="contained" style={{ marginTop: 10 }}>
        Add
      </Button>
      <ItemList items={expenses} />
    </View>
  );
}
