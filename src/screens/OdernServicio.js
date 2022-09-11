import React, { useCallback, useMemo, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Equipo from "../screens/TabOrdenesServicion/Equipo";
import Cliente from "../screens/TabOrdenesServicion/Cliente";
import Datos from "../screens/TabOrdenesServicion/Datos";
import Componentes from "../screens/TabOrdenesServicion/Componentes";
import Adjuntos from "../screens/TabOrdenesServicion/Adjuntos";
import IngresoHoras from "../screens/TabOrdenesServicion/IngresoHoras";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ticketID } from "../utils/constantes";
import tabNavigation from "../hook/tabNavigation"
import tabContext from "../context/tabContext";

const Tab = createBottomTabNavigator();
const ta = [
    { name: "1" },
    { name: "2" },
    { name: "3" },
    { name: "4" },
    { name: "5" },
    { name: "6" },
]
var title = ["1", "2", "3", "4", "5", "6", "7"]
export default function OdernServicio(props) {
    const { navigation, route } = props
    const { name, params } = route

    const [title, setTitle] = useState(ta)
    const [Title_name, setTitleName] = useState("")

    useFocusEffect(
        useCallback(() => {
            (async () => {
                let ticket_id = await AsyncStorage.getItem(ticketID)
                // navigation.setOptions({ title: ticket_id })
                TabTitle(name)
            })()
        }, [])
    )


    function TabTitle(name){
        let name_ = name.split("-")
        console.log(name_[1])
        setTitleName(name_[1])
    }

    const TabData = useMemo(
        () => ({
            TabTitle
        }), []
    )

    return (
        <tabContext.Provider value={TabData}>
        <Tab.Navigator
            initialRouteName="1-EQUIPO"
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
                    paddingVertical: 5,
                    paddingHorizontal: 5,
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

            <Tab.Screen
                name="1-EQUIPO"
                component={Equipo}
                options={{
                    title: Title_name == "EQUIPO" ? Title_name : "1" ,
                    headerShown: false
                }}
            />
            <Tab.Screen name="2-CLIENTE" component={Cliente}
                options={{
                    title: Title_name == "CLIENTE" ? Title_name : "2",
                    headerShown: false
                }}
            />
            <Tab.Screen name="3-DATOS" component={Datos}
                options={{
                    title: Title_name == "DATOS" ? Title_name : "3",
                    headerShown: false
                }}
            />
            <Tab.Screen name="4-COMPONENTES" component={Componentes}
                options={{
                    title: Title_name == "COMPONENTES" ? Title_name : "4",
                    headerShown: false,
                }}
            />
            <Tab.Screen name="5-ADJUNTOS" component={Adjuntos}
                options={{
                    title: Title_name == "ADJUNTOS" ? Title_name : "5",
                    headerShown: false
                }}
            />
            <Tab.Screen name="6-INGRESO HORAS" component={IngresoHoras}
                options={{
                    title: Title_name == "INGRESO HORAS" ? Title_name : "6",
                    headerShown: false
                }}
            />
        </Tab.Navigator>
        </tabContext.Provider>
    );
}
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