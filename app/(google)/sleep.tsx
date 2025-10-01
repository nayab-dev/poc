import { end, start } from '@/constants/time'
import React, { useEffect, useState } from 'react'
import { Button, FlatList, StyleSheet, Text, View } from 'react-native'
import { insertRecords, readRecords, SleepStageType } from 'react-native-health-connect'
type resultType = { 
  startTime: string;
  endTime: string;
  stages: { stage: string; startTime: string; endTime: string }[];
  metadata: { id: string };
}
const Sleep = () => {
  const [sleepData, setSleepData] = useState<resultType[]>([])

  const getSleepData = async () => {
    try {
      const { records } = await readRecords("SleepSession", {
        timeRangeFilter: {
          startTime: start,
          endTime: end,
          operator: "between"
        }
      })
      setSleepData(records as resultType[])
    } catch (error) {
      // console.log("Error while getting sleep data", error)
    }
  }

  const addSleep = async () => {
    try {
      await insertRecords([{
        recordType: "SleepSession",
        startTime: start,
        endTime: end,
        stages: [
          {
            stage: SleepStageType.LIGHT,
            startTime: start,
            endTime: end
          }
        ]
      }])
      await getSleepData()
    } catch (error) {
      // console.log("Error while adding sleep data", error)
    }
  }

  useEffect(() => {
    getSleepData()
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sleep</Text>

      <Button title="Add Sleep Session" onPress={addSleep} />

      <FlatList
        data={sleepData}
        keyExtractor={(item) => item.metadata.id}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Start: {new Date(item.startTime).toLocaleString()}</Text>
            <Text>End: {new Date(item.endTime).toLocaleString()}</Text>
            <Text>Stages:</Text>
            {item.stages?.map((s, idx) => (
              <Text key={idx}>
                {s.stage} ({new Date(s.startTime).toLocaleTimeString()} - {new Date(s.endTime).toLocaleTimeString()})
              </Text>
            ))}
          </View>
        )}
      />
    </View>
  )
}

export default Sleep

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  list: { marginTop: 20 },
  item: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }
})
