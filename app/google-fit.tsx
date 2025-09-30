import { router } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native'

const healthRoutes = [
  { href: "/activity-data", name: "Activity Type" },
  { href: "/blood-pressure", name: "Blood Pressure" },
  { href: "/bmi", name: "BMI" },
  { href: "/body-fat", name: "Body Fat" },
  { href: "/calories", name: "Calories" },
  { href: "/distance", name: "Distance" },
  { href: "/heart-rate", name: "Heart Rate" },
  { href: "/height", name: "Height" },
  { href: "/hydration", name: "Hydration" },
  { href: "/nutrition", name: "Nutrition" },
  { href: "/oxygen-saturation", name: "Oxygen Saturation" },
  { href: "/reproductive-health", name: "Reproductive Health" },
  { href: "/sleep", name: "Sleep" },
  { href: "/steps", name: "Steps" },
  { href: "/temprature", name: "Temperature" },
  { href: "/weight", name: "Weight" },
]



const GoogleFit = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
         <Text style={styles.header}>Google Health</Text>
   {
     healthRoutes.map((item,idx)=>(
   
         <TouchableOpacity
           style={styles.card}
           onPress={() => router.push(item.href)}
           key={idx}
         >
           <Text style={styles.cardText}>{item.name}</Text>
         </TouchableOpacity>
     ))
   }
         
       </ScrollView>
  )
}

export default GoogleFit

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
