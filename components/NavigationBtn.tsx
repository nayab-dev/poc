import { router } from 'expo-router'
import React from 'react'
import { Button, Platform, StyleSheet, View } from 'react-native'

const NavigationBtn = () => {
  return (
    <View>
        {
            Platform.OS==="android"?<Button title='Google Health' onPress={()=>router.push("/google-fit")} />:<Button title='Apple Health' onPress={()=>router.push("/apple-health")} />
        }
    </View>
  )
}

export default NavigationBtn

const styles = StyleSheet.create({})