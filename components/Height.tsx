import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { insertRecords, readRecords } from 'react-native-health-connect'

const Height = ({setShowHeight}) => {
   const [height,setHeight]=useState()
     
        const addHeight=async()=>{
            try {
                const now = new Date();
    const startTime = new Date(now.getTime() - 1000 * 60 * 30).toISOString(); // 30 min ago
    const endTime = now.toISOString();
                console.log("called")
              const result =  await insertRecords([
                {
                    recordType:'Height',
                    
time:startTime,
height:{unit:"meters",value:1.70}
                }
                ])
                console.log("Added the Height",result)
                await getHeight()
                
            } catch (error) {
              console.log("error while trying to add the steps ",error)  
            }
        }
        const getHeight=async()=>{
            try {
                const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today
    const start = today.toISOString();
    const end = new Date().toISOString();
             const {records}=  await readRecords("Height",{timeRangeFilter:{
                    operator:'between',
                    startTime:start,
                endTime:end
                }})
                console.log(records)
                  if (records.length > 0) {
    setHeight(records[0])   
      }
                
               
            } catch (error) {
                console.log("Error while fetching the steps")
            }
        }
           useEffect(()=>{
            getHeight()
        },[])
    
      return (
        <View style={{width:"100%"}}>
          
           <Text>Height is {height?.height?.inMeters} meters</Text>
            <Button title='Add Height' onPress={addHeight} />
          <Button title='Close' onPress={()=>setShowHeight(false)} />
        </View>
      )
}

export default Height

const styles = StyleSheet.create({})