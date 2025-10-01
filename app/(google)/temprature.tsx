import { end, start } from '@/constants/time';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { insertRecords, readRecords, TemperatureMeasurementLocation } from 'react-native-health-connect';

const Temperature = () => {
  const [temperature, setTemperature] = useState('');
  const [temperatureData, setTemperatureData] = useState([]);

  const addTemperatureRecord = async () => {
    try {
      if (!temperature || Number(temperature) <= 0) return;
    const now = new Date()
      const startTime = new Date(now.getTime() - 1000 * 60 * 30).toISOString() 
      await insertRecords([
        {
          recordType: "BodyTemperature",
          temperature: { unit: "celsius", value: Number(temperature) },
          time: startTime,
          measurementLocation: TemperatureMeasurementLocation.MOUTH
        }
      ]);

      setTemperature('');
      getTemperatureData();
    } catch (error) {
      // console.log("Error while adding temperature data", error);
    }
  };

  const getTemperatureData = async () => {
    try {
      const { records } = await readRecords("BodyTemperature", {
        timeRangeFilter: { startTime: start, endTime: end, operator: "between" }
      });
      // console.log(records)
      setTemperatureData(records);
    } catch (error) {
      // console.log("Error fetching temperature data", error);
    }
  };

  useEffect(() => {
    getTemperatureData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Temperature</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Temperature (°C)"
        keyboardType="numeric"
        value={temperature}
        onChangeText={setTemperature}
      />

      <Button title="Add Temperature" onPress={addTemperatureRecord} />

      <FlatList
        data={temperatureData}
        keyExtractor={(item) => item.metadata.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Temperature: {item.temperature?.inCelsius} °C</Text>
            <Text>Time: {new Date(item.time).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Temperature;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },
  list: { marginTop: 20 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }
});
