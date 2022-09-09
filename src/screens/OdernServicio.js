import React, { useCallback } from "react";
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

const Tab = createBottomTabNavigator();
export default function OdernServicio(props) {
    const { navigation, route } = props
    const { name, params } = route
    
    useFocusEffect(
        useCallback(() => {
            (async () => {
                if("ticket_id" in params){
                    const { ticket_id } = params
                    navigation.setOptions({ title: params.ticket_id })
                    await AsyncStorage.removeItem(ticketID)
                    await AsyncStorage.setItem(ticketID, (ticket_id).toString())
                }
            })()
        }, [])
    )


    return (
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
                    paddingVertical: 10,
                    paddingHorizontal: 10,
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

            <Tab.Screen name="1-EQUIPO" component={Equipo}
                options={{
                    headerShown: false
                }}
            />
            <Tab.Screen name="2-CLIENTE" component={Cliente}
                options={{
                    headerShown: false
                }}
            />
            <Tab.Screen name="3-DATOS" component={Datos}
                options={{
                    headerShown: false
                }}
            />
            <Tab.Screen name="4-COMPONENTES" component={Componentes}
                options={{
                    headerShown: false
                }}
            />
            <Tab.Screen name="5-ADJUNTOS" component={Adjuntos}
                options={{
                    headerShown: false
                }}
            />
            <Tab.Screen name="6-INGRESO HORAS" component={IngresoHoras}
                options={{
                    headerShown: false
                }}
            />
        </Tab.Navigator>
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