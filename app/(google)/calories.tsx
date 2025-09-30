import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { insertRecords, readRecords } from "react-native-health-connect";

const Calories = () => {
  const [calories, setCalories] = useState([]);
  const [energy, setEnergy] = useState("");

  const addCalories = async () => {
    if (!energy) return;
    try {
      const now = new Date();
      const startTime = new Date(now.getTime() - 1000 * 60 * 30).toISOString(); // 30 min ago
      const endTime = now.toISOString();

      await insertRecords([
        {
          recordType: "ActiveCaloriesBurned",
          startTime,
          endTime,
          energy: { unit: "calories", value: Number(energy) },
        },
      ]);

      setEnergy("");
      await getCalories();
    } catch (error) {
      console.log("Error adding calories:", error);
    }
  };

  const getCalories = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // start of today
      const start = today.toISOString();
      const end = new Date().toISOString();

      const { records } = await readRecords("ActiveCaloriesBurned", {
        timeRangeFilter: { operator: "between", startTime: start, endTime: end },
      });

      setCalories(records);
    } catch (error) {
      console.log("Error fetching calories:", error);
    }
  };

  useEffect(() => {
    getCalories();
  }, []);

  return (
    <View style={styles.container}>
     
      <TextInput
        placeholder="Enter calories (in calories)"
        keyboardType="numeric"
        value={energy}
        onChangeText={setEnergy}
        style={styles.input}
      />
      <Button title="Add Calories" onPress={addCalories} />

      {/* List of calories */}
      <FlatList
        data={calories}
        keyExtractor={(item) => item.metadata.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Calories: {item.energy.inCalories} Calories</Text>
            <Text>Start: {new Date(item.startTime).toLocaleString()}</Text>
            <Text>End: {new Date(item.endTime).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Calories;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  item: { marginVertical: 8, padding: 8, borderBottomWidth: 1, borderBottomColor: "#ddd" },
});
