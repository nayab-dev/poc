import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { insertRecords, readRecords } from 'react-native-health-connect'
type resultType = {
  percentage: number
  time: string
  metadata: { id: string }
}
const BodyFat = () => {
  const [bodyFat, setBodyFat] = useState<resultType>()
  const [inputBodyFat, setInputBodyFat] = useState('')

  const addBodyFat = async () => {
    try {
      if (!inputBodyFat || Number(inputBodyFat) <= 0) return

      const now = new Date()
      const startTime = new Date(now.getTime() - 1000 * 60 * 30).toISOString() 

      await insertRecords([
        {
          recordType: 'BodyFat',
          time: startTime,
          percentage: Number(inputBodyFat)
        }
      ])
      setInputBodyFat('')
      await getBodyFat()
    } catch (error) {
      // console.log('Error while adding body fat', error)
    }
  }

  const getBodyFat = async () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const start = today.toISOString()
      const end = new Date().toISOString()

      const { records } = await readRecords('BodyFat', {
        timeRangeFilter: { operator: 'between', startTime: start, endTime: end }
      })

      if (records.length > 0) {
        setBodyFat(records[records.length - 1] as resultType)
      }
    } catch (error) {
      // console.log('Error while fetching body fat', error)
    }
  }

  useEffect(() => {
    getBodyFat()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Body Fat Tracker</Text>

      <TextInput
        placeholder="Enter body fat %"
        value={inputBodyFat}
        onChangeText={setInputBodyFat}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Add Body Fat" onPress={addBodyFat} />

      <Text style={styles.currentValue}>
        Current Body Fat: {bodyFat?.percentage ?? 'N/A'}%
      </Text>


    </View>
  )
}

export default BodyFat

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
  currentValue: { fontSize: 16, marginVertical: 10 }
})
