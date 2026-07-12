import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function DrawerLayout() {
    return (
        <Drawer
  screenOptions={{
    headerTitleAlign: "center",
    headerTitle: "Trackademic",

    headerTitleStyle: {
      fontWeight: "bold",
    },

    headerRight: () => (
      <TouchableOpacity style={{ marginRight: 15 }}>
        <Ionicons
          name="ellipsis-horizontal-outline"
          size={20}
          color="black"
        />
      </TouchableOpacity>
    ),

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
                    drawerLabel: "Home"
                }}
            />
            <Drawer.Screen
                name='class'
                options={{
                    drawerLabel: "Class"
                }}
            />
            <Drawer.Screen
                name='performance'
                options={{
                    drawerLabel: "My Performance"
                }}
            />
        </Drawer>
    );
}

const styles = StyleSheet.create({})