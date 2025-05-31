import { Tabs } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useEffect } from "react";
import { useRouter } from "expo-router";




export default function RootLayout() {
  
  return <Tabs  
  screenOptions={{
    headerShown:false,
  }}
  >
    <Tabs.Screen name="index" options={
         {
            tabBarLabel:"Home",
            tabBarIcon:({color,size})=>(
                <Feather name="home" size={size} color={color} />
            )
         }
    } />
      <Tabs.Screen name="about" options={{
        tabBarLabel:"about",
        tabBarIcon:({color,size})=>(
            <AntDesign name="areachart" size={size} color={color} />
        )
       }
    }/>

    </Tabs>;
};
