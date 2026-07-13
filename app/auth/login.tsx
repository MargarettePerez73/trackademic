import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, TextInput, View } from 'react-native';
import api from '../../api/axiosConfig';
import { authStyles } from './_styles';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await api.post('/api/login', { email, password });
            Alert.alert('Success', response.data.message);
            router.replace('/dashboard'); // Directs to data page
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Login failed');
        }
    };

    return (
        <View style={authStyles.screen}>
            <View style={authStyles.card}>
                <TextInput
                    style={authStyles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={authStyles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <View style={authStyles.buttonsRow}>
                    <View style={authStyles.button}>
                        <Button title="Login" color="blue" onPress={handleLogin} />
                    </View>
                    <View style={authStyles.button}>
                        <Button title="Register" onPress={() => router.push('/auth/register')} />
                    </View>
                </View>
            </View>
        </View>
    );
}