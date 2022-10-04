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
import LoadingActi from "../../components/LoadingActi"
import useUser from "../../hook/useUser"
import { ConsultarFechaUltimaActualizacion } from "../../service/config"
import { SelectOSOrdenServicioID } from "../../service/OS_OrdenServicio"
import { ParseOS } from "../../service/OS"



export default function Manana(props) {
    const { navigation } = props

    const [eventos, setEventos] = useState([]);
    const [typeCalentar, setTypeCalendar] = useState(1)
    const [bg, setBg] = useState("")
    const [time, setTime] = useState(false)
    const [loading, setLoading] = useState(false)


    const { isOFFLINE, setreloadInt, reloadInt } = useUser()

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setreloadInt(!reloadInt)
                console.log("OFFLINE-->", isOFFLINE)
                setLoading(true)
                let updateMinuto = await ConsultarFechaUltimaActualizacion()
                var date = moment().add(1,'days').format('YYYY-MM-DD');
                const respuesta = await GetEventos(`${date}T00:00:00`)
                setEventos(respuesta)
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

    /**
     * 
     * @param {*} ticket_id 
     * @param {*} evento_id 
     * @param {*} estado 
     * @param {*} OrdenServicioID 
     */
    async function Ordene(ticket_id, evento_id, estado, OrdenServicioID) {
        setLoading(true)
        console.log("ticket_id", ticket_id)
        console.log("estado", estado)
        try {
            const anidada = await getOrdenServicioAnidadas(ticket_id)
            if (anidada == null) {
                console.log("no hay anidadas")
                db.transaction(tx => {
                    tx.executeSql(`SELECT * FROM equipoTicket where ticket_id = ?`, [ticket_id], (_, { rows }) => {
                        console.log("id_equipo-->", rows._array[0].id_equipo)
                        db.transaction(tx => {
                            tx.executeSql(`SELECT * FROM historialEquipo where equipo_id = ?`, [rows._array[0].id_equipo], (_, { rows }) => {
                                // console.log("equipo selecionado hoy row", rows._array)
                                console.log("equipo selecionado hoy row", JSON.parse(rows._array[0].historial)[0].OrdenServicioID)
                                Rutes(rows._array, ticket_id, evento_id, OrdenServicioID, estado)
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

    /**
     * 
     * @param {*} equipo 
     * @param {*} ticket_id 
     * @param {*} evento_id 
     * @param {*} OrdenServicioID 
     * @param {*} estado 
     */
    async function Rutes(equipo, ticket_id, evento_id, OrdenServicioID, estado) {
        try {
            console.log("estado", estado)
            console.log("ticket_id", ticket_id)
            console.log("evento_id", evento_id)
            console.log("OrdenServicioID", OrdenServicioID)
            if (equipo.length != 0) {
                await AsyncStorage.removeItem(ticketID)
                const OS = await SelectOSOrdenServicioID(OrdenServicioID)
                let parse = await ParseOS(OS, estado)
                console.log("OS", parse)
                parse.ticket_id = ticket_id
                parse.evento_id = evento_id
                await AsyncStorage.setItem("OS", JSON.stringify(OS))
                await AsyncStorage.setItem(ticketID, JSON.stringify({
                    ticket_id,
                    equipo,
                    OrdenServicioID: OrdenServicioID,
                    OSClone: null,
                    Accion: estado
                }))
                await isChecked(equipo[0].equipo_id)
                time(800)
                setLoading(false)
                navigation.navigate("Ordenes")
            }

            if (equipo.length == 0) {
                await AsyncStorage.removeItem(ticketID)
                await AsyncStorage.setItem(ticketID, JSON.stringify({ ticket_id }))
                setLoading(false)
                navigation.navigate("Ticket")
            }
        } catch (error) {
            console.log("error", error)
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
                    onPress={() => Ordene(String(item.ticket_id), String(item.evento_id), item.ev_estado, item.OrdenServicioID)}>

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
                <LoadingActi loading={loading} />
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
