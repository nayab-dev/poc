import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { insertRecords, readRecords } from 'react-native-health-connect'

const BodyFat = ({setShowBodyFat}) => {
   const [bodyFat,setBodyFat]=useState()
     
        const addBodyFat=async()=>{
            try {
                const now = new Date();
    const startTime = new Date(now.getTime() - 1000 * 60 * 30).toISOString(); // 30 min ago
    const endTime = now.toISOString();
                console.log("called")
              const result =  await insertRecords([
                {
                    recordType:'BodyFat',
                    time:startTime,
                    percentage:20
                }
                ])
                console.log("Added the body fat",result)
                await getBodyFat()
                
            } catch (error) {
              console.log("error while trying to add the steps ",error)  
            }
        }
        const getBodyFat=async()=>{
            try {
                const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today
    const start = today.toISOString();
    const end = new Date().toISOString();
             const {records}=  await readRecords("BodyFat",{timeRangeFilter:{
                    operator:'between',
                    startTime:start,
                endTime:end
                }})
                console.log(records)
                  if (records.length > 0) {
    setBodyFat(records[0])   
      }
                
               
            } catch (error) {
                console.log("Error while fetching the steps")
            }
        }
           useEffect(()=>{
            getBodyFat()
        },[])
    
      return (
        <View style={{width:"100%"}}>
          
           <Text>Body Fat is {bodyFat?.percentage} percentage</Text>
            <Button title='Add Body Fat' onPress={addBodyFat} />
          <Button title='Close' onPress={()=>setShowBodyFat(false)} />
        </View>
      )
}

export default BodyFat

const styles = StyleSheet.create({})