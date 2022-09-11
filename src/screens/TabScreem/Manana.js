import { FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Banner from "../../components/Banner";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { GetEventos, GetEventosByTicket } from "../../service/OSevento";
import moment from "moment";

import calreq from '../../../assets/icons/cal-req.png';
import calok from '../../../assets/icons/cal-ok.png';
import calsync from '../../../assets/icons/cal-sync.png';
import calwait from '../../../assets/icons/cal-wait.png';
import { EquipoTicket } from "../../service/equipoTicketID";
import { ticketID } from "../../utils/constantes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import db from "../../service/Database/model";



export default function Manana(prop) {
    const { navigation } = prop

    const [eventos, setEventos] = useState([]);
    const [typeCalentar, setTypeCalendar] = useState(1)
    const [bg, setBg] = useState("")

    useFocusEffect(
        useCallback(() => {
            (async () => {
                var date = moment().add(1, "days").format('YYYY-MM-DD');
                const respuesta = await GetEventos(`${date}T00:00:00`)
                setEventos(respuesta)
                db.transaction(tx => {
                    tx.executeSql(`SELECT * FROM equipoTicket`, [], (_, { rows }) => {
                        console.log("rows", rows._array)
                    })
                })
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

    async function Ordene(ticket_id) {
        try {
            db.transaction(tx => {
                tx.executeSql(`SELECT * FROM equipoTicket where ticket_id = ?`, [ticket_id], (_, { rows }) => {
                    console.log("id_equipo-->", rows._array)
                    // db.transaction(tx => {
                    //     tx.executeSql(`SELECT * FROM historialEquipo where equipo_id = ?`, [rows._array[0].id_equipo], (_, { rows }) => {
                    //         console.log("row", rows._array.length)
                    //         if(rows._array.length === 0){
                    //             Rutes(null, ticket_id)
                    //         }
                    //         if (rows._array.length > 0) {
                    //             Rutes(rows._array[0].id_equipo, ticket_id)
                    //             navigation.navigate("Ordenes")
                    //         }
                    //     })
                    // })
                })
            })
        } catch (error) {
            console.log("error", error)
        }
    }

    async function Rutes(equipo, ticket_id) {
        if (equipo) {
            await AsyncStorage.removeItem(ticketID)
            await AsyncStorage.setItem(ticketID, JSON.stringify({ ticket_id, equipo }))
            navigation.navigate("Ordenes")
        }

        if (equipo == null) {
            await AsyncStorage.removeItem(ticketID)
            await AsyncStorage.setItem(ticketID, JSON.stringify({ ticket_id, equipo }))
            navigation.navigate("Ticket")
        }
    }

    function _renderItem({ item, index }) {
        return [
            <View key={index}>
                <TouchableOpacity onPress={() => Ordene(String(item.ticket_id))}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: item.ev_estado == "PENDIENTE" ? "#FFECDE" : bg,
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

                        <View style={styles.calendar}>
                            <Text>{moment().format(item.ev_horaAsignadaDesde).substring(0, 5)}</Text>
                            <Image source={typeImage()} style={{ width: 30, height: 30 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>,
        ]
    }

    return (
        <View style={styles.container}>
            <View style={{ ...styles.flexlist, marginTop: "10%" }}>
                <SafeAreaView>
                    <FlatList
                        data={eventos}
                        renderItem={_renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </SafeAreaView>
            </View>
            <Banner
                navigation={navigation}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    consult: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFECDE',
        width: '100%',
        minHeight: 100,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: '#858583',
    },
    calendar: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    flexlist: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
