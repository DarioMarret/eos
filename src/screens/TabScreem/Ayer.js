import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Banner from "../../components/Banner";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { GetEventos, GetEventosByTicket, GetEventosDelDia } from "../../service/OSevento";
import moment from "moment";


import calreq from '../../../assets/icons/cal-req.png';
import calok from '../../../assets/icons/cal-ok.png';
import calsync from '../../../assets/icons/cal-sync.png';
import calwait from '../../../assets/icons/cal-wait.png';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OS, ticketID } from "../../utils/constantes";
import { EquipoTicket } from "../../service/equipoTicketID";
import db from "../../service/Database/model";
import { getOrdenServicioAnidadas, OrdenServicioAnidadas } from "../../service/OrdenServicioAnidadas";
import LoadingActi from "../../components/LoadingActi";
import { SelectOSOrdenServicioID } from "../../service/OS_OrdenServicio";
import { ParseOS } from "../../service/OS";
import { isChecked } from "../../service/historiaEquipo";
import { time } from "../../service/CargaUtil";



export default function Ayer(props) {
    const { navigation } = props;
    const [eventos, setEventos] = useState([]);
    const [typeCalentar, setTypeCalendar] = useState(1)
    const [bg, setBg] = useState("")
    const [times, setTime] = useState(false)

    const [loading, setLoading] = useState(false)

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setLoading(true)
                await GetEventosDelDia()
                var date = moment().add(-1, "days").format('YYYY-MM-DD');
                const respuesta = await GetEventos(`${date}T00:00:00`)
                setEventos(respuesta)
                const ticket_id = await GetEventosByTicket()
                ticket_id.map(async (r) => {
                    await EquipoTicket(r.ticket_id)
                    await OrdenServicioAnidadas(r.evento_id)
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
    async function Ordene(ticket_id, estado) {
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
                                // Rutes(rows._array, ticket_id, JSON.parse(rows._array[0].historial)[0].OrdenServicioID, estado)
                                Rutes(rows._array, ticket_id, null, estado)
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

    async function Rutes(equipo, ticket_id, OrdenServicioID, estado) {
        console.log("estado", estado)
        console.log("ticket_id", ticket_id)
        console.log("OrdenServicioID", OrdenServicioID)
        if (equipo.length != 0) {
            // equipo[0]['isChecked'] = 'true'
            await AsyncStorage.removeItem(ticketID)
            OS.ticket_id = ticket_id
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
                <TouchableOpacity onPress={() => Ordene(String(item.ticket_id), item.ev_estado)}>
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
                times={times}
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
