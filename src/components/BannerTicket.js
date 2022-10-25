import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Fontisto } from '@expo/vector-icons';
import { GetEventosByTicketHoy, GetEventosDelDia } from "../service/OSevento";
import moment from "moment";
import { DeleteAnidada, OrdenServicioAnidadas } from "../service/OrdenServicioAnidadas";
import { ticketID } from "../utils/constantes";
import { getAnidacionesTicket, listarTicket } from "../redux/sincronizacion";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function BannerTicket(props) {
    const { navigation } = props

    const [update, setupdate] = useState(false)


    const dispatch = useDispatch()

    async function ActualizarEventos() {
        var hoy = moment().format('YYYY-MM-DD');
        const ticket = await GetEventosByTicketHoy(hoy)
        // const ticket_id = await GetEventosByTicket(ayer, hoy, manana)
        let evento_id = []
        for (let index = 0; index < ticket.length; index++) {
            let item = ticket[index];
            evento_id.push(item.evento_id)
        }

        await DeleteAnidada(evento_id)
        //Para buscar eventos anidadas a la orden
        for (let index = 0; index < evento_id.length; index++) {
            let item = evento_id[index];
            await OrdenServicioAnidadas(item)
        }

        const { ticket_id } = JSON.parse(await AsyncStorage.getItem(ticketID))
        const promisa_anidacion = dispatch(getAnidacionesTicket(ticket_id))
        promisa_anidacion.then((res) => {
            if (res.payload.length > 0) {
                dispatch(listarTicket(res.payload))
            }
        })

    }

    return (
        <>
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
                        >Actualizando...</Text> : null
                    }

                </TouchableOpacity>
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