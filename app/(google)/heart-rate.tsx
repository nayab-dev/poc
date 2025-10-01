import { end, start } from '@/constants/time';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { insertRecords, readRecords } from 'react-native-health-connect';

type resultType = {
  metadata: { id: string };
  samples: { beatsPerMinute: number; time: string }[];
};
const HeartRate = () => {
  const [bpm, setBPM] = useState('');
  const [bpmData, setBPMData] = useState<resultType[]>([]);

  const addHeartRate = async () => {
    try {
      const now = new Date()
      const startTime = new Date(now.getTime() - 1000 * 60 * 30).toISOString() // 30 min ago
      const endTime = now.toISOString()
     const result= await insertRecords([{
        recordType: "HeartRate",
        startTime: startTime,
        endTime: endTime,
        samples: [{ beatsPerMinute: Number(bpm), time: endTime }]
      }]);
      // console.log("added ",result)
      setBPM('');
      getBPMData(); // refresh list after adding
    } catch (error) {
      // console.log("Error while adding heart rate", error);
    }
  };

  const getBPMData = async () => {
    try {
          
      const { records } = await readRecords("HeartRate", {
        timeRangeFilter: { startTime: start, endTime: end, operator: 'between' }
      });
      // console.log(records)
      setBPMData(records as resultType[]);
    } catch (error) {
      // console.log("Error while getting heart rate", error);
    }
  };

  useEffect(() => {
    getBPMData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Heart Rate</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter BPM"
        keyboardType="numeric"
        value={bpm}
        onChangeText={setBPM}
      />

      <Button title="Add Heart Rate" onPress={addHeartRate} />

      <FlatList
        data={bpmData}
        keyExtractor={(item) => item.metadata.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>BPM: {item.samples[0]?.beatsPerMinute}</Text>
            <Text>Time: {new Date(item.samples[0]?.time).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default HeartRate;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 10, borderRadius: 5 },
  list: { marginTop: 20 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }
});
