import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ticketID } from "../../utils/constantes";
import BannerTicket from "../../components/BannerTicket";

export default function TicketsOS(props) {
    const { navigation } = props
    useFocusEffect(
        useCallback(() => {
            (async () => {
                const ticket_id = JSON.parse(await AsyncStorage.getItem(ticketID)).ticket_id
                console.log("ticket_id", ticket_id)
                // navigation.setOptions({ title: `Ticket # ${ticket_id}` })

            })()
        }, [])
    )
    return (
        <View style={styles.container} >
            <View style={styles.body}>
                <View style={styles.body1}>
                    <Text>{"TicketsOS"}</Text>
                </View>
                <View style={styles.body2}>
                    <Text>Este ticket no tiene OS asociadas.</Text>
                </View>
                <View style={styles.body3}>
                    <TouchableOpacity style={styles.opacity}>
                        <Text style={styles.text4}>INGRESAR NUEVO OS AL TICKET</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <BannerTicket
                {...props}
                navigation={navigation}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "#FFF",
        alignItems: "center",
    },
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    body1: {
        flex: 2,
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        paddingTop: 20,
    },
    body2: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    body3: {
        flex: 2,
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
    },
    text4: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
    },
    opacity: {
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        padding: 20,
        backgroundColor: "#FF6B00",
        borderRadius: 30,
        marginBottom: 10,
        elevation: 5,
    }
});