import React, { useEffect, useState } from 'react'
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

let appleHealthKit: any = null

type resultsType = {
  startDate: Date
  endDate: Date
  value: number
}

async function loadAppleHealthKit() {
  if (Platform.OS === 'ios') {
    const module = await import('react-native-health')
    appleHealthKit = module.default
  }
}

const Weight = () => {
  const [isHealthKitLinked, setIsHealthKitLinked] = useState(false)
  const [weight, setWeight] = useState<number | null>(null)
  const [newWeight, setNewWeight] = useState('')

  const getWeightData = () => {
    if (Platform.OS !== 'ios' || !appleHealthKit) return

    appleHealthKit.getLatestWeight({ unit: 'pound' }, (err: string, results: resultsType) => {
      if (err) {
        console.log('error getting latest weight: ', err)
        return
      }
      console.log(results)
      setWeight(results.value)
    })
  }

  const addWeight = () => {
    if (Platform.OS !== 'ios' || !appleHealthKit) return
    if (!newWeight || newWeight.trim() === '' || isNaN(Number(newWeight))) return

    appleHealthKit.saveWeight(
      {
        unit: 'pound',
        value: Number(newWeight),
        date: new Date().toISOString(),
      },
      (err: object, result: any) => {
        if (err) {
          console.log('Error saving weight', err)
          return
        }
        console.log('Saved weight:', result)
        setNewWeight('')
        getWeightData()
      }
    )
  }

  useEffect(() => {
    getWeightData()
  }, [isHealthKitLinked])

  useEffect(() => {
    loadAppleHealthKit().then(() => setIsHealthKitLinked(true))
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Weight</Text>

      {weight ? (
        <Text style={styles.currentWeight}>Latest Weight: {weight} lbs</Text>
      ) : (
        <Text>No weight data found</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter new weight (lbs)"
        keyboardType="numeric"
        value={newWeight}
        onChangeText={setNewWeight}
      />

      <Button title="Save Weight" onPress={addWeight} />
    </View>
  )
}

export default Weight

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 18,
    marginBottom: 12,
  },
  currentWeight: {
    marginBottom: 12,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
  },
})
