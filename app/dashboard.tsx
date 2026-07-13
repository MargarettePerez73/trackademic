import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Text, View } from 'react-native';
import api from '../api/axiosConfig';



export default function Dashboard() {
  const [users, setUsers] = useState<Array<{ id: number; name: string; email: string; created_at: string }>>(
    [],
  );

  const router = useRouter();

  const fetchUsers = async () => {

    try {
      const response = await api.get('/api/users');
      setUsers(response.data);
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.error || 'Could not load data');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <View style={{ padding: 35 }}>
      <Button
        title="Logout"
        onPress={() => {
          Alert.alert('Logout', 'You have been logged out');
          // Navigate back to login
          // Using replace prevents going back to dashboard via back button.
          router.replace('/auth/login');

        }}
      />

      <FlatList
        style={{ marginTop: 16 }}
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, borderColor: '#ddd', marginBottom: 10 }}>
            <Text>ID: {item.id}</Text>
            <Text>Name: {item.name}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Created: {item.created_at}</Text>
          </View>
        )}
      />
    </View>
  );
}

