import NavigationBtn from "@/components/NavigationBtn";
import { intilizeAppleHealth } from "@/lib/intializeAppleHealth";
import { initGoogleHealth } from "@/lib/intializeGoogle";
import { useEffect } from "react";
import { Platform, View } from "react-native";

export default function Index() {
  useEffect(()=>{
    if(Platform.OS==="android"){

      initGoogleHealth()
    }else{
      intilizeAppleHealth()
    }
  },[])
  
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
    <NavigationBtn />
     
    </View>
  );
}
