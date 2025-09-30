import React, { useEffect, useState } from 'react'
import { Button, FlatList, StyleSheet, Text, View } from 'react-native'
import { ExerciseType, insertRecords, readRecords } from 'react-native-health-connect'

const ActivityType = ({setShowActivityType}) => {
   const [activityData,setActivityData]=useState([])
   
      const addActivity=async()=>{
          try {
              const now = new Date();
  const startTime = new Date(now.getTime() - 1000 * 60 * 30).toISOString(); // 30 min ago
  const endTime = now.toISOString();
             
            const result =  await insertRecords([
              {
                  recordType:'ExerciseSession',
                  startTime:startTime,endTime:endTime,
  exerciseType:ExerciseType.RUNNING,
  notes:"Walk a mile",
  laps:[{startTime:new Date().toISOString(),endTime:new Date().toISOString(),length:{unit:"kilometers",value:20}}],
//   exerciseRoute:{route:[{}]}
title:"My Running",
// segments:[{}]
startZoneOffset:{id:"Asia/Kolkata",totalSeconds:2000},
endZoneOffset:{id:"Asia/Kolkata",totalSeconds:5000}

              }
              ])
              console.log("Added the activity",result)
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
           const {records}=  await readRecords("ExerciseSession",{timeRangeFilter:{
                  operator:'between',
                  startTime:start,
              endTime:end
              }})
              setActivityData(records)
          } catch (error) {
              console.log("Error while fetching the steps")
          }
      }
         useEffect(()=>{
          getCalories()
      },[])
      console.log(activityData)
    return (
      <View style={{width:"100%"}}>
        
         <FlatList 
          data={activityData}
  keyExtractor={(item)=>item.metadata.id}
  renderItem={({item})=><View style={{marginVertical:10}}>
      <Text>{item.exerciseType}</Text>
      <Text>Start time {new Date(item.startTime).toLocaleDateString()}</Text>
      <Text>End Time {new Date(item.endTime).toLocaleDateString()}</Text>
  </View>}
          
           /> 
          <Button title='Add Activity' onPress={addActivity} />
        <Button title='Close' onPress={()=>setShowActivityType(false)} />
      </View>
    )
}

export default ActivityType

const styles = StyleSheet.create({})