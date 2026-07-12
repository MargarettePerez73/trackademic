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