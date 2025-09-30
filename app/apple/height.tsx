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

async function loadAppleHealthKit() {
  if (Platform.OS === 'ios') {
    const module = await import('react-native-health')
    appleHealthKit = module.default
  }
}

const Height = () => {
  const [isHealthKitLinked, setIsHealthKitLinked] = useState(false)
  const [height, setHeight] = useState<number | null>(null)
  const [newHeight, setNewHeight] = useState('')

  const getHeightData = () => {
    if (Platform.OS !== 'ios' || !appleHealthKit) return

    appleHealthKit.getLatestHeight({ unit: 'foot' }, (err: string, results: any) => {
      if (err) {
        console.log('error getting latest height: ', err)
        return
      }

      console.log(results)
      setHeight(results.value) 
    })
  }

  const addHeightData = () => {
    if (Platform.OS !== 'ios' || !appleHealthKit) return

    appleHealthKit.saveHeight(
      { unit: 'foot', value: Number(newHeight), date: new Date().toISOString() },
      (err: object, result: any) => {
        if (err) {
          console.log('Error adding height', err)
          return
        }
        console.log('Saved height:', result)
        setNewHeight('')
        getHeightData()
      }
    )
  }

  useEffect(() => {
    getHeightData()
  }, [isHealthKitLinked])

  useEffect(() => {
    loadAppleHealthKit().then(() => setIsHealthKitLinked(true))
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Height</Text>

      {height ? (
        <Text style={styles.currentHeight}>Latest Height: {height} ft</Text>
      ) : (
        <Text>No height data found</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Enter new height (ft)"
        keyboardType="numeric"
        value={newHeight}
        onChangeText={setNewHeight}
      />

      <Button title="Save Height" onPress={addHeightData} />
    </View>
  )
}

export default Height

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 18,
    marginBottom: 12,
  },
  currentHeight: {
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
