import DateTimePicker from '@react-native-community/datetimepicker'
import React, { useEffect, useState } from 'react'
import {
  Button,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { insertRecords, readRecords } from 'react-native-health-connect'

const Steps = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [steps, setSteps] = useState<any[]>([])
  const [value, setValue] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)

  const getSteps = async () => {
    try {
      const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    const start = startOfDay.toISOString()
    const end = endOfDay.toISOString()

      const { records } = await readRecords('Steps', {
        timeRangeFilter: {
          startTime: start,
          endTime: end,
          operator: 'between',
        },
      })
      // console.log(records)
      setSteps(records)
    } catch (error) {
      // console.log('Error getting step', error)
    }
  }

  const addSteps = async () => {
  try {
    const end = new Date(selectedDate)
    const start = new Date(end.getTime() - 2 * 60 * 1000) 

    await insertRecords([
      {
        recordType: 'Steps',
        count: Number(value),
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      },
    ])

    setValue('')
    getSteps()
  } catch (error) {
    // console.log('Error inserting step', error)
  }
}


  const onChangeDate = (_: any, selected?: Date) => {
    setShowDatePicker(false)
    if (selected) {
      setSelectedDate(selected)
      getSteps() 
    }
  }

  useEffect(() => {
    getSteps()
  }, [selectedDate])

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Steps</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter step count"
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
      />

      <Button title="Pick Date" onPress={() => setShowDatePicker(true)} />

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'android' ? 'calendar' : 'default'}
          onChange={onChangeDate}
        />
      )}

      <Text style={styles.dateText}>
        Selected Date: {selectedDate.toDateString()}
      </Text>

      <Button title="Add Steps" onPress={addSteps} />

      <Text style={styles.stepsText}>Fetched Records:</Text>

      {steps.length > 0 ? (
        <FlatList
          data={steps}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.record}>
              <Text>Steps: {item.count}</Text>
              <Text>
                From: {new Date(item.startTime).toLocaleTimeString()} - To:{' '}
                {new Date(item.endTime).toLocaleTimeString()}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text>No step records found for this date.</Text>
      )}
    </View>
  )
}

export default Steps

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex:1
  },
  heading: {
    fontSize: 18,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
  dateText: {
    marginTop: 8,
    marginBottom: 12,
  },
  stepsText: {
    marginTop: 16,
    fontSize: 16,
    marginBottom: 8,
  },
  record: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
})
