import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import BannerOrderServi from "../../components/BannerOrdenServ";
import { getEquipoTicketStorage } from "../../service/equipoTicketID";
import { getIngenierosStorageById } from "../../service/ingenieros";
import { getToken } from "../../service/usuario";
import { CLIENTE_, ticketID } from "../../utils/constantes";
import moment from "moment";
import { GetClienteCustimerName } from "../../service/clientes";
import { getProvinciasStorageBy } from "../../service/provincias";
import { CambieEstadoSwitch, EstadoSwitch, ListaDiagnostico } from "../../service/config";
import db from "../../service/Database/model";
import { datosClienteOSOrdenServicioID } from "../../service/OS_OrdenServicio";


export default function Cliente(props) {
    const { navigation } = props
    const [isEnabled, setIsEnabled] = useState(false);
    const [isdisabelsub, setDisableSub] = useState(true)

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [ingeniero, setIngeniero] = useState({
        IdUsuario: "",
        NombreUsuario: "",
        adicional: "",
    })

    const [fecha, setFecha] = useState(moment().format('YYYY/MM/DD'))

    const [equipoTicket, setEquipoTicket] = useState({
        CodigoEquipoCliente: "",
        con_ClienteNombre: "",
        ticket_id: "",
        id_contrato: "",
        id_equipo: "",
        codOS: "",
        Estado: "",
    })

    const [cliente, setCliente] = useState({
        CantonID: "",
        CustomerID: "",
        CustomerName: "",
        Direccion: "",
        ProvinciaID: "",
        Sucursal: "",
        grupo: "",
    })


    const [direccion, setDireccion] = useState({
        CantonID: "",
        Direccion: "",
        ProvinciaID: "",
        SucursalID: "",
        SucursalNombre: "",
    })

    const [provincia, setProvincia] = useState({
        descripcion: "",
        id: "",
    })

    const SwitchGuardar = async () => {
        setIsEnabled(!isEnabled)
        if (isEnabled) {
            let estado = await CambieEstadoSwitch(1, 1)
            console.log("estado", estado.estado)
            await AsyncStorage.setItem(CLIENTE_, JSON.stringify({
                ...cliente,
                ...equipoTicket,
                ...direccion,
                ...provincia,
                ...ingeniero
            }))
            console.log("ClienSwitch", await AsyncStorage.setItem("ClienSwitch:", JSON.stringify(false)))
        } else {
            let estado = await CambieEstadoSwitch(1, 0)

            console.log("estado", estado.estado)
        }
    }


    useFocusEffect(
        useCallback(() => {
            (async () => {
                try {

                    const { userId } = await getToken()
                    const ingeniero = await getIngenierosStorageById(userId)
                    console.log("ingeniero", ingeniero)
                    setIngeniero(ingeniero)
                    console.log("EstadoSwitch", await EstadoSwitch(1))
                    let est = await EstadoSwitch(1)
                    if (est.estado == 1) {
                        setIsEnabled(true)
                    } else {
                        setIsEnabled(false)
                    }
                    const itenSelect = await AsyncStorage.getItem(ticketID)
                    if (itenSelect !== null) {
                        const item = JSON.parse(itenSelect)
                        console.log("item", item)
                        const { ticket_id, equipo, OrdenServicioID } = item
                        if (OrdenServicioID !== null) {
                            setDisableSub(false)
                            setIsEnabled(false)
                            var datosClient = await datosClienteOSOrdenServicioID(OrdenServicioID)
                            datosClient.map((item) => {
                                setCliente({
                                    ...cliente,
                                    CustomerName: item.ClienteNombre,
                                })
                                setDireccion({
                                    ...direccion,
                                    Direccion: item.Direccion,
                                })
                                setProvincia({
                                    ...provincia,
                                    descripcion: item.Ciudad,
                                })
                                setEquipoTicket({
                                    ...equipoTicket,
                                    id_contrato: item.contrato_id,
                                    id_equipo: item.equipo_id,
                                    codOS: item.codOS,
                                    ticket_id: item.ticket_id,
                                    Estado: item.Estado,
                                    CodigoEquipoCliente: item.CodigoEquipoCliente,
                                })
                                setFecha(item.FechaCreacion.split("T")[0])

                            })
                            console.log(await datosClienteOSOrdenServicioID(OrdenServicioID))


                            return

                        }


                        const ticket = await getEquipoTicketStorage(ticket_id)
                        // return
                        setEquipoTicket(ticket)
                        // console.log("ticket", ticket)
                        let cliente = await GetClienteCustimerName(ticket.con_ClienteNombre)
                        setCliente(cliente[0])
                        let n_direccion = JSON.parse(cliente[0].Sucursal).length - 1
                        let direccion = JSON.parse(cliente[0].Sucursal)[n_direccion]
                        setDireccion(direccion)
                        console.log("direccion", direccion.ProvinciaId)
                        const pro = await getProvinciasStorageBy(direccion.ProvinciaId)
                        setProvincia(pro[0])
                    }
                    let swit = JSON.parse(await AsyncStorage.getItem("ClienSwitch:"))
                    setIsEnabled(swit)
                    console.log("ClienSwitch:", JSON.parse(await AsyncStorage.getItem("ClienSwitch:")))
                } catch (error) {
                    console.log("error", error)
                }
            })()
        }, [])
    )

    return (
        <View style={styles.container}>

            <View style={styles.ContenedorCliente}>
                <ScrollView
                    style={{
                        width: "100%",
                    }}
                >
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: "100%",
                        marginTop: 10,
                        backgroundColor: "#F5F5F5",
                        paddingVertical: 10,
                        borderRadius: 10,
                    }}>

                        <View>
                            <Text style={styles.text}>OS: {equipoTicket.codOS}</Text>
                            <Text style={styles.text}>Ticket: {equipoTicket.ticket_id}</Text>
                            <Text style={styles.text}>Estado: {equipoTicket.Estado}</Text>
                        </View>
                        <View>
                            <Text style={styles.text}>Contrato: {equipoTicket.id_contrato}</Text>
                            <Text style={styles.text}>Fecha Crea.: {fecha}</Text>
                            <Text style={styles.text}>Ingeniero: {ingeniero.NombreUsuario}</Text>
                        </View>

                    </View>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#FF6B00",
                        marginTop: "5%",
                        marginLeft: "5%",
                    }}>Datos del Cliente</Text>

                    <View style={styles.ContainerInputs}>
                        <TextInput
                            style={styles.input}
                            placeholder="Cliente"
                            value={cliente.CustomerName}
                            onChangeText={(text) => setCliente({ ...cliente, CustomerName: text })}
                            editable={isEnabled}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Código equipo cliente"
                            value={equipoTicket.id_equipo}
                            onChangeText={(text) => setEquipoTicket({ ...equipoTicket, id_equipo: text })}
                            editable={isEnabled}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Dirección"
                            value={direccion.Direccion}
                            onChangeText={(text) => setDireccion({ ...direccion, Direccion: text })}
                            editable={isEnabled}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Ciudad"
                            value={provincia.descripcion}
                            onChangeText={(text) => setProvincia({ ...provincia, descripcion: text })}
                            editable={isEnabled}
                        />
                        <View style={{
                            ...styles.wFull,
                            height: 60,
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                        }}>
                            {
                                isdisabelsub ?
                                    <>
                                        {
                                            isEnabled ?
                                                <Text style={{ fontSize: 16, marginRight: 4 }}>Editable:</Text>
                                                : <Text style={{ fontSize: 16, marginRight: 4 }}>Guardado:</Text>
                                        }
                                        <Switch
                                            trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
                                            thumbColor={isEnabled ? "#FF6B00" : "#ffffff"}
                                            ios_backgroundColor="#FFAF75"
                                            onValueChange={SwitchGuardar}
                                            value={isEnabled}
                                        />
                                    </>
                                    : null
                            }
                        </View>
                    </View>
                </ScrollView>

            </View>
            <BannerOrderServi
                {...props}
                navigation={navigation}
                screen={"2-CLIENTE"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    ContenedorCliente: {
        flex: 1,
        top: "5%",
        width: "100%",
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    ContainerInputs: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: 10,
        height: "20%",
        width: "100%",
    },
    input: {
        borderWidth: 1,
        borderColor: '#CECECA',
        width: "100%",
        height: 60,
        borderRadius: 10,
        padding: 10,
        marginBottom: "5%"
    },
    text: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#858583",
        marginTop: "5%",
        // marginLeft: "5%",
        marginHorizontal: "10%",
    }
});