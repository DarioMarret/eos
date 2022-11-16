import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getEquipoID, isChecked, isCheckedCancelar } from "../../service/historiaEquipo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ticketID } from "../../utils/constantes";
import db from "../../service/Database/model";
import Banner from "../../components/Banner";
import moment from "moment";

import calsync from '../../../assets/icons/cal-sync.png';
import calwait from '../../../assets/icons/cal-wait.png';
import calreq from '../../../assets/icons/cal-req.png';
import calok from '../../../assets/icons/cal-ok.png';
import LoadingActi from "../../components/LoadingActi";
import { ConsultaOSOrdenServicioID } from "../../service/OS_OrdenServicio";
import { useSelector, useDispatch } from "react-redux"
import { listarEventoHoy, getEventosByDate, loadingCargando } from "../../redux/sincronizacion";
import { actualizarClienteTool, actualizarDatosTool, resetFormularioTool, setAdjuntosTool, setChecklistTool, setClienteTool, setComponenteTool, setdatosTool, setEquipoTool, setFirmasTool, setOrdenServicioID, setTiemposTool } from "../../redux/formulario";

export default function Hoy(props) {
    const [eventos, setEventos] = useState([]);
    const [typeCalentar, setTypeCalendar] = useState(1)
    const [bg, setBg] = useState("")
    const [times, setTime] = useState(false)
    const { navigation } = props

    const Events = useSelector(s => s.sincronizacion)

    const dispatch = useDispatch()
    useFocusEffect(
        useCallback(() => {
            setEventos([])
            setEventos(Events.eventos_hoy)
            dispatch(resetFormularioTool())
            return () => {
                setEventos([])
            }
        }, [Events.eventos_hoy])
    )

    useFocusEffect(
        useCallback(() => {
            (async () => {
                try {
                    await AsyncStorage.setItem("SCREMS", "Hoy")
                    dispatch(loadingCargando(true))
    
                    db.transaction(tx => {
                        tx.executeSql(
                            `SELECT OS_Anexos FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                            [10224],
                            (tx, results) => {
                                const { rows } = results
                                if (rows.length > 0) {
                                    console.log("results.rows.length", rows._array[0])
                                }else{
                                    console.log("results.rows.length", 0)
                                }
                            }
                        )
                    })
    
                    await isCheckedCancelar()
                    var date = moment().format('YYYY-MM-DD');
                    const promisa = dispatch(getEventosByDate(`${date}T00:00:00`))
                    promisa.then((res) => {
                        res.payload.length > 0 ?
                            dispatch(listarEventoHoy(res.payload))
                            : null
                    })
                    dispatch(loadingCargando(false))
                } catch (error) {
                    console.log("error", error)
                    dispatch(loadingCargando(false))              
                }
            })()
        }, [])
    )

    // 01 09 solo llevan a la pantalla de ticket

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
     * @param {*} tck_tipoTicket 
     * @param {*} tipoIncidencia 
     * @param {*} tck_tipoTicketCod 
     */
    async function Ordene(ticket_id, evento_id, estado, OrdenServicioID, tck_tipoTicket, tipoIncidencia, tck_tipoTicketCod) {
        console.log("ticket_id", ticket_id)
        dispatch(loadingCargando(true))
        try {
            // const equipo = await getEquipoTicketStorage(ticket_id)
            // console.log("equipo", equipo)
            db.transaction(tx => {
                tx.executeSql(`SELECT * FROM equipoTicket WHERE ticket_id = ?`, [ticket_id], (_, { rows }) => {
                    db.transaction(tx => {
                        tx.executeSql(`SELECT * FROM historialEquipo WHERE equipo_id = ?`, [rows._array[0].id_equipo], (_, { rows }) => {
                            // console.log("equipo selecionado hoy row", rows._array)
                            Rutes(rows._array, ticket_id, evento_id, OrdenServicioID, estado, tck_tipoTicket, tipoIncidencia, tck_tipoTicketCod)
                        })
                    })
                })
            })
        } catch (error) {
            dispatch(loadingCargando(false))
            alert("Error al cargar los datos por favor intente nuevamente o sincronice")
            console.log("error", error)
        }
    }

    /**
     * @param {*} equipo 
     * @param {*} ticket_id 
     * @param {*} evento_id 
     * @param {*} OrdenServicioID 
     * @param {*} estado 
     * @param {*} tck_tipoTicket
     */
     async function Rutes(equipo, ticket_id, evento_id, OrdenServicioID, estado, tck_tipoTicket, tipoIncidencia, tck_tipoTicketCod, tck_cliente) {
        try {
            if (equipo.length > 0) {
                // console.log("equipo", equipo)
                console.log("estado", estado)
                console.log("ticket_id", ticket_id)
                console.log("evento_id", evento_id)
                console.log("OrdenServicioID", OrdenServicioID)
                console.log("tck_tipoTicket", tck_tipoTicket)
                console.log("tipoIncidencia", tipoIncidencia)
                console.log("tck_tipoTicketCod", tck_tipoTicketCod)
                console.log("tck_cliente", tck_cliente)
                
                try {
                    dispatch(resetFormularioTool())
                    if (OrdenServicioID != 0) {
                        if (tck_tipoTicketCod == "01" || tck_tipoTicketCod == "01") {
                            await AsyncStorage.removeItem(ticketID)
                            await AsyncStorage.setItem(ticketID, JSON.stringify({
                                ClienteID: tck_cliente,
                                evento_id,
                                ticket_id,
                                equipo,
                                OrdenServicioID,
                                Accion: estado,
                                tck_tipoTicket,
                                tipoIncidencia,
                                tck_tipoTicketCod,
                            }))
                            dispatch(loadingCargando(false))
                            navigation.navigate("Ticket")
                        } else {
                            const parse = await ConsultaOSOrdenServicioID(OrdenServicioID)
                            console.log("parse--->",parse)
                            await AsyncStorage.removeItem(ticketID)
                            console.log("parse", parse[0])
                            parse[0].ticket_id = ticket_id
                            parse[0].evento_id = evento_id
                            parse[0].tipoIncidencia = tipoIncidencia
                            parse[0].TipoVisita = tck_tipoTicketCod
                            parse[0].OrdenServicioID = OrdenServicioID
                            dispatch(setOrdenServicioID(OrdenServicioID))
                            dispatch(setEquipoTool(parse[0]))
                            dispatch(setClienteTool(parse[0]))
                            dispatch(setdatosTool(parse[0]))
                            dispatch(setComponenteTool(JSON.parse(parse[0].OS_PartesRepuestos)))
                            dispatch(setAdjuntosTool(JSON.parse(parse[0].OS_Anexos)))
                            dispatch(setTiemposTool(JSON.parse(parse[0].OS_Tiempos)))
                            dispatch(setFirmasTool(JSON.parse(parse[0].OS_Firmas)))
                            dispatch(setChecklistTool(JSON.parse(parse[0].OS_CheckList)))
                            dispatch(actualizarDatosTool({
                                name: 'tipoIncidencia',
                                value: tipoIncidencia
                            }))
                            dispatch(actualizarDatosTool({
                                name: 'TipoVisita',
                                value: tck_tipoTicketCod
                            }))
                            await AsyncStorage.setItem(ticketID, JSON.stringify({
                                ClienteID: parse[0].ClienteID,
                                evento_id,
                                ticket_id,
                                equipo,
                                OrdenServicioID,
                                Accion: estado,
                                tck_tipoTicket,
                                tipoIncidencia,
                                tck_tipoTicketCod,
                            }))
                            await isChecked(equipo[0].equipo_id)
                            dispatch(loadingCargando(false))
                            navigation.navigate("Ordenes")
                        }
                    } else {
                        dispatch(resetFormularioTool())
                        if (tck_tipoTicketCod == "01" || tck_tipoTicketCod == "01") {
                            await AsyncStorage.removeItem(ticketID)
                            await AsyncStorage.setItem(ticketID, JSON.stringify({
                                ClienteID: tck_cliente,
                                evento_id,
                                ticket_id,
                                equipo,
                                OrdenServicioID,
                                Accion: estado,
                                tck_tipoTicket,
                                tipoIncidencia,
                                tck_tipoTicketCod,
                            }))
                            dispatch(actualizarClienteTool({
                                name: 'ticket_id',
                                value: ticket_id
                            }))
                            dispatch(actualizarClienteTool({
                                name: 'evento_id',
                                value: evento_id
                            }))
                            dispatch(actualizarDatosTool({
                                name: 'tipoIncidencia',
                                value: tipoIncidencia
                            }))
                            dispatch(actualizarDatosTool({
                                name: 'TipoVisita',
                                value: tck_tipoTicketCod
                            }))
                            dispatch(setOrdenServicioID(OrdenServicioID))
                            dispatch(loadingCargando(false))
                            navigation.navigate("Ticket")
                        } else {
                            await AsyncStorage.removeItem(ticketID)
                            dispatch(actualizarClienteTool({
                                name: 'ticket_id',
                                value: ticket_id
                            }))
                            dispatch(actualizarClienteTool({
                                name: 'evento_id',
                                value: evento_id
                            }))
                            dispatch(actualizarDatosTool({
                                name: 'tipoIncidencia',
                                value: tipoIncidencia
                            }))
                            dispatch(actualizarDatosTool({
                                name: 'TipoVisita',
                                value: tck_tipoTicketCod
                            }))
                            dispatch(setOrdenServicioID(OrdenServicioID))
    
                            await AsyncStorage.setItem(ticketID, JSON.stringify({
                                ClienteID: tck_cliente,
                                evento_id,
                                ticket_id,
                                equipo,
                                OrdenServicioID,
                                Accion: estado,
                                tck_tipoTicket,
                                tipoIncidencia,
                                tck_tipoTicketCod,
                            }))
                            await isChecked(equipo[0].equipo_id)
                            dispatch(loadingCargando(false))
                            navigation.navigate("Ordenes")
                        }
                    }
                } catch (error) {
                    console.log("error", error)
                    dispatch(loadingCargando(false))
                }
            } else {
                Alert.alert("Error", "Equipo no se encuentra dentro de su base instalada Sincrónice nuevamente, si el problema persiste comuniquese con el administrador")
                dispatch(loadingCargando(false))
            }
        } catch (error) {
            console.log("error", error)
            dispatch(loadingCargando(false))            
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
                    onPress={() => Ordene(
                        String(item.ticket_id),
                        String(item.evento_id),
                        item.ev_estado,
                        item.OrdenServicioID,
                        item.tck_tipoTicket,
                        item.tipoIncidencia,
                        item.tck_tipoTicketCod
                    )}>

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
                <LoadingActi loading={Events.loading} />
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