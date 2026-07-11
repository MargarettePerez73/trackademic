import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout(){
    return(
        <Drawer>
            <Drawer.Screen
                name='home'
                options={{
                    title: "Home",
                }}
            />
            <Drawer.Screen
                name='class'
                options={{
                    title: "Class",
                }}
            />
            <Drawer.Screen
                name='performance'
                options={{
                    title: "My Performance",
                }}
            />
        </Drawer>
    );
}

const styles = StyleSheet.create({})