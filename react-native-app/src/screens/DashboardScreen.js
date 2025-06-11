import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

export default function DashboardScreen({ navigation, route }) {
  const { userId } = route.params;
  return (
    <View style={{ padding: 20 }}>
      <Button mode="contained" onPress={() => navigation.navigate('Tasks', { userId })} style={{ marginBottom: 10 }}>
        Tasks
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Projects', { userId })} style={{ marginBottom: 10 }}>
        Projects
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Events', { userId })} style={{ marginBottom: 10 }}>
        Events
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Expenses', { userId })}>
        Expenses
      </Button>
    </View>
  );
}
