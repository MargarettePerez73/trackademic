import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function DropdownMenu() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setVisible(!visible)}
        style={{ marginRight: 15 }}
      >
        <Ionicons
          name="ellipsis-horizontal-outline"
          size={22}
          color="black"
        />
      </TouchableOpacity>

      {visible && (
        <View style={styles.menu}>
          <TouchableOpacity style={{ paddingLeft:10, padding: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => console.log("Profile")}>
            <Ionicons name="person-circle-outline" size={20} color="black" />
            <Text style={styles.item}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingLeft:10, padding: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => console.log("Logout")}>
            <Ionicons name="log-out-outline" size={20} color="black" />
            <Text style={styles.item}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  menu: {
    position: "absolute",
    top: 35,
    right: 10,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 5,
    width: 150,
    elevation: 5, // Android shadow
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  item: {
    padding: 12,
    fontSize: 16,
  },
});