import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { insertRecords, readRecords } from 'react-native-health-connect'

const Height = () => {
  const [height, setHeight] = useState()
  const [inputHeight, setInputHeight] = useState('')

  const addHeight = async () => {
    try {
      if (!inputHeight || Number(inputHeight) <= 0) return

      const now = new Date()
      const startTime = new Date(now.getTime() - 1000 * 60 * 30).toISOString() 

      await insertRecords([
        {
          recordType: 'Height',
          time: startTime,
          height: { unit: 'meters', value: Number(inputHeight) }
        }
      ])
      setInputHeight('')
      await getHeight()
    } catch (error) {
      console.log('Error while adding height', error)
    }
  }

  const getHeight = async () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const start = today.toISOString()
      const end = new Date().toISOString()

      const { records } = await readRecords('Height', {
        timeRangeFilter: { operator: 'between', startTime: start, endTime: end }
      })

      if (records.length > 0) {
        setHeight(records[records.length - 1])
      }
    } catch (error) {
      console.log('Error while fetching height', error)
    }
  }

  useEffect(() => {
    getHeight()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Height Tracker</Text>

      <TextInput
        placeholder="Enter height in meters"
        value={inputHeight}
        onChangeText={setInputHeight}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Add Height" onPress={addHeight} />

      <Text style={styles.currentHeight}>
        Current Height: {height?.height?.inMeters ?? 'N/A'} meters
      </Text>

    
    </View>
  )
}

export default Height

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
  currentHeight: { fontSize: 16, marginVertical: 10 }
})
