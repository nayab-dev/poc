import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { readRecords } from 'react-native-health-connect'

const BMI = () => {
  const [weight, setWeight] = useState()
  const [height, setHeight] = useState()

  const getHeight = async () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const start = today.toISOString()
      const end = new Date().toISOString()
      const { records } = await readRecords('Height', {
        timeRangeFilter: { startTime: start, endTime: end, operator: 'between' }
      })
      setHeight(records[records.length - 1])
    } catch (error) {
      // console.log('Error fetching height', error)
    }
  }

  const getWeight = async () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const start = today.toISOString()
      const end = new Date().toISOString()
      const { records } = await readRecords('Weight', {
        timeRangeFilter: { startTime: start, endTime: end, operator: 'between' }
      })
      setWeight(records[records.length - 1])
    } catch (error) {
      // console.log('Error fetching weight', error)
    }
  }

  useEffect(() => {
    getHeight()
    getWeight()
  }, [])

  const calculateBMI = () => {
    if (!weight || !height) return 'Not available'

    const w = weight.weight?.inKilograms
    const h = height.height?.inMeters
    if (!w || !h) return 'Not available'

    const bmi = w / (h * h)
    return bmi.toFixed(2)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>BMI Calculator</Text>
      <Text style={styles.bmiText}>BMI: {calculateBMI()}</Text>
      <Text style={styles.infoText}>
        Weight: {weight?.weight?.inKilograms ?? 'N/A'} kg | Height: {height?.height?.inMeters ?? 'N/A'} m
      </Text>
    </View>
  )
}

export default BMI

const styles = StyleSheet.create({
  container: { padding: 16, alignItems: 'center' },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  bmiText: { fontSize: 18, marginBottom: 8 },
  infoText: { fontSize: 16, marginBottom: 16 }
})
