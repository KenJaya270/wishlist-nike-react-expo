import { Ionicons } from '@expo/vector-icons';
import { Tabs } from "expo-router";
export default function TabsLayout(){

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#149cac",
                tabBarInactiveTintColor: "#999",
                headerShown: false
            }}
        >

            <Tabs.Screen name="index" options={{ 
                title: "Home", 
                tabBarIcon: ({ color }) => (
                    <Ionicons name="home" size={24} color={color} />
                )
            }} />
            <Tabs.Screen name="detail/[id]" options={{
                title: "Detail",
                tabBarIcon: ({ color }) => (
                    <Ionicons name="information-circle" size={24} color={color} />
                )

            }} />

        </Tabs>
    )

}