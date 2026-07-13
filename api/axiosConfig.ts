import axios from 'axios';
import { Alert, Platform } from 'react-native';

const myIP = '10.80.67.25';            
const host = Platform.OS === 'web' ? 'localhost' : myIP; 

const baseURL = `http://${host}/track-assignment/api.php`;

const api = axios.create({
  baseURL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      Alert.alert(
        'Network Error',
        "Can't connect to the server. Please check your network or ensure the server is running.",
      );
    }
    return Promise.reject(error);
  },
);

export default api;
