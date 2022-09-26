import { StyleSheet, Text, View } from "react-native";
import TabNavigator from "../navigation/TabNavigation";
import { upContext } from "../context/upContext";

export default function Consultas() {
    return (
        // <upContext.Provider >
            <TabNavigator />
        // </upContext.Provider>
    );
}