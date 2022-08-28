import "react-native-gesture-handler";
import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';

import Consultas from '../screens/Consultas';
import OdernServicio from '../screens/OdernServicio';
import { MaterialCommunityIcons } from "@expo/vector-icons";


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#EA0029',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerRight: () => (
                        <View style={styles.search}>
                            <TextInput />
                            <AntDesign name="search1" size={24} color="#FFF" style={{ paddingEnd: 10, }} />
                        </View>
                    ),
                }}
                initialRouteName="Consultas"
            >
                <Drawer.Screen name="Consultas" component={Consultas} />
                <Drawer.Screen name="Ordenes"
                    component={OdernServicio}
                    options={{
                        title: 'Orden',
                        drawerIcon: ({ color }) => (
                            <MaterialCommunityIcons name="cart-arrow-right" color={color} size={26} />
                        ),
                    }}
                />
            </Drawer.Navigator>


        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    search: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
    },
})
