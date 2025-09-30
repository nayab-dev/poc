import { end, start } from '@/constants/time';
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  BloodPressureBodyPosition,
  BloodPressureMeasurementLocation,
  insertRecords,
  readRecords,
} from 'react-native-health-connect';

const BloodPressure = () => {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [bodyPosition, setBodyPosition] = useState('');
  const [armPosition, setArmPosition] = useState('');
  const [records, setRecords] = useState([]);

  const BodyPositions = Object.keys(BloodPressureBodyPosition);
  const ArmPositions = Object.keys(BloodPressureMeasurementLocation);

  // Fetch blood pressure records
  const getBloodPressure = async () => {
    try {
      const { records } = await readRecords('BloodPressure', {
        timeRangeFilter: { operator: 'between', startTime: start, endTime: end },
      });
      setRecords(records);
    } catch (err) {
      console.log('Error fetching blood pressure:', err);
    }
  };

  // Add blood pressure record
  const addBloodPressure = async () => {
    if (!systolic || !diastolic || bodyPosition === '' || armPosition === '') return;

    const newRecord = {
      recordType: 'BloodPressure',
      bodyPosition: Number(bodyPosition),
      measurementLocation: Number(armPosition),
      systolic: { value: Number(systolic), unit: 'millimetersOfMercury' },
      diastolic: { value: Number(diastolic), unit: 'millimetersOfMercury' },
      time: new Date().toISOString(),
      metadata: { id: Date.now().toString() }, // temporary id for UI
    };

    // Optimistic UI update
    setRecords([newRecord, ...records]);

    try {
      await insertRecords([newRecord]);
      // Give Health Connect a moment to sync
      (getBloodPressure());
    } catch (err) {
      console.log('Error adding blood pressure:', err);
    }

    // Reset form
    setSystolic('');
    setDiastolic('');
    setBodyPosition('');
    setArmPosition('');
  };

  useEffect(() => {
    getBloodPressure();
  }, []);

  // Helpers to get readable names
  const getBodyPositionName = (index: number) => BodyPositions[index] || 'Invalid';
  const getArmPositionName = (index: number) => ArmPositions[index] || 'Invalid';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blood Pressure</Text>

      <TextInput
        style={styles.input}
        placeholder="Systolic"
        keyboardType="numeric"
        value={systolic}
        onChangeText={setSystolic}
      />
      <TextInput
        style={styles.input}
        placeholder="Diastolic"
        keyboardType="numeric"
        value={diastolic}
        onChangeText={setDiastolic}
      />

      <Picker
        selectedValue={bodyPosition}
        onValueChange={(itemValue) => setBodyPosition(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Body Position" value="" color="#999" />
        {BodyPositions.map((item, index) => (
          <Picker.Item label={item} value={index} key={index} />
        ))}
      </Picker>

      <Picker
        selectedValue={armPosition}
        onValueChange={(itemValue) => setArmPosition(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Arm Position" value="" color="#999" />
        {ArmPositions.map((item, index) => (
          <Picker.Item label={item} value={index} key={index} />
        ))}
      </Picker>

      <Button title="Add Blood Pressure" onPress={addBloodPressure} />

      <FlatList
        style={styles.list}
        data={records}
        keyExtractor={(item) => item.metadata.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Systolic: {item.systolic.value} mmHg</Text>
            <Text>Diastolic: {item.diastolic.value} mmHg</Text>
            <Text>Body Position: {getBodyPositionName(item.bodyPosition)}</Text>
            <Text>Arm Position: {getArmPositionName(item.measurementLocation)}</Text>
            <Text>Time: {new Date(item.time).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default BloodPressure;

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 20, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    borderRadius: 5,
  },
  list: { marginTop: 20 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});
