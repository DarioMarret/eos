import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "@react-navigation/native"
import { GetEventos } from "../../service/OSevento"
import { useCallback, useState } from "react"
import db from "../../service/Database/model"
import Banner from "../../components/Banner"
import moment from "moment";

import calsync from '../../../assets/icons/cal-sync.png'
import calwait from '../../../assets/icons/cal-wait.png'
import calreq from '../../../assets/icons/cal-req.png'
import calok from '../../../assets/icons/cal-ok.png'
import { ticketID } from "../../utils/constantes"
import { getOrdenServicioAnidadas } from "../../service/OrdenServicioAnidadas"



export default function Manana(props) {
    const { navigation } = props

    const [eventos, setEventos] = useState([]);
    const [typeCalentar, setTypeCalendar] = useState(1)
    const [bg, setBg] = useState("")
    const [time, setTime] = useState(false)
    const [loading, setLoading] = useState(false)


    useFocusEffect(
        useCallback(() => {
            (async () => {
                setLoading(true)
                var date = moment().add(1, "days").format('YYYY-MM-DD');
                const respuesta = await GetEventos(`${date}T00:00:00`)
                setEventos(respuesta)
                db.transaction(tx => {
                    tx.executeSql(`SELECT * FROM equipoTicket`, [], (_, { rows }) => {
                        console.log("rows", rows._array)
                    })
                })

                setLoading(false)
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
        } else if (type === "PROCESO") {
            return "#FFFFFF"
        } else if (type === "FINALIZADO") {
            return "#E2FAE0"
        } else {
            return "#FFFFFF"
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
                <TouchableOpacity onPress={() => Ordene(String(item.ticket_id))}>
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
                <ActivityIndicator
                    animating={loading}
                    color="#FF6B00"
                    size="large"
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        alignItems: 'center',
                    }}
                />
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
                setTime={setTime}
                times={time}
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
