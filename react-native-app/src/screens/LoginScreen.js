import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    try {
      const res = await axios.post('http://localhost:3001/api/login', { username, password });
      navigation.replace('Tasks', { userId: res.data.userId });
    } catch (e) {
      setError('Login failed');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput label="Username" value={username} onChangeText={setUsername} />
      <TextInput label="Password" value={password} secureTextEntry onChangeText={setPassword} style={{ marginTop: 10 }} />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button mode="contained" onPress={login} style={{ marginTop: 20 }}>
        Login
      </Button>
    </View>
  );
}
