import { Button, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActualizarFechaUltimaActualizacion, ConsultarFechaUltimaActualizacion } from "../../service/config";
import { OrdenServicioAnidadas, getOrdenServicioAnidadas } from "../../service/OrdenServicioAnidadas";
import { GetEventos, GetEventosByTicket, GetEventosDelDia } from "../../service/OSevento";
import { HistorialEquipoIngeniero } from "../../service/historiaEquipo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EquipoTicket } from "../../service/equipoTicketID";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import NetInfo from '@react-native-community/netinfo';
import { ticketID } from "../../utils/constantes";
import db from "../../service/Database/model";
import Banner from "../../components/Banner";
import moment from "moment";

import calsync from '../../../assets/icons/cal-sync.png';
import calwait from '../../../assets/icons/cal-wait.png';
import calreq from '../../../assets/icons/cal-req.png';
import calok from '../../../assets/icons/cal-ok.png';
import { RefresLogin } from "../../service/usuario";
import { OSOrdenServicioID } from "../../service/OS_OrdenServicio";

export default function Hoy(props) {
    const [eventos, setEventos] = useState([]);
    const [typeCalentar, setTypeCalendar] = useState(1)
    const [bg, setBg] = useState("")
    const { navigation } = props

    useFocusEffect(
        useCallback(() => {
            (async () => {
                let updateMinuto = await ConsultarFechaUltimaActualizacion()

                if (updateMinuto) {
                    NetInfo.fetch().then(state => {
                        if (state.isConnected === true) {
                            (async () => {
                                await RefresLogin()
                                await HistorialEquipoIngeniero();
                                await ActualizarFechaUltimaActualizacion()
                            })()
                        }
                    });
                }
                var date = moment().add(-1, 'days').format('YYYY-MM-DD');
                const respuesta = await GetEventos(`${date}T00:00:00`)
                setEventos(respuesta)

                NetInfo.fetch().then(state => {
                    if (state.isConnected === true) {
                        (async () => {
                            var ayer = moment().add(-1, 'days').format('YYYY-MM-DD');
                            var hoy = moment().format('YYYY-MM-DD');
                            var manana = moment().add(1, 'days').format('YYYY-MM-DD');
                            const ticket_id = await GetEventosByTicket(ayer, hoy, manana)
                            console.log("tickets", ticket_id)
                            ticket_id.map(async (r) => {
                                await EquipoTicket(r.ticket_id)
                                await OrdenServicioAnidadas(r.evento_id)
                            })
                            ticket_id.map(async (r) => {
                                if (r.OrdenServicioID != 0) {
                                    console.log("OrdenServicioID", r.OrdenServicioID)
                                    await OSOrdenServicioID(r.OrdenServicioID)
                                } else {
                                    console.log("OrdenServicioID Cero", r.OrdenServicioID)
                                }
                            })
                        })()
                    }
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
        console.log("ticket_id", ticket_id)
        try {
            const anidada = await getOrdenServicioAnidadas(ticket_id)
            if (anidada == null) {
                console.log("no hay anidadas")
                db.transaction(tx => {
                    tx.executeSql(`SELECT * FROM equipoTicket where ticket_id = ?`, [ticket_id], (_, { rows }) => {
                        console.log("id_equipo-->", rows._array[0].id_equipo)
                        db.transaction(tx => {
                            tx.executeSql(`SELECT * FROM historialEquipo where equipo_id = ?`, [rows._array[0].id_equipo], (_, { rows }) => {
                                console.log("equipo selecionado hoy row", rows._array)
                                Rutes(rows._array, ticket_id)
                            })
                        })
                    })
                })
            }
            if (anidada.length > 0) {
                console.log("hay anidadas")
                Rutes([], ticket_id)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    async function Rutes(equipo, ticket_id) {
        if (equipo.length != 0) {
            await AsyncStorage.removeItem(ticketID)
            await AsyncStorage.setItem(ticketID, JSON.stringify({ ticket_id, equipo }))
            navigation.navigate("Ordenes")
        }

        if (equipo.length == 0) {
            await AsyncStorage.removeItem(ticketID)
            await AsyncStorage.setItem(ticketID, JSON.stringify({ ticket_id }))
            navigation.navigate("Ticket")
        }
    }


    functionColor = (type) => {
        if (type === "PENDIENTE") {
            return "#FFECDE"
        } else if (type === "PROCESO") {
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

                        <View style={styles.calendar}>
                            <Image source={typeImage()} style={{ width: 30, height: 30 }} />
                            <Text
                                style={{
                                    fontSize: 10
                                }}
                            >{moment().format(item.ev_horaAsignadaDesde).substring(0, 5)} - {moment().format(item.ev_horaAsignadaHasta).substring(0, 5)}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
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
                {...props}
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