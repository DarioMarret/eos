import { GetEventosByTicket, GetEventosDelDia } from "../service/OSevento";
import { OrdenServicioAnidadas } from "../service/OrdenServicioAnidadas";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { EquipoTicket } from "../service/equipoTicketID";
import NetInfo from '@react-native-community/netinfo';
import { Fontisto } from '@expo/vector-icons';
import React, { useState } from "react";
import moment from "moment";
import { time, TrucateUpdate } from "../service/CargaUtil";
import { HistorialEquipoIngeniero } from "../service/historiaEquipo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OS, ticketID } from "../utils/constantes";

import { Network } from "../service/Network";


export default function Banner(props) {
    const { navigation, setTime, times } = props

    const [update, setupdate] = useState(false)
    const [message, setMessage] = useState("Actualizando...")

    async function ActualizarEventos() {
        (console.log(await Network()))
        if(Network()){
            Alert.alert("Recomendación", "Estar conectado a una red Wifi segura o tener una conexión estable.", [
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
        }else{
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
        if (respuesta) {
            setupdate(false)
            setTime(!times)
        } else {
            setMessage("Sin conexión a internet")
            setupdate(true)
            setTimeout(() => {
                setupdate(false)
            }, 2000)
        }
    }


    async function Sincronizar() {
        return new Promise((resolve, reject) => {
            NetInfo.fetch().then(state => {
                if (state.isConnected === true) {
                    (async () => {
                        await TrucateUpdate()
                        time(1500)
                        await HistorialEquipoIngeniero()
                        await time(1000)
                        await GetEventosDelDia()
                        var ayer = moment().add(-1, 'days').format('YYYY-MM-DD');
                        var hoy = moment().format('YYYY-MM-DD');
                        var manana = moment().add(1, 'days').format('YYYY-MM-DD');
                        const ticket_id = await GetEventosByTicket(ayer, hoy, manana)
                        ticket_id.map(async (r) => {
                            await EquipoTicket(r.ticket_id)
                            await OrdenServicioAnidadas(r.evento_id)
                        })
                        resolve(true)
                    })()
                } else {
                    resolve(false)
                }
            })
        })
    }
    const CrearNuevoOrdenServicioSinTiket = async () => {
        await AsyncStorage.removeItem(ticketID)
        await AsyncStorage.setItem(ticketID, JSON.stringify({
            ticket_id: null,
            equipo: null,
            OrdenServicioID: null,
            OSClone: null,
            Accion: "OrdenSinTicket"
        }))
        await AsyncStorage.setItem("OS", JSON.stringify(OS))
        navigation.navigate("Ordenes")
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