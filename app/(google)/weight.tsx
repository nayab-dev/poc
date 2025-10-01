import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { insertRecords, readRecords } from 'react-native-health-connect'

type resultType = {
  metadata: { id: string }
  time: string
  weight: { inKilograms: number }
}
const Weight = () => {
  const [weight, setWeight] = useState<resultType>()
  const [inputWeight, setInputWeight] = useState('')

  const addWeight = async () => {
    try {
      if (!inputWeight || Number(inputWeight) <= 0) return

      const now = new Date()
      const startTime = new Date(now.getTime() - 1000 * 60 * 30).toISOString() 

      const result=await insertRecords([
        {
          recordType: 'Weight',
          time: now.toISOString(),
          weight: { unit: 'kilograms', value: Number(inputWeight) }
        }
      ])
      // console.log("added",result);
      
      setInputWeight('')
      await getWeight()
    } catch (error) {
      // console.log('Error while adding weight', error)
    }
  }

  const getWeight = async () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const start = today.toISOString()
      const end = new Date().toISOString()

      const { records } = await readRecords('Weight', {
        timeRangeFilter: { operator: 'between', startTime: start, endTime: end }
      })


      if (records.length > 0) {
        setWeight(records[records.length-1] as resultType)
      }
    } catch (error) {
      // console.log('Error while fetching weight', error)
    }
  }

  useEffect(() => {
    getWeight()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Weight Tracker</Text>
      
      <TextInput
        placeholder="Enter weight in kg"
        value={inputWeight}
        onChangeText={setInputWeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Add Weight" onPress={addWeight} />

      <Text style={styles.currentWeight}>
        Current Weight: {weight?.weight?.inKilograms ?? 'N/A'} kg
      </Text>


    </View>
  )
}

export default Weight

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 6
  },
  currentWeight: { fontSize: 16, marginVertical: 10 }
})
