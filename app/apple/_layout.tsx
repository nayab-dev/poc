import { router, Slot } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";

export default function RootLayout() {
    useEffect(()=>{
        const check=()=>{
            if(Platform.OS!=="ios")router.replace("/")
        }
    check()
    },[])
  return <Slot />;
}
