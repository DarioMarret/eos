import "react-native-gesture-handler";
import React from 'react';
import { Button, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import Consultas from '../screens/Consultas';
import OdernServicio from '../screens/OdernServicio';

function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {/* <Button
          onPress={() => navigation.navigate('Notifications')}
          title="Go to notifications"
        /> */}
            <Text>Hola</Text>
        </View>
    );
}

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
            }}
            initialRouteName="Consultas"
            >
                <Drawer.Screen name="Consultas" component={Consultas} />
            </Drawer.Navigator>


        </NavigationContainer>
    );
}



{/* <Stack.Navigator
        initialRouteName="StackCuenta"
        screenOptions={{ headerStyle: { backgroundColor: "#900C3F" } }}
    >
        <Stack.Screen
            name="StackCuenta"
            component={HomeScreen}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="StackCambiarContrasena"
            component={NotificationsScreen}
            options={{ title: "Cambio de contraseña" }}
        /> 
    </Stack.Navigator>*/}


