import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';

const DatePickerComponent = ({ selectedDate, setSelectedDate, show, setShow }) => {
  return (
    <>
      <TouchableOpacity
        style={styles.dateBtn}
        onPress={() => setShow(true)}
      >
        <Text style={styles.dateBtnText}>📅 Pick Date</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={(event, date) => {
            setShow(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}
    </>
  );
};

export default DatePickerComponent;

const styles = StyleSheet.create({
  dateBtn: {
    backgroundColor: "#007AFF", // iOS blue
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // Android shadow
  },
  dateBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
