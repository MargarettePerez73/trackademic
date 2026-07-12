import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet } from 'react-native';
import DropdownMenu from '../components/DropdownMenu';

export default function DrawerLayout() {
    return (
        <Drawer
  screenOptions={{
    headerTitleAlign: "center",
    headerTitle: "Trackademic",

    headerTitleStyle: {
      fontWeight: "bold",
    },

    headerRight: () => <DropdownMenu/>,

    headerTitleContainerStyle: {
      left: 0,
      right: 0,
      alignItems: "center",
    },
  }}
>
            <Drawer.Screen
                name='home'
                options={{
                    drawerLabel: "Home",
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={20} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name='class'
                options={{
                    drawerLabel: "Class",
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="list-outline" size={20} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name='performance'
                options={{
                    drawerLabel: "My Performance",
                    drawerIcon: ({ color, size }) => (
                        <Ionicons name="share-social-outline" size={20} color={color} />
                    ),
                }}
            />
        </Drawer>
    );
}

const styles = StyleSheet.create({})