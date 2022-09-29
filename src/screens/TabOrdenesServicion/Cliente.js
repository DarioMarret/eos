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
import LoadingActi from "../../components/LoadingActi"


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

    const [loading, setLoading] = useState(false)

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

    async function getCliente() {
        const os = await AsyncStorage.getItem("OS")
        const osItem = JSON.parse(os)
        console.log("osItem", osItem.Direccion)
        // if(osItem.Direccion != null || osItem.Direccion != "" || osItem.Direccion != " "){
        let clie = await SelectCliente(osItem.ClienteID)
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
        setFecha(osItem.FechaCreacion.split("T")[0])
        // }
        // return

    }

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setLoading(true)
                try {

                    const { userId } = await getToken()
                    const ingeniero = await getIngenierosStorageById(userId)
                    setIngeniero(ingeniero)


                    const itenSelect = await AsyncStorage.getItem(ticketID)
                    if (itenSelect !== null) {
                        const item = JSON.parse(itenSelect)
                        const { Accion } = item
                        console.log("item", Accion)
                        if (Accion == "FINALIZADO") {//para ver sin editar

                            setDisableSub(false)
                            setIsEnabled(false)
                            setCheck(true)
                            await getCliente()

                        } else if (Accion == "clonar") {// para ver y poder edidar una orden de servicio clone

                            await getCliente()

                        } else if (Accion == "OrdenSinTicket") {

                            // await getCliente()

                        } else if (Accion == "PENDIENTE") {
                            setIsEnabled(true)
                            await getCliente()

                        } else if (Accion == "NUEVO OS TICKET") {

                            await getCliente()

                        }
                    }
                    setLoading(false)
                } catch (error) {
                    console.log("error", error)
                }
            })()
        }, [])
    )

    const GuardarCodigoEquipoCliente = async (text) => {

        console.log("value", value)
        const os = await AsyncStorage.getItem("OS")
        const osItem = JSON.parse(os)
        osItem.CodigoEquipoCliente = value,
            await AsyncStorage.setItem("OS", JSON.stringify(osItem))

        setEquipoTicket({
            ...equipoTicket,
            CodigoEquipoCliente: text,
        })
    }

    const GuardarDireccion = async (value) => {
        console.log("value", value)
        const os = await AsyncStorage.getItem("OS")
        const osItem = JSON.parse(os)
        osItem.Direccion = value,
            await AsyncStorage.setItem("OS", JSON.stringify(osItem))
        setCliente({
            ...cliente,
            Direccion: value,
        })
    }

    return (
        <View style={styles.container}>

            <View style={styles.ContenedorCliente}>
                <LoadingActi loading={loading} />
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
                                style={{
                                    width: "90%",
                                    height: "100%",
                                    color: "#000000",
                                }}
                                placeholder="Cliente"
                                value={cliente.CustomerName}
                                onChangeText={(text) => setCliente({ ...cliente, CustomerName: text })}
                                editable={false}
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
                            value={equipoTicket.CodigoEquipoCliente}
                            onChangeText={(text) => GuardarCodigoEquipoCliente(text)}
                            editable={true}
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
                                        cliente.Sucursal.map((item, index) => (
                                            item.Direccion == cliente.Direccion ?
                                                <Picker.Item
                                                    key={index + 1}
                                                    label={item.Direccion}
                                                    value={item.Direccion}
                                                    selected={true}
                                                />
                                                : <Picker.Item key={index} label={item.Direccion} value={item.Direccion} />
                                        ))
                                        : null
                                }
                            </Picker>
                        </View>
                        <TextInput
                            style={{
                                ...styles.input,
                                color: "#000000",
                            }}
                            placeholder="Ciudad"
                            value={cliente.Ciudad}
                            onChangeText={(text) => setProvincia({ ...provincia, descripcion: text })}
                            editable={false}
                        />
                        {/* <View style={{
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
                        </View> */}
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