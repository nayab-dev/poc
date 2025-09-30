import DatePickerComponent from '@/components/DatePickerComponent';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

let appleHealthKit: any = null;

async function loadAppleHealthKit(){
   if (Platform.OS === "ios") {
    const module = await import("react-native-health");
    appleHealthKit = module.default;
    console.log("appleHealthKit loaded:", appleHealthKit);
  }
}
// if (Platform.OS === "ios") {
//   try {
//     appleHealthKit = require("react-native-health").default;
//   } catch (e) {
//     console.log("Failed to load appleHealthKit:", e);
//   }
// }


const Sleep = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [sleepData, setSleepData] = useState([])
  const [isHealthKitLinked,setIsHealthKitLinked]=useState(false)

  const getSleepSample = () => {
        if (Platform.OS !== 'ios' || !appleHealthKit) return

    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    appleHealthKit.getSleepSamples(
      {
        startDate: startOfDay.toISOString(),
        endDate: endOfDay.toISOString(),
        ascending: true,
      },
      (err: string, result) => {
        if (err) return console.log('Error getting sleep sample', err)
        setSleepData(result || [])
      }
    )
  }

  useEffect(() => {
    getSleepSample()
  }, [selectedDate,isHealthKitLinked])
  useEffect(()=>{
    loadAppleHealthKit().then(()=>setIsHealthKitLinked(true))
  },[])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sleep Data</Text>

      <View style={styles.card}>
        <DatePickerComponent
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          show={showDatePicker}
          setShow={setShowDatePicker}
        />
      </View>

      {sleepData.length === 0 ? (
        <Text style={styles.noData}>No sleep data found for this date</Text>
      ) : (
        sleepData.map((sample, index) => (
          <View key={index} style={styles.sampleBox}>
            <Text style={styles.sampleText}>
              {new Date(sample.startDate).toLocaleTimeString()} →{' '}
              {new Date(sample.endDate).toLocaleTimeString()}
            </Text>
          </View>
        ))
      )}
    </View>
  )
}

export default Sleep

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    color: '#222',
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  noData: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
  },
  sampleBox: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  sampleText: {
    fontSize: 14,
    color: '#333',
  },
})
