// constants/permissions.ts
import { Permission } from "react-native-health-connect";

export const allPermissions: Permission[] = [
  { accessType: "read", recordType: "ActiveCaloriesBurned" },
  { accessType: "write", recordType: "ActiveCaloriesBurned" },

  { accessType: "read", recordType: "BloodPressure" },
  { accessType: "write", recordType: "BloodPressure" },

  { accessType: "read", recordType: "BodyFat" },
  { accessType: "write", recordType: "BodyFat" },

  { accessType: "read", recordType: "BodyTemperature" },
  { accessType: "write", recordType: "BodyTemperature" },

  { accessType: "read", recordType: "CervicalMucus" },
  { accessType: "write", recordType: "CervicalMucus" },

  { accessType: "read", recordType: "ExerciseSession" },
  { accessType: "write", recordType: "ExerciseSession" },

  { accessType: "read", recordType: "Distance" },
  { accessType: "write", recordType: "Distance" },

  { accessType: "read", recordType: "HeartRate" },
  { accessType: "write", recordType: "HeartRate" },

  { accessType: "read", recordType: "Height" },
  { accessType: "write", recordType: "Height" },

  { accessType: "read", recordType: "Hydration" },
  { accessType: "write", recordType: "Hydration" },
  { accessType: "read", recordType: "Nutrition" },
  { accessType: "write", recordType: "Nutrition" },
  { accessType: "read", recordType: "OvulationTest" },
  { accessType: "write", recordType: "OvulationTest" },

  { accessType: "read", recordType: "OxygenSaturation" },
  { accessType: "write", recordType: "OxygenSaturation" },

  { accessType: "read", recordType: "RestingHeartRate" },
  { accessType: "write", recordType: "RestingHeartRate" },

  { accessType: "read", recordType: "SleepSession" },
  { accessType: "write", recordType: "SleepSession" },

  { accessType: "read", recordType: "Steps" },
  { accessType: "write", recordType: "Steps" },

  { accessType: "read", recordType: "TotalCaloriesBurned" },
  { accessType: "write", recordType: "TotalCaloriesBurned" },

  { accessType: "read", recordType: "Weight" },
  { accessType: "write", recordType: "Weight" },

  {
    accessType:"read",recordType:"ExerciseSession"
  },
  {
    accessType:"write",recordType:"ExerciseSession"
  },
  {
    accessType:"read",
    recordType:"MenstruationPeriod"
  },
   {
    accessType:"write",
    recordType:"MenstruationPeriod"
  },
   {
    accessType:"write",
    recordType:"MenstruationFlow"
  },
  {
    accessType:"read",
    recordType:"MenstruationFlow"
  },
];
