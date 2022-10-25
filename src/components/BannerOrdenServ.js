import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import tabNavigation from "../hook/tabNavigation";
import { ExisteHistorialEquipoClienteNombre, getHistorialEquiposStorageChecked, HistorialEquipoIngeniero, HistorialEquipoPorCliente, isCheckedCancelar } from "../service/historiaEquipo";
import { PostOS, PutOS } from "../service/OS";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import React, { useCallback, useState } from "react"
import { ticketID, evento } from "../utils/constantes";
import { DeleteEventesDiaHoy, GetEventosByTicket, GetEventosByTicketHoy, GetEventosDelDia, GetEventosDelDiaHoy } from "../service/OSevento";
import { SincronizaDor, time, TrucateUpdate } from "../service/CargaUtil";
import { deleteEquipoIDTicketArray, EquipoTicket } from "../service/equipoTicketID";
import { DeleteAnidada, OrdenServicioAnidadas } from "../service/OrdenServicioAnidadas";
import { useFocusEffect } from "@react-navigation/native";
import { InsertEventosLocales } from "../service/OSevento";
import { InserOSOrdenServicioIDLocal, OSOrdenServicioID, UpdateOSOrdenServicioID } from "../service/OS_OrdenServicio";
import { ActualizarOrdenServicioLocal, EditareventoLocal, registartEquipoTicket } from "../service/ServicioLoca";
import { useIsConnected } from 'react-native-offline';
import { actualizarMessageTool, PostEnviarFormularioTool, PostLocalFormularioTool, PutactualizarFormularioTool, PutaLocalctualizarFormularioTool, resetFormMessageTool, resetFormularioTool, resetStatusTool, Sincronizador } from "../redux/formulario";
import { useDispatch, useSelector } from "react-redux";
import { getEventosByDate, listarEventoAyer, listarEventoHoy, listarEventoMnn, loadingCargando, loadingProcesando } from "../redux/sincronizacion";
import { GetClienteClienteName } from "../service/clientes";
import isEmpty from "is-empty";

export default function BannerOrderServi(props) {
    const { navigation, route, screen } = props
    const { name, params } = route

    const [modalVisible, setModalVisible] = useState(false)
    const isConnected = useIsConnected();


    const { TabTitle } = tabNavigation()
    const [editar, seteditar] = useState(false)
    const form = useSelector(state => state.formulario)
    const dispatch = useDispatch()

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const itenSelect = await AsyncStorage.getItem(ticketID)
                if (itenSelect != null) {
                    const item = JSON.parse(itenSelect)
                    const { Accion } = item
                    console.log("BANNER ", Accion)
                    if (Accion != "clonar" && Accion != "OrdenSinTicket" && Accion != "NUEVO OS TICKET") {
                        if (name == "6-INGRESO HORAS" && Accion != null) {
                            seteditar(true)
                        } else {
                            seteditar(false)
                        }
                    }
                }
            })()
        }, [name])
    );
    const tab = ["1-EQUIPO", "2-CLIENTE", "3-DATOS", "4-COMPONENTES", "5-ADJUNTOS", "6-INGRESO HORAS",]


    async function changeScreenSiguiente() {
        let index = tab.indexOf(name)
        const check = await PasarACliente()
        if (check) {
            if (index <= tab.length) {
                console.log("indexOf-->", index)
                if (index < tab.length - 1) {
                    TabTitle(tab[index + 1])
                    navigation.navigate(tab[index + 1])
                }
            }
        }
    }

    function changeScreenAnterior() {
        let index = tab.indexOf(name)
        if (index >= 0 && index <= tab.length) {
            if (index > 0) {
                TabTitle(tab[index - 1])
                navigation.navigate(tab[index - 1])
            }
        }
    }
    async function resetTab() {
        TabTitle(tab[0])
        // navigation.navigate(tab[0])
        const screen = await AsyncStorage.getItem("SCREMS")
        console.log("screen", screen)
        navigation.navigate(screen)
        // navigation.navigate("Consultas")
    }
    async function PasarACliente() {
        const respuesta = await getHistorialEquiposStorageChecked()
        if (respuesta.length > 0) {
            return true
        } else {
            return false
        }
    }

    async function Dispatcher() {
        var hoy = moment().format('YYYY-MM-DD')
        var ayer = moment().add(-1, 'days').format('YYYY-MM-DD')
        var mnn = moment().add(1, 'days').format('YYYY-MM-DD')
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

    async function changeStatus() {
        dispatch(resetFormMessageTool())
        dispatch(resetFormularioTool())
        dispatch(resetFormularioTool())
        await resetTab()
        return true
    }

    useFocusEffect(
        useCallback(() => {
            (async () => {
                if (form.status == 204) {
                    dispatch(resetStatusTool())
                    await ActualizarPut()
                    // await Dispatcher()
                    setModalVisible(false)
                    await changeStatus()
                    console.log("204")
                }
                if (form.status == 200) {
                    dispatch(resetStatusTool())
                    await CrearOrdenPost()
                    await time(1000)
                    await Dispatcher()
                    setModalVisible(false)
                    await changeStatus()
                    console.log("200")
                }
            })()
        }, [form.status == 204 || form.status == 200])
    )
    useFocusEffect(
        useCallback(() => {
            if (form.message != "") {
                setModalVisible(false)
                dispatch(resetFormMessageTool())
                Alert.alert("Alerta", form.message)
            }
        }, [form.message != ""])
    )

    async function ActualizarPut() {
        let P = await PutOS(form.ordenServicio)
        if (P == 204) {
            dispatch(loadingCargando(true))
            dispatch(actualizarMessageTool("Orden de servicio actualizada correctamente"))
            await UpdateOSOrdenServicioID([form.ordenServicio.OrdenServicioID])
            await isCheckedCancelar()
            await Sincronizar()
            dispatch(loadingCargando(false))
            await resetTab()
        } else {
            dispatch(actualizarMessageTool("Error al actualizar la orden de servicio"))
            setModalVisible(false)
        }
    }

    async function CrearOrdenPost() {
        dispatch(loadingCargando(true))
        let P = await PostOS(form.ordenServicio)
        if (P == "200") {
            dispatch(actualizarMessageTool("Orden de Servicio Creada"))
            dispatch(resetFormMessageTool())
            await isCheckedCancelar()
            await Sincronizar()
            // await SincronizaDor()
            await Dispatcher()
            dispatch(loadingCargando(false))
            await resetTab()
        } else {
            await isCheckedCancelar()
            dispatch(actualizarMessageTool("Error al crear la orden de servicio"))
            dispatch(resetFormMessageTool())
            setModalVisible(false)
            dispatch(loadingCargando(false))
        }
    }

    async function GUARDAR_OS() {
        setModalVisible(true)
        if (form.OrdenServicioID == 0) {
            dispatch(PostEnviarFormularioTool())
        } else {
            dispatch(PutactualizarFormularioTool())
        }
    }

    useFocusEffect(
        useCallback(() => {
            (async () => {
                if (form.status == 304) {
                    dispatch(resetStatusTool())
                    await ActualizarOrdenLocal()
                }
                if (form.status == 300) {
                    dispatch(resetStatusTool())
                    CrearOrdenLocal()
                }
            })()
        }, [form.status == 304 || form.status == 300])
    )

    const CrearOrdenLocal = async () => {
        const { OrdenServicioID, equipo_id, contrato_id } = form.ordenServicio
        dispatch(loadingCargando(true))
        await isCheckedCancelar()
        console.log("OrdenServicioID", OrdenServicioID)
        console.log("equipo_id", equipo_id)
        console.log("contrato_id", contrato_id)
        console.log("form.ordenServicio", form.ordenServicio)
        await InserOSOrdenServicioIDLocal(form.ordenServicio, OrdenServicioID)
        await InsertEventosLocalesUpadte(form.ordenServicio, OrdenServicioID)
        await registartEquipoTicket(equipo_id, contrato_id, OrdenServicioID)
        await resetTab()
        dispatch(resetFormMessageTool())
        dispatch(loadingCargando(false))
        Alerta("Información", "Orden de servicio creado localmente cuando tenga conexion sincronizara para subir al servidor")
    }
    const ActualizarOrdenLocal = async () => {
        const { OrdenServicioID } = form.ordenServicio
        dispatch(loadingCargando(true))
        await isCheckedCancelar()
        await EditareventoLocal("PROCESO", OrdenServicioID)
        await ActualizarOrdenServicioLocal(form.ordenServicio)
        await resetTab()
        dispatch(resetFormMessageTool())
        dispatch(loadingCargando(false))
        Alerta("Información", "Orden de servicio actualizada localmente")
    }


    function getRandomInt(max) {
        return Math.floor(Math.random() * max)
    }
    const GuadarLocalmente = async () => {
        if (form.OrdenServicioID == 0) {
            var rando = getRandomInt(1000000000)
            dispatch(PostLocalFormularioTool({
                ticket_id: rando,
                OrdenServicioID: rando,
                evento_id: rando
            }))
        } else {
            dispatch(PutaLocalctualizarFormularioTool())
        }
    }

    const InsertEventosLocalesUpadte = async (r, tikeck) => {
        evento.tck_cliente = r.ClienteNombre
        evento.ev_estado = "PROCESO"
        evento.tck_direccion = r.Direccion
        evento.OrdenServicioID = tikeck
        evento.ticket_id = tikeck
        evento.evento_id = tikeck
        evento.ev_fechaAsignadaDesde = `${moment().format("YYYY-MM-DDT00:00:00")}`
        evento.ev_fechaAsignadaHasta = `${moment().format("YYYY-MM-DDT00:00:00")}`
        evento.ev_horaAsignadaDesde = `${moment().format("HH:mm:ss")}`
        evento.ev_horaAsignadaHasta = `${moment().format("HH:mm:ss")}`
        evento.tck_tipoTicket = r.TipoVisita
        evento.tck_tipoTicketCod = r.TipoVisita
        evento.tipoIncidencia = r.tipoIncidencia
        await InsertEventosLocales(evento)
    }

    function Alerta(title, message) {
        Alert.alert(
            title,
            message,
            [
                {
                    text: "OK", onPress: () => {
                        setModalVisible(false)
                        navigation.navigate("Consultas")
                    }
                }
            ],
            { cancelable: false }
        )
    }

    async function Reset() {
        await resetTab()
    }


    async function Sincronizar() {
        if (isConnected) {
            await DeleteEventesDiaHoy()
            //consulta para traer los eventos del dia ayer hoy y mañana
            await GetEventosDelDiaHoy()
            var hoy = moment().format('YYYY-MM-DD');
            const ticket_id = await GetEventosByTicketHoy(hoy)
            // const ticket_id = await GetEventosByTicket(ayer, hoy, manana)
            let id_ticket = []
            let evento_id = []
            let OrdenServicioID = []
            let tck_cliente = []
            for (let index = 0; index < ticket_id.length; index++) {
                let item = ticket_id[index];
                id_ticket.push(item.ticket_id)
                evento_id.push(item.evento_id)
                OrdenServicioID.push(item.OrdenServicioID)
                tck_cliente.push(item.tck_cliente)
            }

            await deleteEquipoIDTicketArray(id_ticket)

            //para guardar los equipos por ticket
            console.log("guardar equipos por ticket", id_ticket.length)
            for (let index = 0; index < id_ticket.length; index++) {
                let item = id_ticket[index];
                console.log("item", item)
                console.log("index", index)
                console.log("\n")
                await EquipoTicket(item)
            }

            await DeleteAnidada(evento_id)
            //Para buscar eventos anidadas a la orden
            for (let index = 0; index < evento_id.length; index++) {
                let item = evento_id[index];
                await OrdenServicioAnidadas(item)
            }

            //para guardar lo que venga con OS
            for (let index = 0; index < OrdenServicioID.length; index++) {
                let item = OrdenServicioID[index];
                await OSOrdenServicioID(item)
            }

            var arrayRuc = ""
            //para verificar si hay evetos con cliente no registrado 247
            for (let index = 0; index < tck_cliente.length; index++) {
                let item = tck_cliente[index];
                const existe = await ExisteHistorialEquipoClienteNombre(item)
                if (existe) {
                    console.log("existe", existe)
                } else {
                    console.log("existe", existe)
                    const sacarRuc = await GetClienteClienteName(item)
                    // const sacarRuc = await GetClienteClienteName("COMPAÑIA ANONIMA CLINICA GUAYAQUIL SERVICIOS MEDICOS S.A.")
                    console.log("sacarRuc", sacarRuc[0].CustomerID)
                    arrayRuc += sacarRuc[0].CustomerID + "|"
                    // arrayRuc.push(item)
                }
            }

            if (!isEmpty(arrayRuc)) {
                console.log("arrayRuc", arrayRuc)
                await HistorialEquipoPorCliente(arrayRuc)
            }
        }
        dispatch(loadingProcesando(true))

    }


    return (
        <>
            <View style={styles.banner}>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: 10,
                }}>
                    <Fontisto name="cloud-refresh" size={25} color="#FFF" />
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: name !== "1-EQUIPO" ? 'space-between' : 'flex-end',
                    alignItems: 'center',
                    width: '70%',
                }}>
                    {
                        name !== "1-EQUIPO" ?
                            <TouchableOpacity style={styles.volver} onPress={changeScreenAnterior}>
                                <AntDesign name="arrowleft" size={20} color="#FFFFFF" />
                                <Text style={{ color: "#FFF", fontSize: 12, paddingLeft: 5, fontWeight: "bold" }}>
                                    VOLVER
                                </Text>
                            </TouchableOpacity>
                            : null
                    }
                    {
                        name !== "6-INGRESO HORAS" ?
                            <TouchableOpacity style={styles.volver} onPress={changeScreenSiguiente}>
                                <Text style={{ color: "#FFF", fontSize: 12, fontWeight: "bold" }}>
                                    SIGUIENTE
                                </Text>
                                <AntDesign name="arrowright" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={{
                                ...styles.volver,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }} onPress={async () => {

                                const itenSelect = await AsyncStorage.getItem(ticketID)
                                const item = JSON.parse(itenSelect)
                                const { Accion } = item
                                if (Accion != "FINALIZADO") {
                                    if (isConnected) {
                                        await GUARDAR_OS()
                                    } else {
                                        Alert.alert(
                                            "Info",
                                            "No hay conexión a internet se guardara en el dispositivo",
                                            [
                                                {
                                                    text: "OK",
                                                    onPress: () => GuadarLocalmente()
                                                }
                                            ]
                                        )
                                    }
                                } else {
                                    Alert.alert(
                                        "Info",
                                        "La orden de servicio ya fue finalizada",
                                        [
                                            {
                                                text: "OK",
                                                onPress: () => Reset()
                                            }
                                        ]
                                    )
                                }

                            }}>
                                {
                                    editar ?
                                        <Text style={{ color: "#FFF", fontSize: 12, paddingRight: 5 }}>
                                            EDITAR
                                        </Text>
                                        :
                                        <Text style={{ color: "#FFF", fontSize: 12, paddingRight: 5 }}>
                                            GUARDAR
                                        </Text>
                                }
                                <AntDesign name="save" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                    }
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => { setModalVisible(!modalVisible) }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <ActivityIndicator size={70} color="#FF6B00" />
                            <Text style={{ marginTop: 16, marginBottom: 32 }}>Guardando...</Text>
                        </View>
                    </View>
                </Modal>
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
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
    volver: {
        flexDirection: 'row',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B00',
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginHorizontal: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 10,
        width: "80%",
        height: "20%",
        backgroundColor: "white",
        borderRadius: 3,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
})