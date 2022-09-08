import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from "react-native";
import Banner from "../components/Banner";
import Equipo from "../screens/TabOrdenesServicion/Equipo";
import Cliente from "../screens/TabOrdenesServicion/Cliente";
import Datos from "../screens/TabOrdenesServicion/Datos";
import Componentes from "../screens/TabOrdenesServicion/Componentes";
import Adjuntos from "../screens/TabOrdenesServicion/Adjuntos";
import IngresoHoras from "../screens/TabOrdenesServicion/IngresoHoras";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();
export default function OdernServicio(props) {
    const { navigation, route } = props
    const { name, params } = route

    // console.log(params.item)
    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                if (name === "Ordenes") {
                    navigation.navigate("1-EQUIPO", { ...params.item })
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
            <Tab.Screen
                name="1-EQUIPO"
                component={Equipo}

                options={{
                    // tabBarIcon: ({ color }) => (
                    //     <MaterialCommunityIcons name="book-open" color={color} size={26} />
                    // ),
                    headerShown: false
                }}
                params={params}
            />
            <Tab.Screen name="2-CLIENTE" component={Cliente}
                options={{
                    // tabBarIcon: ({ color }) => (
                    //     <MaterialCommunityIcons name="cart-arrow-right" color={color} size={26} />
                    // ),
                    headerShown: false
                }}
            />
            <Tab.Screen name="3-DATOS" component={Datos}
                options={{
                    // tabBarIcon: ({ color }) => (
                    //     <MaterialCommunityIcons name="cart-arrow-right" color={color} size={26} />
                    // ),
                    headerShown: false
                }}
            />
            <Tab.Screen name="4-COMPONENTES" component={Componentes}
                options={{
                    // tabBarIcon: ({ color }) => (
                    //     <MaterialCommunityIcons name="cart-arrow-right" color={color} size={26} />
                    // ),
                    headerShown: false
                }}
            />
            <Tab.Screen name="5-ADJUNTOS" component={Adjuntos}
                options={{
                    // tabBarIcon: ({ color }) => (
                    //     <MaterialCommunityIcons name="cart-arrow-right" color={color} size={26} />
                    // ),
                    headerShown: false
                }}
            />
            <Tab.Screen name="7-INGRESO FECHAS" component={IngresoHoras}
                options={{
                    // tabBarIcon: ({ color }) => (
                    //     <MaterialCommunityIcons name="cart-arrow-right" color={color} size={26} />
                    // ),
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