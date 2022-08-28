import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ayer from "../screens/TabScreem/Ayer";
import Manana from "../screens/TabScreem/Manana";
import Hoy from "../screens/TabScreem/Hoy";
import { StyleSheet, View } from "react-native";


const Tab = createBottomTabNavigator();
const TabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Hoy"
            style={styles.container}
            screenOptions={{
                tabBarStyle: {
                    position: 'absolute',
                    top: 0,
                    backgroundColor: '#EA0029',
                },
                tabBarActiveTintColor: "#FFF",
                tabBarInactiveTintColor: '#FB6F6F',
                tabBarLabelStyle: {
                    fontSize: 20,
                    fontWeight: 'normal',
                    paddingBottom: 10,
                    textTransform: 'uppercase',
                    
                },
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName;
                    if (focused) {
                        iconName = 'calendar-check';
                    } else {
                        iconName = 'calendar-blank';
                    }
                    return <MaterialCommunityIcons name={iconName} size={0} color={color} />;
                }
            }}
        >
            <Tab.Screen name="Ayer" component={Ayer}
                options={{
                    // tabBarIcon: ({ color }) => (
                    //     <MaterialCommunityIcons name="book-open" color={color} size={26} />
                    // ),
                    headerShown: false
                }}
            />
            <Tab.Screen name="Hoy" component={Hoy}
                options={{
                    // tabBarIcon: ({ color }) => (
                    //     <MaterialCommunityIcons name="cart-arrow-right" color={color} size={26} />
                    // ),
                    headerShown: false
                }}
            />
            <Tab.Screen name="Mañana" component={Manana}
                options={{
                    // tabBarIcon: ({ color }) => (
                    //     <MaterialCommunityIcons name="cart-arrow-right" color={color} size={26} />
                    // ),
                    headerShown: false
                }}
            />
        </Tab.Navigator>

    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomColor: '#eee',
        borderColor: 'transparent',
        borderWidth: 1,
        justifyContent: 'center',
        height: 44,
        flexDirection: 'row'
    },
});

export default TabNavigator;