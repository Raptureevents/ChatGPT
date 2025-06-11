import React, { useEffect, useState } from 'react';
import { View, Dimensions, ScrollView } from 'react-native';
import { Button, Surface } from 'react-native-paper';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';

export default function DashboardScreen({ navigation, route }) {
  const { userId, role } = route.params;
  const [stats, setStats] = useState({ done: 0, pending: 0 });

  useEffect(() => {
    const load = async () => {
      const res = await axios.get('http://localhost:3001/api/tasks', { params: { assigneeId: userId } });
      const done = res.data.filter((t) => t.done).length;
      const pending = res.data.length - done;
      setStats({ done, pending });
    };
    load();
  }, []);
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Surface style={{ padding: 10, marginBottom: 20 }}>
        <BarChart
          data={{
            labels: ['Done', 'Pending'],
            datasets: [{ data: [stats.done, stats.pending] }],
          }}
          width={Dimensions.get('window').width - 60}
          height={160}
          fromZero
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: () => '#6200ee',
          }}
        />
      </Surface>
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
    </ScrollView>
  );
}
