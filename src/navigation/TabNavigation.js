import React, { useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ayer from "../screens/TabScreem/Ayer";
import Manana from "../screens/TabScreem/Manana";
import Hoy from "../screens/TabScreem/Hoy";
import { StyleSheet } from "react-native";

const Tab = createBottomTabNavigator()


const TabNavigator = () => {
    const UserUp = useMemo(
        () => ({
            Update,
        }), [])
    function Update() {
        console.log("Hola")
    }
    return (
        <Tab.Navigator
            scenaAnimationEnabled={true}
            initialRouteName="Hoy"
            style={styles.container}
            screenOptions={{
                tabBarStyle: {
                    top: -1,
                    position: 'absolute',
                    backgroundColor: '#EA0029',
                },
                tabBarActiveTintColor: "#FFF",
                tabBarInactiveTintColor: '#FB6F6F',
                tabBarLabelStyle: {
                    fontSize: 12,
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
                        headerShown: false
                    }}
                />
                <Tab.Screen name="Hoy" component={Hoy}
                    options={{
                        headerShown: false
                    }}
                />
                <Tab.Screen name="Mañana" component={Manana}
                    options={{
                        headerShown: false,
                    }}
                />
        </Tab.Navigator>
    )
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