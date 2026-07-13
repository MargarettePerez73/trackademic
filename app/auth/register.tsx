import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Button, TextInput, View } from 'react-native';
import api from '../../api/axiosConfig';
import { authStyles } from './_styles';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        try {
            const response = await api.post('/api/register', { name, email, password });
            Alert.alert('Success', response.data.message);
            router.push('/auth/login');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <View style={authStyles.screen}>
            <View style={authStyles.card}>
                <TextInput
                    style={authStyles.input}
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                />
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
                        <Button title="Register" color="green" onPress={handleRegister} />
                    </View>
                    <View style={authStyles.button}>
                        <Button title="Login" onPress={() => router.push('/auth/login')} />
                    </View>
                </View>
            </View>
        </View>
    );
}