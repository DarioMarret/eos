import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native"
import { CambieEstadoSwitch, EstadoSwitch, ListaDiagnostico } from "../../service/config"
import { datosClienteOSOrdenServicioID } from "../../service/OS_OrdenServicio"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { getEquipoTicketStorage } from "../../service/equipoTicketID"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getIngenierosStorageById } from "../../service/ingenieros"
import { getProvinciasStorageBy } from "../../service/provincias"
import { GetClienteCustimerName, SelectCliente } from "../../service/clientes"
import BannerOrderServi from "../../components/BannerOrdenServ"
import { CLIENTE_, ticketID } from "../../utils/constantes"
import React, { useCallback, useState } from "react"
import { getToken } from "../../service/usuario"
import moment from "moment"
import PickerSelect from "../../components/PickerSelect"
import { AntDesign } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"


export default function Cliente(props) {
    const { navigation } = props
    const [isEnabled, setIsEnabled] = useState(false)
    const [isdisabelsub, setDisableSub] = useState(true)

    const [modalVisible, setModalVisible] = useState(false)
    const [check, setCheck] = useState(false)

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
        Sucursal: [],
        grupo: "",
        Ciudad: "",
    })

    console.log("cliente", cliente)

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

    const SwitchGuardar = async (estado) => {
        if (!estado) {
            await GuadadoOS()
            let estado = await CambieEstadoSwitch(1, 1)
            console.log("estado", estado.estado)
            await AsyncStorage.setItem(CLIENTE_, JSON.stringify({
                ...cliente,
                ...equipoTicket,
                ...direccion,
                ...provincia,
                ...ingeniero
            }))
            setIsEnabled(true)
        } else {
            setIsEnabled(false)
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
                        const { ticket_id, equipo, OrdenServicioID, OSClone, Accion } = item
                        console.log("item", Accion)
                        if (Accion == "FINALIZADO") {//para ver sin editar
                            setDisableSub(false)
                            setIsEnabled(false)
                            setCheck(true)
                            let clie = await SelectCliente(OSClone[0].ClienteID)
                            console.log("cliente CLONAR", JSON.parse(clie.Sucursal))
                            console.log("cliente CLONAR", typeof JSON.parse(clie.Sucursal))
                            setCliente({
                                ...cliente,
                                CustomerName: OSClone[0].ClienteNombre,
                                Sucursal: JSON.parse(clie.Sucursal),
                                Ciudad: OSClone[0].Ciudad,
                            })
                            setDireccion({
                                ...direccion,
                                Direccion: OSClone[0].Direccion,
                            })
                            setProvincia({
                                ...provincia,
                                descripcion: OSClone[0].Ciudad,
                            })
                            setEquipoTicket({
                                ...equipoTicket,
                                id_contrato: OSClone[0].contrato_id,
                                id_equipo: OSClone[0].equipo_id,
                                codOS: OSClone[0].codOS,
                                ticket_id: OSClone[0].ticket_id,
                                Estado: OSClone[0].Estado,
                                CodigoEquipoCliente: OSClone[0].CodigoEquipoCliente,
                            })
                            console.log(await datosClienteOSOrdenServicioID(OrdenServicioID))
                            setFecha(OSClone[0].FechaCreacion.split("T")[0])
                            return
                        } else if (Accion == "clonar") {// para ver y poder edidar una orden de servicio clone
                            let clie = await SelectCliente(OSClone[0].ClienteID)
                            console.log("cliente CLONAR", JSON.parse(clie.Sucursal))
                            console.log("cliente CLONAR", typeof JSON.parse(clie.Sucursal))
                            setCliente({
                                ...cliente,
                                CustomerName: OSClone[0].ClienteNombre,
                                Sucursal: JSON.parse(clie.Sucursal),
                                Ciudad: OSClone[0].Ciudad,
                            })
                            setDireccion({
                                ...direccion,
                                Direccion: OSClone[0].Direccion,
                            })
                            setProvincia({
                                ...provincia,
                                descripcion: OSClone[0].Ciudad,
                            })
                            setEquipoTicket({
                                ...equipoTicket,
                                id_contrato: OSClone[0].contrato_id,
                                id_equipo: OSClone[0].equipo_id,
                                codOS: OSClone[0].codOS,
                                ticket_id: OSClone[0].ticket_id,
                                Estado: OSClone[0].Estado,
                                CodigoEquipoCliente: OSClone[0].CodigoEquipoCliente,
                            })
                            setFecha(OSClone[0].FechaCreacion.split("T")[0])
                            return
                        } else if (Accion == "OrdenSinTicket") {
                            const os = await AsyncStorage.getItem("OS")
                            const osItem = JSON.parse(os)
                            console.log("osItem", osItem)
                            let clie = await SelectCliente(osItem.ClienteID)
                            console.log("cliente CLONAR", JSON.parse(clie.Sucursal))
                            console.log("cliente CLONAR", typeof JSON.parse(clie.Sucursal))
                            setCliente({
                                ...cliente,
                                CustomerName: osItem.ClienteNombre,
                                Sucursal: JSON.parse(clie.Sucursal),
                                Ciudad: osItem.Ciudad,
                            })
                            setDireccion({
                                ...direccion,
                                Direccion: osItem.Direccion,
                            })
                            setProvincia({
                                ...provincia,
                                descripcion: osItem.Ciudad,
                            })
                            setEquipoTicket({
                                ...equipoTicket,
                                id_contrato: osItem.contrato_id,
                                id_equipo: osItem.equipo_id,
                                codOS: osItem.codOS,
                                ticket_id: osItem.ticket_id,
                                Estado: osItem.Estado,
                                CodigoEquipoCliente: osItem.CodigoEquipoCliente,
                            })
                            setFecha(moment().format("YYYY-MM-DD"))
                            return
                        } else if (Accion == "PENDIENTE") {
                            // SelectCliente(CustomerID)
                            let clie = await SelectCliente(OSClone[0].ClienteID)
                            console.log("cliente PENDIENTE", JSON.parse(clie.Sucursal))
                            console.log("cliente PENDIENTE", typeof JSON.parse(clie.Sucursal))
                            setCliente({
                                ...cliente,
                                CustomerName: OSClone[0].ClienteNombre,
                                Sucursal: JSON.parse(clie.Sucursal),
                                Ciudad: OSClone[0].Ciudad,
                            })
                            setDireccion({
                                ...direccion,
                                Direccion: OSClone[0].Direccion,
                            })
                            setProvincia({
                                ...provincia,
                                descripcion: OSClone[0].Ciudad,
                            })
                            setEquipoTicket({
                                ...equipoTicket,
                                id_contrato: OSClone[0].contrato_id,
                                id_equipo: OSClone[0].equipo_id,
                                codOS: OSClone[0].codOS,
                                ticket_id: OSClone[0].ticket_id,
                                Estado: OSClone[0].Estado,
                                CodigoEquipoCliente: OSClone[0].CodigoEquipoCliente,
                            })
                            setFecha(OSClone[0].FechaCreacion.split("T")[0])
                            return
                        } else if (Accion == "NUEVO OS TICKET") {
                            const os = await AsyncStorage.getItem("OS")
                            const osItem = JSON.parse(os)
                            console.log("osItem", osItem)
                            let clie = await SelectCliente(osItem.ClienteID)
                            console.log("cliente CLONAR", JSON.parse(clie.Sucursal))
                            console.log("cliente CLONAR", typeof JSON.parse(clie.Sucursal))
                            setCliente({
                                ...cliente,
                                CustomerName: osItem.ClienteNombre,
                                Sucursal: JSON.parse(clie.Sucursal),
                                Ciudad: osItem.Ciudad,
                            })
                            setDireccion({
                                ...direccion,
                                Direccion: osItem.Direccion,
                            })
                            setProvincia({
                                ...provincia,
                                descripcion: osItem.Ciudad,
                            })
                            setEquipoTicket({
                                ...equipoTicket,
                                id_contrato: osItem.contrato_id,
                                id_equipo: osItem.equipo_id,
                                codOS: osItem.codOS,
                                ticket_id: osItem.ticket_id,
                                Estado: osItem.Estado,
                                CodigoEquipoCliente: osItem.CodigoEquipoCliente,
                            })
                            setFecha(moment().format("YYYY-MM-DD"))
                            return
                        }
                    }
                } catch (error) {
                    console.log("error", error)
                }
            })()
        }, [])
    )

    const GuadadoOS = async () => {
        const itenSelect = await AsyncStorage.getItem(ticketID)
        const it = JSON.parse(itenSelect)
        const { ticket_id, equipo, OrdenServicioID, OSClone, Accion } = it
        if (Accion == "clonar") {
            OSClone[0].ClienteNombre = cliente.CustomerName,
                OSClone[0].Direccion = direccion.Direccion,
                OSClone[0].Ciudad = provincia.descripcion,
                OSClone[0].contrato_id = equipoTicket.id_contrato,
                OSClone[0].equipo_id = equipoTicket.id_equipo,
                OSClone[0].codOS = equipoTicket.codOS,
                OSClone[0].ticket_id = equipoTicket.ticket_id,
                OSClone[0].Estado = equipoTicket.Estado,
                OSClone[0].CodigoEquipoCliente = equipoTicket.CodigoEquipoCliente,
                console.log("OSClone", OSClone)
            await AsyncStorage.setItem(ticketID, JSON.stringify({ ticket_id, equipo, OrdenServicioID, OSClone, Accion }))
        } else if (Accion == "OrdenSinTicket") {
            const os = await AsyncStorage.getItem("OS")
            const osItem = JSON.parse(os)
            osItem.Direccion = cliente.Direccion,
                await AsyncStorage.setItem("OS", JSON.stringify(osItem))
            console.log("osItem", osItem)
        }
    }
    const GuardarDireccion = async (value) => {
        const os = await AsyncStorage.getItem("OS")
        const osItem = JSON.parse(os)
        osItem.Direccion = value,
            await AsyncStorage.setItem("OS", JSON.stringify(osItem))
        console.log("osItem", osItem)
    }

    return (
        <View style={styles.container}>

            <View style={styles.ContenedorCliente}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
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
                        <View style={{
                            borderWidth: 1,
                            borderColor: "#CECECA",
                            width: "100%",
                            height: 60,
                            borderRadius: 10,
                            padding: 10,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 20,
                        }}>
                            <TextInput
                                style={{ width: "90%", height: "100%" }}
                                placeholder="Cliente"
                                value={cliente.CustomerName}
                                onChangeText={(text) => setCliente({ ...cliente, CustomerName: text })}
                                editable={isEnabled}
                            />
                            <AntDesign
                                onPress={() => setModalVisible(!modalVisible)}
                                name='search1'
                                size={24}
                                color='#000000'
                            />
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Código equipo cliente"
                            value={equipoTicket.id_equipo}
                            onChangeText={(text) => setEquipoTicket({ ...equipoTicket, id_equipo: text })}
                            editable={isEnabled}
                        />
                        <View
                            style={{
                                ...styles.input,
                                borderWidth: 1,
                                borderColor: '#CECECA',
                                width: "100%",
                                height: 60, borderRadius: 10, padding: 10, marginBottom: 20,
                            }}
                        >
                            <Picker
                                selectedValue={cliente.Direccion}
                                enabled={isEnabled}
                                onValueChange={(itemValue) => GuardarDireccion(itemValue)} >
                                {
                                    typeof cliente.Sucursal == 'object' ?
                                        cliente.Sucursal.map((item, index) => {
                                            return <Picker.Item key={index + 1} label={item.Direccion} value={item.Direccion} />
                                        })
                                        : null
                                }
                            </Picker>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Ciudad"
                            value={cliente.Ciudad}
                            onChangeText={(text) => setProvincia({ ...provincia, descripcion: text })}
                            editable={false}
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
                                check == false ?
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
                                                onValueChange={() => SwitchGuardar(isEnabled)}
                                                value={isEnabled}
                                            />
                                        </>
                                        : null
                                    : null
                            }
                        </View>
                    </View>
                </ScrollView>
            </View>
            <PickerSelect
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setCliente={setCliente}
            />
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