import React, { useEffect, useState } from 'react'
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import { insertRecords, readRecords } from 'react-native-health-connect'
type resultType = {
  metadata: { id: string }
  startTime: string
  endTime: string
  distance: { inMiles: number }
}

const Distance = () => {
  const [distance, setDistance] = useState<resultType[]>([])
  const [value, setValue] = useState('')
  const [duration,setDuration]=useState(0)

  const addDistance = async () => {
    if (!value) return
    try {
      const now = new Date()
      const startTime = new Date(now.getTime() - 1000 * 60 * 5).toISOString() 
      const endTime = now.toISOString()

      await insertRecords([
        {
          recordType: 'Distance',
          startTime,
          endTime,
          distance: { value: Number(value), unit: 'miles' }
        }
      ])

      setValue('')
      await getDistance()
    } catch (error) {
      // console.log('Error adding distance:', error)
    }
  }

  const getDistance = async () => {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const start = today.toISOString()
      const end = new Date().toISOString()

      const { records } = await readRecords('Distance', {
        timeRangeFilter: { operator: 'between', startTime: start, endTime: end }
      }) as { records: resultType[] }
      let totalDurationInHrs=0.000;
      records.forEach((item)=>{
        const startTime=new Date(item.startTime)
        const endTime=new Date(item.endTime)
        const durationMs=endTime.getTime()-startTime.getTime();
        const durationHrs=durationMs/(60*60*1000)
        // console.log(durationHrs)
        totalDurationInHrs+=durationHrs
      })
      setDuration(Number(totalDurationInHrs.toFixed(2)))
      // console.log('Fetched distance records:', records)
      setDistance(records)
    } catch (error) {
      // console.log('Error fetching distance:', error)
    }
  }

  useEffect(() => {
    getDistance()
    getSum()
  }, [])
  const getSum=()=>{
    if(distance.length>0){
      const result=distance.reduce((acc,curr)=>acc+curr.distance.inMiles,0)
      // console.log(result);
    }
  }

  return (
    <View style={styles.container}>
      {/* Input form */}
      <TextInput
        placeholder="Enter distance in miles"
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
        style={styles.input}
      />
      <Button title="Add Distance" onPress={addDistance} />
    <Text>Duration is {duration} hours</Text>
      {/* Distance list */}
      <FlatList
        data={distance}
        keyExtractor={(item) => item.metadata.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Distance: {item.distance.inMiles} miles</Text>
            <Text>Start: {new Date(item.startTime).toLocaleString()}</Text>
            <Text>End: {new Date(item.endTime).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  )
}

export default Distance

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5
  },
  item: { marginVertical: 8, padding: 8, borderBottomWidth: 1, borderBottomColor: '#ddd' }
})
