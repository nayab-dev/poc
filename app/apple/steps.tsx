import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Button, Platform, StyleSheet, Text, TextInput, View } from 'react-native';

// import appleHealthKit from 'react-native-health'

let appleHealthKit: any = null;

async function loadAppleHealthKit(){
   if (Platform.OS === "ios") {
    const module = await import("react-native-health");
    appleHealthKit = module.default;
    console.log("appleHealthKit loaded:", appleHealthKit);
  }
}

const Steps = () => {
  const [steps, setSteps] = useState<number | null>(null)
  const [date, setDate] = useState(new Date())
  const [showPicker, setShowPicker] = useState(false)
  const [manualSteps, setManualSteps] = useState('')
  const [isHealthKitLinked,setIsHealthKitLinked]=useState(false)

  const getStepCount = () => {
        if (Platform.OS !== 'ios' || !appleHealthKit) return
    const options = {
      date: date.toISOString(),
      includeManuallyAdded: false,
    }

    appleHealthKit.getStepCount(options, (err: string, results) => {
      if (err) {
        console.error(err)
        return
      }
      setSteps(results.value)
    })
  }

  const addStep = () => {
        if (Platform.OS !== 'ios' || !appleHealthKit) return
    if (!manualSteps) return
    const value = parseInt(manualSteps, 10)

    const startDate = new Date(date)
    const endDate = new Date(date)

    const options = {
      value,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }

    appleHealthKit.saveSteps(options, (err: string, result) => {
      if (err) {
        console.log('Error adding steps', err)
        return
      }
      console.log('Saved:', result)
      getStepCount() 
    })
  }

  useEffect(() => {
    getStepCount()
  }, [date,isHealthKitLinked])

  useEffect(()=>{
    loadAppleHealthKit().then(()=>setIsHealthKitLinked(true))
  },[])

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          Steps on {date.toDateString()}
        </Text>
        <Text style={styles.stepCount}>
          {steps !== null ? steps.toLocaleString() : 0}
        </Text>
        <Text style={styles.subText}>Keep moving and stay healthy 🚶‍♂️</Text>
      </View>

      <View style={styles.controls}>
        <Button title="Pick Date" onPress={() => setShowPicker(true)} />
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(event, selectedDate) => {
              setShowPicker(false)
              if (selectedDate) setDate(selectedDate)
            }}
          />
        )}

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter steps"
          value={manualSteps}
          onChangeText={setManualSteps}
        />
        <Button title="Add Steps" onPress={addStep} />
      </View>
    </View>
  )
}

export default Steps

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingTop:30
  },
  card: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  stepCount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subText: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
  },
  controls: {
    width: '85%',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginVertical: 12,
    textAlign: 'center',
    fontSize: 16,
  },
})
