import { end, start } from '@/constants/time';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { insertRecords, MealType, readRecords } from 'react-native-health-connect';
type resultType = { 

  protein: { inGrams: number } | null;
  totalFat: { inGrams: number } | null; 
  totalCarbohydrate: { inGrams: number } | null;
  mealType: string | null;
  startTime: string;
  metadata: { id: string };
}
const Nutrition = () => {
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [nutritionData, setNutritionData] = useState<resultType[]>([]);

  const addNutritionRecord = async () => {
    try {
      if (!protein || !fat || !carbs) return;
    const now = new Date()
      const startTime = new Date(now.getTime() - 1000 * 60 * 5).toISOString() // 30 min ago
      const endTime = now.toISOString()
     const result= await insertRecords([
        {
          recordType: "Nutrition",
          protein: { unit: "grams", value: Number(protein) },
          totalFat: { unit: "grams", value: Number(fat) },
          totalCarbohydrate: { unit: "grams", value: Number(carbs) },
          startTime: startTime,
          endTime: endTime,
          mealType: MealType.LUNCH
        }
      ]);
// console.log("added",result)
      setProtein('');
      setFat('');
      setCarbs('');
     await getNutritionData();
    } catch (error) {
      // console.log("Error while adding nutrition data", error);
    }
  };

  const getNutritionData = async () => {
    try {
      const { records } = await readRecords("Nutrition", {
        timeRangeFilter: { startTime: start, endTime: end, operator: "between" }
      });
      // console.log(records);
      
      setNutritionData(records as resultType[]);
    } catch (error) {
      // console.log("Error fetching nutrition data", error);
    }
  };

  useEffect(() => {
    getNutritionData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nutrition</Text>

      <TextInput
        style={styles.input}
        placeholder="Protein (grams)"
        keyboardType="numeric"
        value={protein}
        onChangeText={setProtein}
      />

      <TextInput
        style={styles.input}
        placeholder="Fat (grams)"
        keyboardType="numeric"
        value={fat}
        onChangeText={setFat}
      />

      <TextInput
        style={styles.input}
        placeholder="Carbs (grams)"
        keyboardType="numeric"
        value={carbs}
        onChangeText={setCarbs}
      />

      <Button title="Add Nutrition" onPress={addNutritionRecord} />

      <FlatList
        data={nutritionData}
        keyExtractor={(item) => item.metadata.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Protein: {item.protein?.inGrams} g</Text>
            <Text>Fat: {item.totalFat?.inGrams} g</Text>
            <Text>Carbs: {item.totalCarbohydrate?.inGrams} g</Text>
            <Text>Meal: {item.mealType}</Text>
            <Text>Time: {new Date(item.startTime).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Nutrition;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },
  list: { marginTop: 20 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }
});
