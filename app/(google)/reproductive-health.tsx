import { end, start } from '@/constants/time'
import React, { useEffect, useState } from 'react'
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import {
    CervicalMucusAppearance,
    CervicalMucusSensation,
    insertRecords,
    MenstruationFlow,
    OvulationTestResult,
    readRecords
} from 'react-native-health-connect'

const ReproductiveHealth = () => {
  const [flowData, setFlowData] = useState<any[]>([])
  const [cervicalData, setCervicalData] = useState<any[]>([])
  const [ovulationData, setOvulationData] = useState<any[]>([])
  const [flow, setFlow] = useState('')
  const [appearance, setAppearance] = useState('')
  const [sensation, setSensation] = useState('')
  const [ovulation, setOvulation] = useState('')

  // --- Add Records ---
  const addMenstrualFlowData = async () => {
    try {
      const result = await insertRecords([{
        recordType: 'MenstruationFlow',
        time: new Date().toISOString(),
        flow: flow === 'heavy' 
          ? MenstruationFlow.HEAVY 
          : flow === 'light'
          ? MenstruationFlow.LIGHT 
          : MenstruationFlow.MEDIUM
      }])
      console.log('Added menstrual flow', result)
     await getMenstrualFlowData()
    } catch (e) {
      console.log('Error adding flow', e)
    }
  }

  const addCervicalMucusData = async () => {
    try {
      const result = await insertRecords([{
        recordType: 'CervicalMucus',
        time: new Date().toISOString(),
        appearance: appearance === 'dry' ? CervicalMucusAppearance.DRY : CervicalMucusAppearance.CREAMY,
        sensation: sensation === 'heavy' ? CervicalMucusSensation.HEAVY : CervicalMucusSensation.LIGHT
      }])
      console.log('Added cervical mucus', result)
    await  getCervicalMucusData()
    } catch (e) {
      console.log('Error adding mucus', e)
    }
  }

  const addOvulationTestData = async () => {
    try {
      const result = await insertRecords([{
        recordType: 'OvulationTest',
        time: new Date().toISOString(),
        result: ovulation === 'positive' ? OvulationTestResult.POSITIVE : OvulationTestResult.NEGATIVE
      }])
      console.log('Added ovulation test', result)
     await getOvulationTestData()
    } catch (e) {
      console.log('Error adding ovulation', e)
    }
  }

  // --- Get Records ---
  const getMenstrualFlowData = async () => {
    try {
      const { records } = await readRecords('MenstruationFlow', {
        timeRangeFilter: { startTime: start, endTime: end, operator: 'between' }
      })
      setFlowData(records)
    } catch (e) {
      console.log('Error fetching flow', e)
    }
  }

  const getCervicalMucusData = async () => {
    try {
      const { records } = await readRecords('CervicalMucus', {
        timeRangeFilter: { startTime: start, endTime: end, operator: 'between' }
      })
      setCervicalData(records)
    } catch (e) {
      console.log('Error fetching mucus', e)
    }
  }

  const getOvulationTestData = async () => {
    try {
      const { records } = await readRecords('OvulationTest', {
        timeRangeFilter: { startTime: start, endTime: end, operator: 'between' }
      })
      setOvulationData(records)
    } catch (e) {
      console.log('Error fetching ovulation', e)
    }
  }

  useEffect(() => {
    getMenstrualFlowData()
    getCervicalMucusData()
    getOvulationTestData()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Reproductive Health</Text>

      {/* Menstrual Flow */}
      <TextInput 
        style={styles.input} 
        placeholder="Flow (light/medium/heavy)" 
        value={flow} 
        onChangeText={setFlow} 
      />
      <Button title="Add Flow" onPress={addMenstrualFlowData} />
      <FlatList 
        data={flowData}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>Flow: {item.flow} | Time: {item.time}</Text>
        )}
      />

      {/* Cervical Mucus */}
      <TextInput 
        style={styles.input} 
        placeholder="Appearance (dry/creamy)" 
        value={appearance} 
        onChangeText={setAppearance} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Sensation (light/heavy)" 
        value={sensation} 
        onChangeText={setSensation} 
      />
      <Button title="Add Cervical Mucus" onPress={addCervicalMucusData} />
      <FlatList 
        data={cervicalData}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>Appearance: {item.appearance} | Sensation: {item.sensation}</Text>
        )}
      />

      {/* Ovulation */}
      <TextInput 
        style={styles.input} 
        placeholder="Ovulation (positive/negative)" 
        value={ovulation} 
        onChangeText={setOvulation} 
      />
      <Button title="Add Ovulation Test" onPress={addOvulationTestData} />
      <FlatList 
        data={ovulationData}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>Result: {item.result} | Time: {item.time}</Text>
        )}
      />
    </View>
  )
}

export default ReproductiveHealth

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 6 },
  item: { padding: 6, borderBottomWidth: 1, borderColor: '#eee' }
})
