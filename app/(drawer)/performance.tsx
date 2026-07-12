import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

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
        {
            id: '78694a0f-3da1-471f-bd96-145571e29d72',
            title: 'Third Item',
        },
    ];

    return (
        <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', padding: 15 }}>
            <View style={{ borderWidth: 0.5, borderColor: 'white', padding: 20, borderRadius: 10, marginTop: 20, flexDirection: 'row', alignItems: 'center', width: '85%', backgroundColor: "white", elevation: 10, shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}>
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

            <View style={{ borderWidth: 0.5, borderColor: 'white', padding: 20, borderRadius: 10, marginTop: 70, width: '85%', backgroundColor: "white", elevation: 10, shadowColor: 'black', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 30 }} >
                    <Ionicons name="megaphone-outline" size={20} color="black" />
                    <Text style={{ fontWeight: 'bold', fontSize: 20, marginLeft: 10, }}>Announcement Section</Text>
                </View>
                <View
                    style={{

                    }}
                >
                    <FlatList
                        data={DATA}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    width: '100%',
                                    padding: 20,
                                    borderWidth: 1,
                                    borderColor: '#2dcee3',
                                    borderRadius: 5,
                                    marginVertical: 10,
                                    alignSelf: 'center',
                                }}
                            >
                                <Text style={{ fontWeight: 'bold', fontFamily: 'Arial', color: "#2dcee3", fontSize: 18 }}>{item.title}</Text>
                                <Text>{item.id}</Text>
                            </View>
                        )}
                    />
                </View>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({})