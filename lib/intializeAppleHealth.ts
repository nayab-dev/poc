import { Platform } from 'react-native';
import {
  HealthKitPermissions,
  HealthValue
} from 'react-native-health';

let AppleHealthKit: any = null;

// if (Platform.OS === "ios") {
//   try {
//     AppleHealthKit = require("react-native-health").default;
//     console.log("✅ AppleHealthKit loaded:", AppleHealthKit ? "OK" : "undefined");
//   } catch (e) {
//     console.log("❌ Failed to load AppleHealthKit:", e);
//   }
// }


async function loadAppleHealth(){
   if (Platform.OS === "ios") {
    const module = await import("react-native-health");
    AppleHealthKit = module.default;
    // console.log("AppleHealthKit loaded:", AppleHealthKit);
  }
}

export const intilizeAppleHealth=async()=>{
  await loadAppleHealth()
  if (Platform.OS !== "ios" || !AppleHealthKit) return;
const permissions:HealthKitPermissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.HeartRate,AppleHealthKit.Constants.Permissions.Water,AppleHealthKit.Constants.Permissions.HeartRate,AppleHealthKit.Constants.Permissions.DistanceCycling,AppleHealthKit.Constants.Permissions.DistanceSwimming,AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,AppleHealthKit.Constants.Permissions.SleepAnalysis,AppleHealthKit.Constants.Permissions.Steps,AppleHealthKit.Constants.Permissions.StepCount,AppleHealthKit.Constants.Permissions.Weight,AppleHealthKit.Constants.Permissions.Height],
    write: [AppleHealthKit.Constants.Permissions.HeartRate,AppleHealthKit.Constants.Permissions.Water,AppleHealthKit.Constants.Permissions.HeartRate,AppleHealthKit.Constants.Permissions.DistanceCycling,AppleHealthKit.Constants.Permissions.DistanceSwimming,AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,AppleHealthKit.Constants.Permissions.SleepAnalysis,AppleHealthKit.Constants.Permissions.Steps,AppleHealthKit.Constants.Permissions.StepCount,AppleHealthKit.Constants.Permissions.Weight,AppleHealthKit.Constants.Permissions.Height],
  },
} 

AppleHealthKit.isAvailable((err:object,results:boolean)=>{

  if(err)return 


AppleHealthKit.initHealthKit(permissions,(error:string,result:HealthValue)=>{
    if (error) {
    console.log('[ERROR] Cannot grant permissions!')
  }

  

  
})
})

}