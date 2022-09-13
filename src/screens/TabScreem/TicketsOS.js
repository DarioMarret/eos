import { useFocusEffect } from "@react-navigation/native";

import calreq from '../../../assets/icons/cal-req.png';
import calok from '../../../assets/icons/cal-ok.png';
import calsync from '../../../assets/icons/cal-sync.png';
import calwait from '../../../assets/icons/cal-wait.png';

import { useCallback, useEffect, useState } from "react";

import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ticketID } from "../../utils/constantes";
import BannerTicket from "../../components/BannerTicket";
import { getOrdenServicioAnidadasTicket_id } from "../../service/OrdenServicioAnidadas";
import db from "../../service/Database/model";
import { AntDesign } from "@expo/vector-icons";
import moment from "moment";

export default function TicketsOS(props) {
    const { navigation } = props
    const [typeCalentar, setTypeCalendar] = useState(1)
    const [bg, setBg] = useState("")
    const [eventosAnidados, seteventosAnidados] = useState([])
    useFocusEffect(
        useCallback(() => {
            (async () => {
                const ticket_id = JSON.parse(await AsyncStorage.getItem(ticketID)).ticket_id
                console.log("ticket_id", ticket_id)
                // navigation.setOptions({ title: `Ticket # ${ticket_id}` })
                const response = await getOrdenServicioAnidadasTicket_id(ticket_id)
                seteventosAnidados(response)
                db.transaction(tx => {
                    tx.executeSql(`SELECT * FROM equipoTicket`, [], (_, { rows }) => {
                        console.log("id_equipo-->", rows._array.length)
                        // db.transaction(tx => {
                        //     tx.executeSql(`SELECT * FROM historialEquipo where equipo_id = ?`, [rows._array[0].id_equipo], (_, { rows }) => {
                        //         console.log("equipo selecionado hoy row", rows._array)
                        //         Rutes(rows._array, ticket_id)
                        //     })
                        // })
                    })
                })
                console.log("response ticket anidado", response)

            })()
        }, [])
    )
    const typeImage = () => {
        if (typeCalentar === 0) {
            setBg("#FFECDE")
            return calreq
        } else if (typeCalentar === 1) {
            setBg("#E2FAE0")
            return calok
        } else if (typeCalentar === 2) {
            setBg("#EFDEE1")
            return calsync
        } else {
            setBg("#FFFFFF")
            return calwait
        }
    }
    functionColor = (type) => {
        if (type === "PENDIENTE") {
            return "#FFECDE"
        } else if (type === "PROCESO" || type === "NUEVO") {
            return "#FFFFFF"
        } else if (type === "FINALIZADO") {
            return "#E2FAE0"
        } else {
            return "#FFFFFF"
        }
    }
    function _renderItem({ item, index }) {
        return [
            <View key={index}>
                <TouchableOpacity
                    onPress={() => Ordene(String(item.ticket_id))}>

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: functionColor(item.ev_estado),
                        width: '100%',
                        minHeight: 100,
                        paddingHorizontal: 20,
                        borderBottomWidth: 0.5,
                        borderColor: '#858583'
                    }}>
                        <View>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: '#858583'
                                }}
                            >{"#" + item.ticket_id + " - " + item.tck_tipoTicket.toUpperCase()} </Text>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                }}
                            >{item.tck_cliente}</Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: '#858583'
                                }}
                            >{item.ev_descripcion}</Text>
                        </View>

                        <View >
                            <Text onPress={() => { showSelect(index, item); setIsVisible(!isVisible) }} style={{
                                rotation: 90,
                                padding: 10
                            }}>
                                <AntDesign name="ellipsis1" size={24} color="black" />
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>,
        ]
    }

    return (
        <View style={styles.container} >
            {
                eventosAnidados.length > 0 ?
                    <View style={styles.body}>
                        <Text style={styles.header}>{eventosAnidados[0].tck_cliente}</Text>
                        <Text style={{
                            ...styles.header,
                            fontSize: 15,
                            }}>Ticket #{eventosAnidados[0].ticket_id}</Text>
                        <View style={styles.body1}>
                            <SafeAreaView>
                                <FlatList
                                    data={eventosAnidados}
                                    renderItem={_renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </SafeAreaView>
                        </View>
                        <View style={styles.body3}>
                            <TouchableOpacity style={styles.opacity}>
                                <Text style={styles.text4}>INGRESAR NUEVO OS AL TICKET</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    :
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
            }


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
        // paddingTop: 20,
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
    },
    text: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Roboto',
        marginLeft: 10
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Roboto',
        margin: 10
    },
});