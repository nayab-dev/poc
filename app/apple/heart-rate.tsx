import DatePickerComponent from '@/components/DatePickerComponent';
import { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';


let appleHealthKit: any = null;

async function loadAppleHealthKit(){
   if (Platform.OS === "ios") {
    const module = await import("react-native-health");
    appleHealthKit = module.default;
    console.log("appleHealthKit loaded:", appleHealthKit);
  }
}

// type heartRateSampleType={
// value:
// }
// if (Platform.OS === "ios") {
//   try {
//     appleHealthKit = require("react-native-health").default;
//   } catch (e) {
//     console.log("Failed to load appleHealthKit:", e);
//   }
// }

const HeartRate = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [heartRate, setHeartRate] = useState('')
  const [samples, setSamples] = useState([])
  const [isHealthKitLinked,setIsHealthKitLinked]=useState(false)

  const getHeartRate = () => {
        if (Platform.OS !== 'ios' || !appleHealthKit) return


  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);


  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  appleHealthKit.getHeartRateSamples(
    {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
      ascending: true,
    },
    (err: string, result) => {
      if (err) {
        console.log("Error getting heart rate", err);
        return;
      }
      console.log("Fetched:", result);
      setSamples(result || []);
    }
  );
};


  const saveHeartRate = () => {
        if (Platform.OS !== 'ios' || !appleHealthKit) return
    if (!heartRate) return
    appleHealthKit.saveHeartRateSample(
      {
        value: Number(heartRate),
        date: selectedDate.toISOString(), 
       
      },
      (err: string, result) => {
        if (err) {
          console.log('Error saving heart rate', err)
          return
        }
        console.log('Saved:', result)
        setHeartRate('')
        getHeartRate()
      }
    )
  }

  useEffect(()=>{
    loadAppleHealthKit().then(()=>setIsHealthKitLinked(true))
  },[])
  useEffect(() => {
    getHeartRate()
  }, [selectedDate,isHealthKitLinked])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>❤️ Heart Rate</Text>
      <Text style={styles.dateText}>
        Date: {selectedDate.toDateString()}
      </Text>

      {/* Date Picker */}
      <DatePickerComponent
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        show={showDatePicker}
        setShow={setShowDatePicker}
      />

      {/* Input Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter bpm"
          keyboardType="numeric"
          value={heartRate}
          onChangeText={setHeartRate}
        />
        <TouchableOpacity style={styles.addBtn} onPress={saveHeartRate}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Show fetched samples */}
      <View style={styles.samples}>
        <Text style={styles.samplesHeader}>Samples</Text>
        {samples.length > 0 ? (
          samples.map((s, i) => (
            <Text key={i} style={styles.sampleItem}>
              {s.value} bpm — {new Date(s.startDate).toLocaleTimeString()}
            </Text>
          ))
        ) : (
          <Text>No data</Text>
        )}
      </View>
    </ScrollView>
  )
}

export default HeartRate

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  addBtn: {
    backgroundColor: '#e63946',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  samples: {
    marginTop: 20,
  },
  samplesHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  sampleItem: {
    fontSize: 16,
    marginBottom: 5,
  },
})
