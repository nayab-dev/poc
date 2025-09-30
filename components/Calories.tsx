import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { insertRecords, readRecords } from 'react-native-health-connect';
const Calories = ({setShowCalories}) => {
 const [calories,setCalories]=useState([])
 
    const addCalories=async()=>{
        try {
            const now = new Date();
const startTime = new Date(now.getTime() - 1000 * 60 * 30).toISOString(); // 30 min ago
const endTime = now.toISOString();
            console.log("called")
          const result =  await insertRecords([
            {
                recordType:'ActiveCaloriesBurned',
                startTime:startTime,endTime:endTime,
energy:{unit:"joules",value:200}
            }
            ])
            console.log("Added the calories",result)
            await getCalories()
            
        } catch (error) {
          console.log("error while trying to add the steps ",error)  
        }
    }
    const getCalories=async()=>{
        try {
            const today = new Date();
today.setHours(0, 0, 0, 0); // start of today
const start = today.toISOString();
const end = new Date().toISOString();
         const {records}=  await readRecords("ActiveCaloriesBurned",{timeRangeFilter:{
                operator:'between',
                startTime:start,
            endTime:end
            }})
            setCalories(records)
        } catch (error) {
            console.log("Error while fetching the steps")
        }
    }
       useEffect(()=>{
        getCalories()
    },[])
    console.log(calories)
  return (
    <View style={{width:"100%"}}>
      
       <FlatList 
        data={calories}
keyExtractor={(item)=>item.metadata.id}
renderItem={({item})=><View style={{marginVertical:10}}>
    <Text>{item.energy.inCalories}</Text>
    <Text>Start time {new Date(item.startTime).toLocaleDateString()}</Text>
    <Text>End Time {new Date(item.endTime).toLocaleDateString()}</Text>
</View>}
        
         /> 
        <Button title='Add Calories' onPress={addCalories} />
      <Button title='Close' onPress={()=>setShowCalories(false)} />
    </View>
  )
}

export default Calories

const styles = StyleSheet.create({})