import { end, start } from '@/constants/time';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { insertRecords, readRecords } from 'react-native-health-connect';

const Hydration = () => {
  const [volume, setVolume] = useState('');
  const [volumeData, setVolumeData] = useState([]);

  const addHydrationRecord = async () => {
    try {
      if (!volume || Number(volume) <= 0) return;
          const now = new Date()
      const startTime = new Date(now.getTime() - 1000 * 60 * 30).toISOString() // 30 min ago
      const endTime = now.toISOString()
      await insertRecords([
        {
          recordType: "Hydration",
          startTime: startTime,
          endTime: endTime,
          volume: { unit: "liters", value: Number(volume) }
        }
      ]);

      setVolume('');
      getVolumeData();
    } catch (error) {
      console.log("Error while adding hydration data", error);
    }
  };

  const getVolumeData = async () => {
    try {
      const { records } = await readRecords("Hydration", {
        timeRangeFilter: { startTime: start, endTime: end, operator: "between" }
      });
      console.log(records)
      setVolumeData(records);
    } catch (error) {
      console.log("Error fetching hydration data", error);
    }
  };

  useEffect(() => {
    getVolumeData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hydration</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter volume (liters)"
        keyboardType="numeric"
        value={volume}
        onChangeText={setVolume}
      />

      <Button title="Add Hydration" onPress={addHydrationRecord} />

      <FlatList
        data={volumeData}
        keyExtractor={(item) => item.metadata.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Volume: {item.volume?.inLiters} liters</Text>
            <Text>Time: {new Date(item.startTime).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Hydration;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },
  list: { marginTop: 20 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }
});
