import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { readRecords } from 'react-native-health-connect'

const BMI = ({setShowBMI}) => {
    const [weight,setWeight]=useState()
    const [height,setHeight]=useState()
    const getHeight=async()=>{
        try {
              const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today
  const start = today.toISOString();
  const end = new Date().toISOString();
          const {records}=  await readRecords("Height",{timeRangeFilter:{
            startTime:start,endTime:end,operator:"between"
          }})
          setHeight(records[0])

        } catch (error) {
            console.log("Error while tring to fetch the weight",error)
        }
    }
     const getWeight=async()=>{
        try {
              const today = new Date();
  today.setHours(0, 0, 0, 0); // start of today
  const start = today.toISOString();
  const end = new Date().toISOString();
          const {records}=  await readRecords("Weight",{timeRangeFilter:{
startTime:start,endTime:end,operator:'between'
          }})
          setWeight(records[0])

        } catch (error) {
            console.log("Error while tring to fetch the weight",error)
        }
    }
console.log(height)
console.log(weight)
    useEffect(()=>{
        getHeight()
        getWeight()
    },[])
      const calculateBMI = () => {
    if (!weight || !height) return "Not available"

    const w = weight.weight?.inKilograms
    const h = height.height?.inMeters

    if (!w || !h) return "Not available"

    const bmi = w / (h * h)
    return bmi.toFixed(2)
  }
  return (
    <View>
      <Text>BMI is {calculateBMI()}</Text>
      <Button title='Close' onPress={()=>setShowBMI(false)} />
    </View>
  )
}

export default BMI

const styles = StyleSheet.create({})