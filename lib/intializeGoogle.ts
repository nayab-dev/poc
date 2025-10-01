import { allPermissions } from "@/constants/permissions";
import { initialize, requestPermission } from "react-native-health-connect";

export const initGoogleHealth=async()=>{
  const isInitilized=await initialize()
  
  if(!isInitilized){
     console.log("Health Connect not available on this device");
    return;
  }  const grantedPermissions =  await requestPermission(allPermissions);
  // console.log("Granted permissions: ", grantedPermissions);
}