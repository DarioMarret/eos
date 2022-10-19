import { GetEventosByTicket, GetEventosDelDia } from "../service/OSevento";
import { OrdenServicioAnidadas } from "../service/OrdenServicioAnidadas";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EquipoTicket } from "../service/equipoTicketID";
import { Fontisto } from '@expo/vector-icons';
import React, { useState } from "react";
import moment from "moment";
import { time, TrucateUpdate } from "../service/CargaUtil";
import { HistorialEquipoIngeniero } from "../service/historiaEquipo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OS, ticketID } from "../utils/constantes";

import { PostOS } from "../service/OS";
import { useIsConnected } from 'react-native-offline';
import { BuscarOrdenServicioLocales, RestablecerLocalStore } from "../service/ServicioLoca";
import { useSelector, useDispatch } from "react-redux"
import { getEventosByDate, listarEventoAyer, listarEventoHoy, listarEventoMnn, loadingCargando } from "../redux/sincronizacion";
import { resetFormularioTool } from "../redux/formulario";

export default function Banner(props) {
    const { navigation, setTime, times } = props

    const [update, setupdate] = useState(false)
    const [message, setMessage] = useState("Actualizando...")
    const isConnected = useIsConnected();


    const dispatch = useDispatch()

    async function Dispatcher() {
        var hoy = moment().format('YYYY-MM-DD')
        var ayer = moment().add(-1,'days').format('YYYY-MM-DD')
        var mnn = moment().add(1,'days').format('YYYY-MM-DD')
        const promisa_hoy = dispatch(getEventosByDate(`${hoy}T00:00:00`))
        promisa_hoy.then((res) => {
            if (res.payload.length > 0) {
                dispatch(listarEventoHoy(res.payload))
            }
        })
        const promisa_ayer = dispatch(getEventosByDate(`${ayer}T00:00:00`))
        promisa_ayer.then((res) => {
            if (res.payload.length > 0) {
                dispatch(listarEventoAyer(res.payload))
            }
        })
        const promisa_mnn = dispatch(getEventosByDate(`${mnn}T00:00:00`))
        promisa_mnn.then((res) => {
            if (res.payload.length > 0) {
                dispatch(listarEventoMnn(res.payload))
            }
        })
    }


    async function ActualizarEventos() {
        if (isConnected) {
            Alert.alert("Recomendación", "Debe estar conectado a una red de internet o datos estable.", [
                {
                    text: "OK",
                    onPress: () => UP(),
                    style: { color: "#FF6B00" },
                },
                {
                    text: "Cancelar",
                    onPress: () => console.log("hola Mundo"),
                    style: { color: "#FF6B00" },
                }
            ])
        } else {
            Alert.alert("Error", "No tienes conexión a internet", [
                {
                    text: "OK",
                    onPress: () => console.log("hola Mundo"),
                    style: { color: "#FF6B00" },
                },
            ])
        }
    }
    
    async function UP() {
        setupdate(true)
        const respuesta = await Sincronizar()
        await Dispatcher()
        if (respuesta) {
            setupdate(false)
            setTime(!times)
        } else {
            setupdate(true)
            setupdate(false)
        }
    }


    async function Sincronizar() {
        if (isConnected) {
            try {
                dispatch(loadingCargando(true))
                const res = await BuscarOrdenServicioLocales()
                if (res) {
                    Alert.alert("Informacion", "Se incontraron cambios locales se subiran estos cambios")
                    await UpdateLocal()
                    await TrucateUpdate()
                    await HistorialEquipoIngeniero()
                    await GetEventosDelDia()
                    var ayer = moment().add(-1, 'days').format('YYYY-MM-DD');
                    var hoy = moment().format('YYYY-MM-DD');
                    var manana = moment().add(1, 'days').format('YYYY-MM-DD');
                    const ticket_id = await GetEventosByTicket(ayer, hoy, manana)
                    ticket_id.map(async (r) => {
                        await EquipoTicket(r.ticket_id)
                        await OrdenServicioAnidadas(r.evento_id)
                    })
                    dispatch(loadingCargando(false))
                } else {
                    await TrucateUpdate()
                    await HistorialEquipoIngeniero()
                    await GetEventosDelDia()
                    var ayer = moment().add(-1, 'days').format('YYYY-MM-DD');
                    var hoy = moment().format('YYYY-MM-DD');
                    var manana = moment().add(1, 'days').format('YYYY-MM-DD');
                    const ticket_id = await GetEventosByTicket(ayer, hoy, manana)
                    ticket_id.map(async (r) => {
                        await EquipoTicket(r.ticket_id)
                        await OrdenServicioAnidadas(r.evento_id)
                    })
                    dispatch(loadingCargando(false))
                }
            } catch (error) {
                console.log(error)
                dispatch(loadingCargando(false))
            }
        }
    }

    const CrearNuevoOrdenServicioSinTiket = async () => {
        await AsyncStorage.removeItem(ticketID)
        await AsyncStorage.setItem(ticketID, JSON.stringify({
            ticket_id: null,
            equipo: null,
            OrdenServicioID: 0,
            OSClone: null,
            Accion: "OrdenSinTicket"
        }))
        dispatch(resetFormularioTool())
        navigation.navigate("Ordenes")
    }

    const UpdateLocal = async () => {
        const res = await BuscarOrdenServicioLocales()
        if (res) {
            for (let index = 0; index < res.length; index++) {
                let el = res[index];
                if(el.OrdenServicioID == el.evento_id){
                    var OS_PartesRepuestos = JSON.parse(el.OS_PartesRepuestos)
                    for (let index = 0; index < OS_PartesRepuestos.length; index++) {
                        OS_PartesRepuestos[index].OrdenServicioID = 0
                    }
                    var OS_Tiempos = JSON.parse(el.OS_Tiempos)
                    for (let index = 0; index < OS_Tiempos.length; index++) {
                        OS_Tiempos[index].OrdenServicioID = 0
                    }
                    var OS_Firmas = JSON.parse(el.OS_Firmas)
                    for (let index = 0; index < OS_Firmas.length; index++) {
                        OS_Firmas[index].OrdenServicioID = 0
                    }
                    var OS_CheckList = JSON.parse(el.OS_CheckList)
                    for (let index = 0; index < OS_CheckList.length; index++) {
                        OS_CheckList[index].OrdenServicioID = 0
                    }
                    el.ticket_id = 0
                    el.OrdenServicioID = 0
                    el.evento_id = 0
                    delete el.OS_Anexos
                    delete el.OS_Colaboradores
                    delete el.OS_Encuesta
    
                    el.OS_PartesRepuestos = OS_PartesRepuestos
                    el.OS_Tiempos = OS_Tiempos
                    el.OS_Firmas = OS_Firmas
                    el.OS_CheckList = OS_CheckList
    
                    let P = await PostOS(el)
                    console.log("P", P)                
                }else{
                    var OS_PartesRepuestos = JSON.parse(el.OS_PartesRepuestos)
                    var OS_Tiempos = JSON.parse(el.OS_Tiempos)
                    var OS_Firmas = JSON.parse(el.OS_Firmas)
                    var OS_CheckList = JSON.parse(el.OS_CheckList)
                    delete el.OS_Anexos
                    delete el.OS_Colaboradores
                    delete el.OS_Encuesta
                    el.OS_PartesRepuestos = OS_PartesRepuestos
                    el.OS_Tiempos = OS_Tiempos
                    el.OS_Firmas = OS_Firmas
                    el.OS_CheckList = OS_CheckList
                    let P = await PostOS(el)
                    console.log("P", P) 
                }
            }

            return true
        } else {
            return true
        }
    }


    return (
        <>
            <View style={styles.circlePrimary}>
                <View style={styles.circleSecond}>
                    <TouchableOpacity
                        style={{
                            ...styles.circleTercer,
                            opacity: 1,
                        }}

                        onPress={() => CrearNuevoOrdenServicioSinTiket()}>
                        <Text style={{ color: "#FFF", fontSize: 30 }}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ ...styles.banner, paddingLeft: 20 }}>
                <TouchableOpacity
                // onPress={Dispatcher}
                    onPress={ActualizarEventos}
                >
                    <Fontisto name="cloud-refresh" size={25} color={!update ? "#FFF" : "#099E15"} />
                    {
                        update ? <Text
                            style={{
                                color: !update ? "#FFF" : "#099E15",
                                fontSize: 10,
                            }}
                        >{message}</Text> : null
                    }

                </TouchableOpacity>
                {/* {
                    isOFFLINE ? 
                    <Text style={{ color: "#FFF", fontSize: 10, marginLeft: 10 }}>Modo Online</Text> 
                    :<Text style={{ color: "#FFF", fontSize: 10, marginLeft: 10 }}>Modo Offline</Text> 
                } */}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    banner: {
        width: "100%",
        height: "12%",
        backgroundColor: '#EA0029',
        position: 'relative',
        flexDirection: 'row',
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 10,
    },
    circlePrimary: {
        width: "100%",
        height: "10%",
        // backgroundColor: '#E0E16C',
        justifyContent: 'center',
        alignItems: 'flex-end',
        position: 'absolute',
        bottom: "10%",
        left: -10,
        zIndex: 1,
    },
    circleSecond: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFF',
        marginEnd: 20,
        zIndex: 2,
        top: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        // bottom: 0,
    },
    circleTercer: {
        width: 90,
        height: 90,
        borderRadius: 50,
        backgroundColor: '#000',
        marginEnd: 20,
        zIndex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
})