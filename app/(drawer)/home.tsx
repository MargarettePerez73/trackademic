import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
    type ItemData = {
        id: string;
        title: string;
    };
    const DATA: ItemData[] = [
        {
            id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            title: 'First Item',
        },
        {
            id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            title: 'Second Item',
        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d72',
            title: 'Third Item',
        },
    ];

    return (
        <View style={{ flex: 1, alignItems: 'center', padding: 20 }}>
            <View style={{ borderWidth: 0.5, borderColor: 'gray', padding: 20, borderRadius: 10, marginTop: 20, flexDirection: 'row', alignItems: 'center', width: '85%', backgroundColor: "white", elevation: 10, shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}>
                <View style={{ marginRight: 15 }} >
                    <Ionicons name="person-circle-outline" size={75} color="black" />
                </View>
                <View style={{ flexShrink: 1 }}>
                    <Text style={{ textOverflow: 'ellipsis', fontWeight: 'bold', fontSize: 25 }}>
                        Welcome back, Margarette Perez!
                    </Text>
                    <Text style={{ fontWeight: 'light', color: 'gray', fontSize: 15 }}>
                        Glad to see you again. Check you classes, updates, and performance below.
                    </Text>
                </View>

            </View>

            <View style={{ borderWidth: 0.5, borderColor: 'gray', padding: 20, borderRadius: 10, marginTop: 70, width: '85%', backgroundColor: "white", elevation: 10, shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }} >
                    <Ionicons name="megaphone-outline" size={20} color="black" />
                    <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 10 }}>Announcement Section</Text>
                </View>
                <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
                    <FlatList
                        data={DATA}
                        renderItem={({ item }) => (
                            <View style={{ padding:1, borderBottomWidth: 0.5, borderColor: 'gray' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{item.title}</Text>
                            </View>
                        )}
                    />
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({})