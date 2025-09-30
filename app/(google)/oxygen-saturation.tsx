import { end, start } from '@/constants/time';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { insertRecords, readRecords } from 'react-native-health-connect';

const OxygenSaturation = () => {
  const [percentage, setPercentage] = useState('');
  const [oxygenData, setOxygenData] = useState([]);

  const addOxygenSaturationRecord = async () => {
    try {
      if (!percentage || Number(percentage) <= 0) return;
          const now = new Date()
      const startTime = new Date(now.getTime() - 1000 * 60 * 30).toISOString() 
      await insertRecords([
        {
          recordType: "OxygenSaturation",
          percentage: Number(percentage),
          time: startTime
        }
      ]);

      setPercentage('');
      getOxygenSaturation();
    } catch (error) {
      console.log("Error while adding oxygen data", error);
    }
  };

  const getOxygenSaturation = async () => {
    try {
      const { records } = await readRecords("OxygenSaturation", {
        timeRangeFilter: { startTime: start, endTime: end, operator: "between" }
      });
      setOxygenData(records);
    } catch (error) {
      console.log("Error fetching oxygen data", error);
    }
  };

  useEffect(() => {
    getOxygenSaturation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oxygen Saturation</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter percentage"
        keyboardType="numeric"
        value={percentage}
        onChangeText={setPercentage}
      />

      <Button title="Add Oxygen Saturation" onPress={addOxygenSaturationRecord} />

      <FlatList
        data={oxygenData}
        keyExtractor={(item) => item.metadata.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Percentage: {item.percentage}%</Text>
            <Text>Time: {new Date(item.time).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default OxygenSaturation;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },
  list: { marginTop: 20 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }
});
