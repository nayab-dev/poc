import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
// import appleHealthKit from "react-native-health";

let appleHealthKit: any = null;

// if (Platform.OS === "ios") {
//   try {
//     appleHealthKit = require("react-native-health").default;
//   } catch (e) {
//     console.log("Failed to load appleHealthKit:", e);
//   }
// }

async function loadAppleHealthKit(){
   if (Platform.OS === "ios") {
    const module = await import("react-native-health");
    appleHealthKit = module.default;
    console.log("appleHealthKit loaded:", appleHealthKit);
  }
}

const Water = () => {
  const [water, setWater] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [amount, setAmount] = useState(""); // user input
  const [isHealthKitLinked,setIsHealthKitLinked]=useState(false)

  const getHydration = () => {
    if (Platform.OS !== 'ios' || !appleHealthKit) return

    appleHealthKit.getWater(
      {
        date: selectedDate.toISOString(),
        includeManuallyAdded: false,
      },
      (err: string, results) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("Fetched water:", results);
        if (results?.value) setWater(results.value);
        else setWater(0);
      }
    );
  };

  const addHydration = () => {
  if (Platform.OS !== 'ios' || !appleHealthKit) return
  if (!amount) return;

  appleHealthKit.saveWater(
    {
      value: Number(amount),
       date: (new Date(selectedDate)).toISOString(), 

    },
    (error: string, result) => {
      if (error) {
        console.log("Error adding hydration", error);
        return;
      }
      console.log("Added:", result);
      setAmount("");
      getHydration();
    }
  );
};

  useEffect(() => {
    getHydration();
  }, [selectedDate,isHealthKitLinked]);

  useEffect(()=>{
    loadAppleHealthKit().then(()=>setIsHealthKitLinked(true))
  },[])

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💧 Water Intake</Text>

      <Text style={styles.dateText}>
        Date: {selectedDate.toDateString()}
      </Text>
      <Text style={styles.amountText}>
        Total: {water !== null ? `${water} L` : "0 L"}
      </Text>

      <TouchableOpacity
        style={styles.dateBtn}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateBtnText}>📅 Pick Date</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      {/* Input Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Enter amount in liters"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addHydration}>
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Water;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  dateText: {
    fontSize: 16,
    marginBottom: 5,
  },
  amountText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 15,
  },
  dateBtn: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  dateBtnText: {
    color: "#fff",
    fontWeight: "500",
  },
  form: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  addBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
