import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

const Btns=[{
  herf:"/apple/steps",name:"Steps"
},
{
  herf:"/apple/distance",name:"Distance"
},
{
  herf:"/apple/water",name:"Water"
},
{
  herf:"/apple/heart-rate",name:"Heart Rate"
},{
  herf:"/apple/sleep",name:"Sleep"
},{
  herf:"/apple/height",name:"Height"
},{
  herf:"/apple/weight",name:"Weight"
}

]
const AppleHealth = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Apple Health</Text>
{
  Btns.map((item,idx)=>(

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(item.herf)}
        key={idx}
      >
        <Text style={styles.cardText}>{item.name}</Text>
      </TouchableOpacity>
  ))
}
      
    </ScrollView>
  );
};

export default AppleHealth;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 18,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
