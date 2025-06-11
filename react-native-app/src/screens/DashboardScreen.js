import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

export default function DashboardScreen({ navigation, route }) {
  const { userId, role } = route.params;
  return (
    <View style={{ padding: 20 }}>
      <Button mode="contained" onPress={() => navigation.navigate('Tasks', { userId, role })} style={{ marginBottom: 10 }}>
        Tasks
      </Button>
      {(role === 'admin' || role === 'master') && (
        <>
          <Button mode="contained" onPress={() => navigation.navigate('Projects', { userId })} style={{ marginBottom: 10 }}>
            Projects
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate('Events', { userId })} style={{ marginBottom: 10 }}>
            Events
          </Button>
          <Button mode="contained" onPress={() => navigation.navigate('Expenses', { userId })} style={{ marginBottom: 10 }}>
            Expenses
          </Button>
        </>
      )}
      <Button mode="contained" onPress={() => navigation.navigate('Notifications', { userId })}>
        Notifications
      </Button>
      </View>
  );
}
