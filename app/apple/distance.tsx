import DatePickerComponent from '@/components/DatePickerComponent';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


type resultType={
  startDate:Date,
  endDate:Date,
value:number
}

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

const Distance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [distance, setDistance] = useState('') // user input
  const [totalDistance, setTotalDistance] = useState<number | null>(null)
  const [isHealthKitLinked,setIsHealthKitLinked]=useState(false)
  const [duration,setDuration]=useState("")
  const getDistance = () => {
    if(Platform.OS !== "ios" ||!appleHealthKit) return
    appleHealthKit.getDistanceWalkingRunning(
      {
        date: selectedDate.toISOString(),
        includeManuallyAdded: false,
      },
      (error: string, result:resultType) => {
        if (error) {
          // console.log('Error getting distance', error)
          return
        }
        console.log('Fetched distance:', result)
        if (result?.value) {
          setTotalDistance(result.value)
          const start=new Date(result.startDate)
          const end=new Date(result.endDate)
          const durationMs=end.getTime()-start.getTime()
          const durationHours=durationMs/(60*60*1000)
          // console.log(durationHours);
          setDuration(String(Math.floor(durationHours)))
          
        }
        else setTotalDistance(0)
      }
    )
  }

  const addDistance = () => {
     if(Platform.OS !== "ios" ||!appleHealthKit) return
    if (!distance) return

    const start=new Date(selectedDate)
    start.setMinutes(selectedDate.getMinutes()-30)
  
    appleHealthKit.saveWalkingRunningDistance(
      {
        value: Number(distance), 
        startDate:start.toISOString(),
        endDate:selectedDate.toISOString()
      },
      (err: string, result:number) => {
        if (err) return console.log('Error adding distance', err)
        console.log('Added distance:', result)

        setDistance('')
        getDistance()
      }
    )
  }

  // const getSample=()=>{
  //   if(Platform.OS !== "ios" ||!appleHealthKit) return
  //   appleHealthKit.getSamples({
  //     startDate:selectedDate.toISOString(),
  //     endDate:selectedDate.toISOString(),
  //      type: 'DistanceWalkingRunning'
  //   },(err:object,results:object[])=>{
  //     if(err)return console.log(err)
  //       console.log(results)
  //   })
  // }

  useEffect(()=>{
    loadAppleHealthKit().then(()=>setIsHealthKitLinked(true))
  },[])
  useEffect(() => {
    getDistance()
    // getSample()
  }, [selectedDate,isHealthKitLinked])

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.header}>🏃 Walking / Running Distance</Text>

      <Text style={styles.dateText}>
        Date: {selectedDate.toDateString()}
      </Text>
      <Text style={styles.dateText}>
        Time: {duration} Hour
      </Text>
      <Text style={styles.amountText}>
        Total: {totalDistance !== null ? `${totalDistance} m` : '0 m'}
      </Text>

      {/* Date Picker */}
      <DatePickerComponent
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        setShow={setShowDatePicker}
        show={showDatePicker}
      />

      {/* Input Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter distance (meter)"
          keyboardType="numeric"
          value={distance}
          onChangeText={setDistance}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addDistance}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

export default Distance

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 5,
  },
  amountText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 15,
  },
  form: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  addBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
})
