import "react-native-gesture-handler";
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';

import Consultas from '../screens/Consultas';
import OdernServicio from '../screens/OdernServicio';
import Separador from "../components/Separador";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons/build/Icons";
import useUser from "../hook/useUser";
import TicketsOS from "../screens/TabScreem/TicketsOS";

const Drawer = createDrawerNavigator();

function Menu(prop) {

    const { logout } = useUser()

    const handleLogout = async () => {
        await logout()
    }

    return (
        <View style={styles.menu}>
            <View style={styles.header}>
                <Text style={{ fontWeight: "bold", fontSize: 20, color: "#FFF" }}>Soporte Pruebas</Text>
                <Text style={{ fontSize: 12, color: "#FFF" }}>soporte@eos.med.ec</Text>
            </View>
            <Separador />
            <TouchableOpacity style={styles.MenuIten} onPress={() => prop.navigation.navigate("Consultas")}>
                <View style={styles.item}>
                    <Text style={{ fontSize: 15, color: "#B2B2AF" }}>Inicia</Text>
                    <MaterialCommunityIcons name="home-floor-g" size={24} color="#B2B2AF" />
                </View>
            </TouchableOpacity>
            <Separador />
            <TouchableOpacity style={styles.MenuIten} onPress={handleLogout}>
                <View style={styles.item}>
                    <Text style={{ fontSize: 15, color: "#B2B2AF" }}>Cerrar</Text>
                    <MaterialCommunityIcons name="close-circle" size={24} color="#B2B2AF" />
                </View>
            </TouchableOpacity>
            <Separador />
        </View>
    )
}

export default function DrawerNavigation(props) {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={props => <Menu {...props} />}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#EA0029',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    // headerRight: () => (
                    //     <View style={styles.search}>
                    //         <TextInput />
                    //         <AntDesign name="search1" size={24} color="#FFF" style={{ paddingEnd: 10, }} />
                    //     </View>
                    // ),
                }}
                initialRouteName="Consultas"
            >
                <Drawer.Screen name="Consultas" component={Consultas} />
                <Drawer.Screen name="Ordenes" component={OdernServicio} />
                <Drawer.Screen name="Ticket" component={TicketsOS} />
                {/* <Drawer.Screen name="Perfil" component={Perfil} /> */}
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
    menu: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    header: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: '#EA0029',
        height: "20%",
        width: "100%"
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 10,
        width: "100%",
        position: "absolute",
    },
    MenuIten: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "5%",
        width: "100%",
    },
})
