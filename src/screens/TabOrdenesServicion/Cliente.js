import { ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getIngenierosStorageById } from "../../service/ingenieros"
import BannerOrderServi from "../../components/BannerOrdenServ"
import { ticketID } from "../../utils/constantes"
import React, { useCallback, useEffect, useState } from "react"
import { getToken } from "../../service/usuario"
import PickerSelect from "../../components/PickerSelect"
import { AntDesign } from "@expo/vector-icons"
import { Picker } from "@react-native-picker/picker"
import LoadingActi from "../../components/LoadingActi"
import { useDispatch, useSelector } from "react-redux"
import { SelectCliente } from "../../service/clientes"
import isEmpty from "just-is-empty"
import { actualizarClienteTool } from "../../redux/formulario"
import { loadingCargando } from "../../redux/sincronizacion"
import { getCantonesStorageBy } from "../../service/cantones"


export default function Cliente(props) {
    const { navigation } = props
    const [isEnabled, setIsEnabled] = useState(false)
    const [isdisabelsub, setDisableSub] = useState(true)

    const [modalVisible, setModalVisible] = useState(false)

    const [OrdenServicioID, setOrdenServicioID] = useState()

    const [ingeniero, setIngeniero] = useState({
        IdUsuario: "",
        NombreUsuario: "",
        adicional: "",
    })

    const [cliente, setCliente] = useState({
        Estado: "",
        Ciudad: "",
        ClienteID: "",
        ClienteNombre: "",
        Direccion: "",
        FechaCreacion: "",
        codOS: 0,
        ticket_id: 0,
        contrato_id: 0,
        CodigoEquipoCliente: "",
    })

    function limpiaCliente() {
        setCliente({
            Estado: "",
            Ciudad: "",
            ClienteID: "",
            ClienteNombre: "",
            Direccion: "",
            FechaCreacion: "",
            codOS: 0,
            ticket_id: 0,
            contrato_id: 0,
            CodigoEquipoCliente: "",
        })
    }
    const [direcciones, setDirecciones] = useState([])

    const ClienteStor = useSelector(s => s.formulario)
    const Events = useSelector(s => s.sincronizacion)
    const dispatch = useDispatch()

    async function getCliente() {
        const cliente = await SelectCliente(ClienteStor.cliente.ClienteID)
        console.log(cliente)
        dispatch(actualizarClienteTool({
            name:'ClienteNombre',
            value: cliente.CustomerName
        }))
        dispatch(actualizarClienteTool({
            name:'Direccion',
            value: !isEmpty(ClienteStor.cliente.Direccion) ? ClienteStor.cliente.Direccion : cliente.Direccion
        }))
        const pro = await getCantonesStorageBy(cliente.CantonID)
        dispatch(actualizarClienteTool({
            name:'Ciudad',
            value: !isEmpty(ClienteStor.cliente.Ciudad) ? ClienteStor.cliente.Ciudad : pro[0].descripcion
        }))
        if (!isEmpty(cliente)) {
            setDirecciones(JSON.parse(cliente.Sucursal))
        }
    }
    useFocusEffect(
        useCallback(() => {
            limpiaCliente()
            if (typeof ClienteStor.cliente !== "undefined") {
                // if (!isEmpty(ClienteStor.cliente.CantonID)) {
                    setCliente(ClienteStor.cliente)
                    getCliente()
                    console.log("useEffect",ClienteStor.cliente)
                // }
            }
        }, [ClienteStor.cliente])
    )

    useFocusEffect(
        useCallback(() => {
            (async () => {
                dispatch(loadingCargando(true))
                try {
                    const { userId } = await getToken()
                    const ingeniero = await getIngenierosStorageById(userId)
                    setIngeniero(ingeniero)
                    // setCliente(ClienteStor.cliente)
                    const itenSelect = await AsyncStorage.getItem(ticketID)
                    if (itenSelect !== null) {
                        const item = JSON.parse(itenSelect)
                        const { Accion, OrdenServicioID } = item
                        setOrdenServicioID(OrdenServicioID)
                        console.log("item", Accion)
                        if (Accion == "FINALIZADO") {//para ver sin editar

                            setDisableSub(false)
                            setIsEnabled(false)
                            // await getCliente()

                        } else if (Accion == "clonar") {// para ver y poder edidar una orden de servicio clone

                            // await getCliente()

                        } else if (Accion == "OrdenSinTicket") {

                            // console.log("os", os)
                            // await getCliente()
                            setIsEnabled(true)
                            setDisableSub(true)
                            

                        } else if (Accion == "PENDIENTE") {

                            // await getCliente()
                            setIsEnabled(true)
                            setDisableSub(true)

                        } else if (Accion == "NUEVO OS TICKET") {

                            // await getCliente()
                            setIsEnabled(true)
                            setDisableSub(true)

                        } else if (Accion == "PROCESO") {

                            setIsEnabled(true)
                            setDisableSub(true)
                            // await getCliente()

                        }else if (Accion == "PENDIENTE DE APROBAR") {

                            setIsEnabled(true)
                            setDisableSub(true)
                            // await getCliente()

                        }
                    }
                    console.log(ClienteStor.cliente)
                    dispatch(loadingCargando(false))
                } catch (error) {
                    console.log("error", error)
                }
            })()
        }, [])
    )

    const GuardarCliente = async (name, value) => {
        let direccion = value.split(":")
        dispatch(actualizarClienteTool({
            name,
            value:direccion[0]
        }))
        setCliente({
            ...cliente,
            [name]: direccion[0]
        })
        const pro = await getCantonesStorageBy(direccion[1])
        console.log("Direcion pro",pro)
        dispatch(actualizarClienteTool({
            name:'Ciudad',
            value: pro[0].descripcion
        }))
    }

    return (
        <View style={styles.container}>

            <View style={styles.ContenedorCliente}>
                <LoadingActi loading={Events.loading} />
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
                            <Text style={styles.text}>OS: {cliente.codOS}</Text>
                            <Text style={styles.text}>Ticket: {cliente.ticket_id}</Text>
                            <Text style={styles.text}>Estado: {cliente.Estado}</Text>
                        </View>
                        <View>
                            <Text style={styles.text}>Contrato: {!isEmpty(ClienteStor.equipo) ? ClienteStor.equipo.contrato_id : ''}</Text>
                            <Text style={styles.text}>Fecha Crea.: {cliente.FechaCreacion.split('T')[0]}</Text>
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
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >Cliente</Text>
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
                                value={cliente.ClienteNombre}
                                onChangeText={(text) => setCliente({ ...cliente, ClienteNombre: text })}
                                editable={false}
                            />
                            <AntDesign
                                onPress={() => setModalVisible(!modalVisible)}
                                name='search1'
                                size={24}
                                color='#000000'
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >Codigo equipo cliente</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Código equipo cliente"
                            value={cliente.CodigoEquipoCliente}
                            onChangeText={(text) => GuardarCliente('CodigoEquipoCliente', text)}
                            editable={true}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >Direccion</Text>
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
                                onValueChange={(itemValue) => GuardarCliente('Direccion', itemValue)} >
                                {
                                    direcciones.map((item, index) => (
                                        item.Direccion == cliente.Direccion ?
                                            <Picker.Item
                                                key={index + 1}
                                                label={item.Direccion}
                                                value={item.Direccion}
                                                selected={true}
                                            />
                                            : <Picker.Item key={index} label={item.Direccion} value={item.Direccion+":"+item.CantonID} />
                                    ))
                                }
                            </Picker>
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >Ciudad</Text>
                        <TextInput
                            style={{
                                ...styles.input,
                                color: "#000000",
                            }}
                            placeholder="Ciudad"
                            value={cliente.Ciudad}
                            onChangeText={(text) => GuardarCliente('Ciudad', text)}
                            editable={false}
                        />
                    </View>
                </ScrollView>
            </View>
            <PickerSelect
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setCliente={setCliente}
                setDirecciones={setDirecciones}
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