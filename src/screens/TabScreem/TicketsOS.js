import { useFocusEffect } from "@react-navigation/native";

import { useCallback, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { os_firma, ticketID } from "../../utils/constantes";
import BannerTicket from "../../components/BannerTicket";
import { DeleteAnidada, getOrdenServicioAnidadasTicket_id, OrdenServicioAnidadas } from "../../service/OrdenServicioAnidadas";
import db from "../../service/Database/model";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import VisualizadorPDF from "../../components/VisualizadorPDF";
import { getRucCliente, PDFVisializar, SelectOSOrdenServicioID, SelectOSOrdenServicioIDEquipo } from "../../service/OS_OrdenServicio";
import ModalGenerico from "../../components/ModalGenerico";
import axios from "axios";
import { getToken } from "../../service/usuario";
import { AntDesign } from "@expo/vector-icons";
import { getEquipoID, HistorialEquipoIngeniero, isChecked } from "../../service/historiaEquipo";
import { FinalizarOS, FinalizarOS_, ParseOS } from "../../service/OS";
import moment from "moment";
import { GetEventosByTicket, GetEventosByTicketHoy, GetEventosDelDia } from "../../service/OSevento";
import { EquipoTicket, SelectTicket } from "../../service/equipoTicketID";
import { time, TrucateUpdate } from "../../service/CargaUtil";
import LoadingActi from "../../components/LoadingActi";

import Firmador from "../../components/Firmador"
import { useIsConnected } from 'react-native-offline';
import { FinalizarOSLocal } from "../../service/ServicioLoca";
import { useDispatch, useSelector } from "react-redux"
import { loadingCargando } from "../../redux/sincronizacion";
import {
    actualizarClienteTool, actualizarDatosTool, resetFormularioTool, setAdjuntosTool,
    SetByOrdenServicioID,
    setChecklistTool, setClienteTool, setComponenteTool,
    setdatosTool, setEquipoTool, setFirmasTool, setOrdenServicioID, setTiemposTool
} from "../../redux/formulario";

const isConnection = axios.create({
    baseURL: 'https://google.com',
    timeout: 10000,
})


export default function TicketsOS(props) {
    const { navigation } = props
    const [eventosAnidados, seteventosAnidados] = useState([])
    const isConnected = useIsConnected()

    const [Fini, setFini] = useState(false)

    const [loading, setLoading] = useState(false)

    const [listadoEmails, setlistadoEmails] = useState([])

    const [OrdenServicioID, setOrdenServicio] = useState(0)
    const [ticket, setticket] = useState(null)
    const [ClienteNombre, setClienteNombre] = useState(null)

    const [idOrdenServicio, setIdOrdenServicio] = useState(null)

    const [modalVisible, setModalVisible] = useState(false);

    const [modalSignature, setModalSignature] = useState(false);
    const [userData, setUserData] = useState(os_firma)

    const [pdfview, setPdfview] = useState(true)
    const [pdfurl, setPdfurl] = useState("")

    const Events = useSelector(s => s.sincronizacion)
    const formulario = useSelector(s => s.formulario)
    const dispatch = useDispatch()

    useFocusEffect(
        useCallback(() => {
            (async () => {
                console.log("useFocusEffect", Events.anidaciones)
                seteventosAnidados([])
                setticket("")
                dispatch(loadingCargando(true))
                const { ticket_id, equipo } = JSON.parse(await AsyncStorage.getItem(ticketID))
                console.log('ticket_id', formulario.cliente.ticket_id)
                setticket(ticket_id)
                setClienteNombre(equipo[0].con_ClienteNombre)
                const response = await getOrdenServicioAnidadasTicket_id(ticket_id)
                console.log('response', response)
                if (response != null) {
                    console.log("anidada", response)
                    dispatch(resetFormularioTool())
                    seteventosAnidados(response.map((item) => { return { ...item, check: false } }))
                }
                dispatch(loadingCargando(false))
            })()
        }, [Events.anidaciones])
    )

    const functionColor = (type) => {
        if (type == "PENDIENTE") {
            return "#FFFFFF"
        } else if (type == "PROCESO") {
            return "#FFFFFF"
        } else if (type == "FINALIZADO") {
            return "#E2FAE0"
        } else {
            return "#FFFFFF"
        }
    }

    async function Ordene(ticket_id, evento_id, estado, OrdenServicioID, tck_tipoTicket, tipoIncidencia, tck_tipoTicketCod) {
        console.log("ticket_id", ticket_id)
        console.log("estado", estado)
        dispatch(loadingCargando(true))
        try {
            const ordenservicio_equipo = await SelectOSOrdenServicioIDEquipo(OrdenServicioID)
            console.log("ordenservicio", ordenservicio_equipo)
            db.transaction(tx => {
                tx.executeSql(`SELECT * FROM historialEquipo where equipo_id = ?`, [ordenservicio_equipo], (_, { rows }) => {
                    Rutes(rows._array, ticket_id, evento_id, OrdenServicioID, estado, tck_tipoTicket, tipoIncidencia, tck_tipoTicketCod)
                })
            })
        } catch (error) {
            dispatch(loadingCargando(false))
            alert("Error al cargar los datos por favor intente nuevamente o sincronice")
            console.log("error", error)
        }
    }



    async function AgregarFirma(OrdenServicioID) {
        setLoading(true)
        // setUserData(formulario.firmas)
        setLoading(false)
        setModalSignature(true)
        dispatch(SetByOrdenServicioID(OrdenServicioID))
        // console.log("AgregarFirma", OrdenServicioID)
    }

    const enviarFirma = () => {
        setModalSignature(false)
        console.log("enviado")
    }

    async function ClonarOS(ticket_id, evento_id, estado, OrdenServicioID, tck_tipoTicket, tipoIncidencia, tck_tipoTicketCod) {
        try {
            dispatch(loadingCargando(true))
            db.transaction(tx => {
                tx.executeSql(`SELECT * FROM equipoTicket where ticket_id = ?`, [ticket_id], (_, { rows }) => {
                    db.transaction(tx => {
                        tx.executeSql(`SELECT * FROM historialEquipo where equipo_id = ?`, [rows._array[0].id_equipo], (_, { rows }) => {
                            Rutes(rows._array, ticket_id, evento_id, OrdenServicioID, "clonar", tck_tipoTicket, tipoIncidencia, tck_tipoTicketCod)
                        })
                    })
                })
            })
        } catch (error) {
            dispatch(loadingCargando(false))
            alert("Error al cargar los datos por favor intente nuevamente o sincronice")
        }
    }

    async function EnviarOS(item) {
        if (isConnected) {
            const { ClienteID, UsuarioCreacion } = await getRucCliente(item)
            const { token } = await getToken()
            const { data } = await axios.get(`https://technical.eos.med.ec/MSOrdenServicio/correos?ruc=${ClienteID}&c=${UsuarioCreacion}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            setlistadoEmails(data)
            setIdOrdenServicio(item)
            setModalVisible(!modalVisible)
        } else {
            Alert.alert("Error de conexion", "No se puede enviar la orden de servicio sin conexion a internet")
        }
    }

    async function VisualizarPdf(item) {
        const base64 = await PDFVisializar(item)
        if (base64 != null) {
            setPdfurl(base64)
            setPdfview(false)
        }else{
            alert("No se pudo generar el PDF")
        }
        // setPdfurl(base64)
        // setPdfview(false)
    }

    /**
     * 
     * @param {*} equipo [array]
     * @param {*} ticket_id string
     * @param {*} OrdenServicioID string
     * @param {*} OSClone 
     * @param {*} accion string
     */
    async function Rutes(equipo, ticket_id, evento_id, OrdenServicioID, accion, tck_tipoTicket, tipoIncidencia, tck_tipoTicketCod) {
        console.log("Rutes",
            equipo,
            ticket_id,
            evento_id,
            OrdenServicioID,
            accion,
            tck_tipoTicket,
            tipoIncidencia,
            tck_tipoTicketCod)
        var clon;
        var equipo_id = []
        if (accion == "PENDIENTE" || accion == "FINALIZADO" || accion == "PROCESO" || accion == "PENDIENTE DE APROBAR") {
            clon = await SelectOSOrdenServicioID(OrdenServicioID)
            dispatch(SetByOrdenServicioID(OrdenServicioID))
            clon[0].ticket_id = ticket_id,
                clon[0].evento_id = evento_id,
                clon[0].tipoIncidencia = tipoIncidencia,
                clon[0].TipoVisita = tck_tipoTicketCod,
                clon[0].OrdenServicioID = OrdenServicioID,
                dispatch(setEquipoTool(clon[0]))
            dispatch(setClienteTool(clon[0]))
            dispatch(setdatosTool(clon[0]))
            dispatch(setComponenteTool(JSON.parse(clon[0].OS_PartesRepuestos)))
            dispatch(setAdjuntosTool(JSON.parse(clon[0].OS_Anexos)))
            dispatch(setTiemposTool(JSON.parse(clon[0].OS_Tiempos)))
            dispatch(setFirmasTool(JSON.parse(clon[0].OS_Firmas)))
            dispatch(setChecklistTool(JSON.parse(clon[0].OS_CheckList)))
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
            await isChecked(clon[0].equipo_id)
            dispatch(loadingCargando(false))
            await AsyncStorage.removeItem(ticketID)
            await AsyncStorage.setItem(ticketID, JSON.stringify({
                evento_id,
                ticket_id,
                equipo,
                OrdenServicioID,
                Accion: accion,
                tck_tipoTicket,
                tipoIncidencia,
                tck_tipoTicketCod,
            }))
            await AsyncStorage.setItem("SCREMS", "Ticket")
            dispatch(loadingCargando(false))
            navigation.navigate("Ordenes")
        }
        if (accion == "clonar") {
            clon = await SelectOSOrdenServicioID(OrdenServicioID)
            clon[0].ticket_id = ticket_id,
                clon[0].evento_id = evento_id,
                clon[0].tipoIncidencia = tipoIncidencia,
                clon[0].TipoVisita = tck_tipoTicketCod,
                clon[0].OrdenServicioID = 0,
                dispatch(setEquipoTool(clon[0]))
            dispatch(setClienteTool(clon[0]))
            dispatch(setdatosTool(clon[0]))
            dispatch(setComponenteTool(JSON.parse(clon[0].OS_PartesRepuestos)))
            dispatch(setAdjuntosTool(JSON.parse(clon[0].OS_Anexos)))
            dispatch(setTiemposTool(JSON.parse(clon[0].OS_Tiempos)))
            dispatch(setFirmasTool(JSON.parse(clon[0].OS_Firmas)))
            dispatch(setChecklistTool(JSON.parse(clon[0].OS_CheckList)))
            equipo_id = await isChecked(clon[0].equipo_id)
            console.log("equipo_id", equipo_id)
            equipo_id[0]['isChecked'] = 'true'
            dispatch(loadingCargando(false))
            await AsyncStorage.removeItem(ticketID)
            await AsyncStorage.setItem(ticketID, JSON.stringify({
                OrdenServicioID: 0,
                evento_id,
                ticket_id,
                equipo,
                Accion: accion,
                tck_tipoTicket,
                tipoIncidencia,
                tck_tipoTicketCod,
            }))
            await AsyncStorage.setItem("SCREMS", "Ticket")
            await isChecked(equipo[0].equipo_id)
            dispatch(loadingCargando(false))
            navigation.navigate("Ordenes")
        }
    }

    async function ValidarEquipos() {
        const { ticket_id } = JSON.parse(await AsyncStorage.getItem(ticketID))
        const id_equipos = await SelectTicket(ticket_id)
        var equipos = []
        for (let i = 0; i < id_equipos.length; i++) {
            const equipo = await getEquipoID(id_equipos[i])
            equipos.push(equipo)
        }
        return equipos
    }

    async function IngresarNuevoOsTicket() {
        try {
            dispatch(loadingCargando(true))
            var equipo = await ValidarEquipos()
            var idOrden = []
            eventosAnidados.forEach((item) => {
                idOrden.push(item.OrdenServicioID)
            })
            var id_equipos = []
            if (eventosAnidados.length > 0) {
                for (let index = 0; index < idOrden.length; index++) {
                    let OSID = idOrden[index];
                    console.log("OSID", OSID)
                    let clon = await SelectOSOrdenServicioID(OSID)
                    id_equipos.push(clon.equipo_id)
                }
            } else {
                let clon = await SelectOSOrdenServicioID(eventosAnidados[0].OrdenServicioID)
                id_equipos.push(clon[0].equipo_id)
            }

            for (let id = 0; id < id_equipos.length; id++) {
                for (let index = 0; index < equipo.length; index++) {
                    let item = equipo[index];
                    if (item.equipo_id == id_equipos[id]) {
                        console.log("item igual")
                        equipo[index]['disable'] = 'true'
                    }
                }
            }
            console.log("equipo IngresarNuevoOsTicket_", equipo)
            const { ticket_id, evento_id, OrdenServicioID, tck_tipoTicket, tipoIncidencia, tck_tipoTicketCod } = JSON.parse(await AsyncStorage.getItem(ticketID))
            await AsyncStorage.setItem(ticketID, JSON.stringify({
                evento_id,
                ticket_id,
                equipo,
                OrdenServicioID: 0,
                Accion: "NUEVO OS TICKET",
                tipoIncidencia,
                tck_tipoTicket,
                tck_tipoTicketCod
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
            await AsyncStorage.setItem("SCREMS", "Ticket")
            dispatch(loadingCargando(false))
            navigation.navigate("Ordenes")
        } catch (error) {
            console.log("error", error)
            dispatch(loadingCargando(false))
        }
    }

    async function IngresarNuevoOsTicket_() {
        try {
            dispatch(loadingCargando(true))
            var equipo = await ValidarEquipos()
            console.log("equipo IngresarNuevoOsTicket_", equipo)
            const { ticket_id, evento_id, OrdenServicioID, tck_tipoTicket, tipoIncidencia, tck_tipoTicketCod } = JSON.parse(await AsyncStorage.getItem(ticketID))
            console.log("IngresarNuevoOsTicket_", ticket_id, evento_id, OrdenServicioID, tck_tipoTicket, tipoIncidencia, tck_tipoTicketCod)
           
            await AsyncStorage.setItem(ticketID, JSON.stringify({
                evento_id,
                ticket_id,
                equipo,
                OrdenServicioID: 0,
                Accion: "NUEVO OS TICKET",
                tipoIncidencia,
                tck_tipoTicket,
                tck_tipoTicketCod
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
            dispatch(setOrdenServicioID(0))
            await AsyncStorage.setItem("SCREMS", "Ticket")
            dispatch(loadingCargando(false))
            navigation.navigate("Ordenes")
        } catch (error) {
            console.log("error", error)
            dispatch(loadingCargando(false))
        }
    }


    async function ColorCheckt(itemIndex, index) {
        var check = [...eventosAnidados]
        check[index].check = !check[index].check
        seteventosAnidados(check)
        CeckFini()
    }

    function CeckFini() {
        let even = eventosAnidados.filter((item) => {
            return item.check == true
        })
        even.length > 0 ? setFini(true) : setFini(false)
    }


    async function FINALIZADOLOCAL(){
        dispatch(loadingCargando(true))
        var OrdenServicioI = []
        for (let index = 0; index < eventosAnidados.length; index++) {
            const item = eventosAnidados[index];
            if (item.check == true) {
                OrdenServicioI.push(item.OrdenServicioID)
            }
        }
              
    }


    async function Finalizar() {
        dispatch(loadingCargando(true))
        var OrdenServicioI = []
        for (let index = 0; index < eventosAnidados.length; index++) {
            const item = eventosAnidados[index];
            if (item.check == true) {
                OrdenServicioI.push(item.OrdenServicioID)
            }
        }
        try {
            const { data } = await isConnection.get()
            if (data) {
                const respuesta = await FinalizarOS(OrdenServicioI)
                if (respuesta == 200) {
                    setFini(false)
                    let event = eventosAnidados.map((item, index) => {
                        if (item.OrdenServicioID == OrdenServicioI[index]) {
                            return {
                                ...item,
                                ev_estado: "FINALIZADO"
                            }
                        } else {
                            return item
                        }
                    })
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

                    seteventosAnidados(event)
                    dispatch(loadingCargando(false))
                } else {
                    alert("Error al finalizar uno o mas OS")
                    dispatch(loadingCargando(false))
                }
            } else {

                await FinalizarOSLocal(OrdenServicioI)
                setFini(false)
                let event = eventosAnidados.map((item, index) => {
                    if (item.OrdenServicioID == OrdenServicioI[index]) {
                        return {
                            ...item,
                            ev_estado: "FINALIZADO"
                        }
                    } else {
                        return item
                    }
                })
                seteventosAnidados(event)
                dispatch(loadingCargando(false))
            }
        } catch (error) {
            await FinalizarOSLocal(OrdenServicioI)
            setFini(false)
            let event = eventosAnidados.map((item, index) => {
                if (item.OrdenServicioID == OrdenServicioI[index]) {
                    return {
                        ...item,
                        ev_estado: "FINALIZADO"
                    }
                } else {
                    return item
                }
            })
            seteventosAnidados(event)
            dispatch(loadingCargando(false))
        }
    }

    return (

        pdfview ?
            (<View style={styles.container} >
                <Modal
                    transparent={true}
                    visible={modalSignature}
                    onRequestClose={() => {
                        setModalSignature(!modalSignature);
                    }}
                    propagateSwipe={true}
                >
                    <Firmador
                        enviarFirma={enviarFirma}
                        setModalSignature={setModalSignature}
                        datauser={userData}
                        setUserData={setUserData}
                        OrdenServicioID={OrdenServicioID}
                    />
                </Modal>
                {
                    eventosAnidados.length > 0 ?
                        <View style={styles.body}>
                            <Text style={styles.header}>{eventosAnidados[0].tck_cliente}</Text>
                            <Text style={{
                                ...styles.header,
                                fontSize: 15,
                            }}>Ticket #{eventosAnidados[0].ticket_id}</Text>
                            <View style={{ ...styles.body1 }} >
                                <LoadingActi loading={Events.loading} />
                                <ScrollView showsVerticalScrollIndicator={false} >
                                    {
                                        eventosAnidados.map((item, index) => {
                                            return (
                                                <View key={index}
                                                    style={{ width: '100%', alignSelf: 'center', marginBottom: 10, }}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-around',
                                                            alignItems: 'center',
                                                            backgroundColor: functionColor(item.ev_estado),
                                                            width: '100%',
                                                            minHeight: 80,
                                                            paddingHorizontal: 20,
                                                            borderBottomWidth: 0.5,
                                                            borderColor: '#858583'
                                                        }}>
                                                        {
                                                            item.ev_estado == "PENDIENTE" || item.ev_estado == "PROCESO" ?
                                                                <TouchableOpacity
                                                                    onPress={() => ColorCheckt(item, index)}
                                                                    style={{
                                                                        flexDirection: 'column',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        width: 30,
                                                                        height: 30,
                                                                        borderWidth: 2,
                                                                        borderColor: item.check ? '#188C03' : '#858583',
                                                                        borderRadius: 50,
                                                                    }}>
                                                                    <AntDesign name="check" size={24} color={item.check ? '#188C03' : '#858583'} />
                                                                </TouchableOpacity>
                                                                : null
                                                        }
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                console.log("item", item)
                                                                Ordene(
                                                                    String(item.ticket_id),
                                                                    String(item.evento_id),
                                                                    item.ev_estado,
                                                                    item.OrdenServicioID,
                                                                    item.tck_tipoTicket,
                                                                    item.tipoIncidencia,
                                                                    item.tck_tipoTicketCod
                                                                )
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
                                                                >{item.tck_tipoTicket} / {item.ev_horaAsignadaDesde.substring(0, 5)}</Text>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 12,
                                                                        color: '#858583'
                                                                    }}
                                                                >{item.ev_descripcion}</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                        <Menu>
                                                            <MenuTrigger
                                                                text='...'
                                                                customStyles={{
                                                                    triggerText: {
                                                                        fontSize: 35,
                                                                        color: '#858583',
                                                                        fontWeight: 'bold',
                                                                        transform: [{ rotate: '90deg' }],
                                                                        padding: 10,
                                                                    },
                                                                }} />
                                                            <MenuOptions
                                                                customStyles={{
                                                                    optionsContainer: {
                                                                        width: 150,
                                                                        backgroundColor: '#FFFFFF',
                                                                        borderRadius: 5,
                                                                        padding: 10,
                                                                        shadowColor: "#000",
                                                                        shadowOffset: {
                                                                            width: 0,
                                                                            height: 2,
                                                                        },
                                                                        shadowOpacity: 0.25,
                                                                        shadowRadius: 3.84,
                                                                        elevation: 5,
                                                                    },
                                                                }}
                                                            >
                                                                {
                                                                    item.ev_estado !== "PENDIENTE" && item.ev_estado !== "PROCESO" && item.ev_estado !== "PENDIENTE DE APROBAR" ?
                                                                        <MenuOption
                                                                            onSelect={() => AgregarFirma(item.OrdenServicioID)}
                                                                            text='Agregar Firma'
                                                                            customStyles={{
                                                                                optionText: {
                                                                                    fontSize: 16,
                                                                                    color: '#000000',
                                                                                    fontWeight: 'bold',
                                                                                    paddingBottom: 10,
                                                                                },
                                                                            }} /> : null
                                                                }
                                                                {
                                                                    item.ev_estado == "PROCESO" || item.ev_estado == "FINALIZADO" || item.ev_estado == "PENDIENTE DE APROBAR" ?
                                                                        <MenuOption
                                                                            onSelect={() => {
                                                                                console.log(item);
                                                                                IngresarNuevoOsTicket()
                                                                                // ClonarOS(
                                                                                //     String(item.ticket_id),
                                                                                //     String(item.evento_id),
                                                                                //     item.ev_estado,
                                                                                //     item.OrdenServicioID,
                                                                                //     item.tck_tipoTicket,
                                                                                //     item.tipoIncidencia,
                                                                                //     item.tck_tipoTicketCod
                                                                                // )
                                                                            }}
                                                                            text='Clonar OS'
                                                                            customStyles={{
                                                                                optionText: {
                                                                                    fontSize: 16,
                                                                                    color: '#000000',
                                                                                    fontWeight: 'bold',
                                                                                    paddingBottom: 10,
                                                                                },
                                                                            }} /> : null
                                                                }

                                                                {
                                                                    item.ev_estado !== "PENDIENTE" && item.ev_estado !== "PROCESO" && item.ev_estado !== "PENDIENTE DE APROBAR" ?
                                                                        <MenuOption
                                                                            onSelect={() => EnviarOS(item.OrdenServicioID)}
                                                                            text='Enviar OS'
                                                                            customStyles={{
                                                                                optionText: {
                                                                                    fontSize: 16,
                                                                                    color: '#000000',
                                                                                    fontWeight: 'bold',
                                                                                    paddingBottom: 10,
                                                                                },
                                                                            }} /> : null
                                                                }
                                                                <MenuOption
                                                                    onSelect={() => VisualizarPdf(item.OrdenServicioID)}
                                                                    text='Visualizar PDF'
                                                                    customStyles={{
                                                                        optionText: {
                                                                            fontSize: 16,
                                                                            color: '#000000',
                                                                            fontWeight: 'bold',
                                                                        },
                                                                    }} />
                                                            </MenuOptions>
                                                        </Menu>
                                                    </View>

                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>
                                {/* </Pressable> */}
                            </View>


                            <TouchableOpacity
                                onPress={async () => await IngresarNuevoOsTicket()}
                                style={styles.opacity}>
                                <Text style={styles.text4}>INGRESAR NUEVO OS AL TICKET</Text>
                            </TouchableOpacity>
                            {

                                Fini ?
                                    <TouchableOpacity
                                        onPress={async () => await Finalizar()}
                                        style={{ ...styles.opacity, backgroundColor: '#FFFFFF', }}>
                                        <Text style={{ ...styles.text4, color: '#FF6B00' }}>FINALIZAR OS SELECCIONADO</Text>
                                    </TouchableOpacity>
                                    : null
                            }
                        </View>
                        :
                        <View style={styles.body}>
                            <View style={styles.body1}>
                                <Text style={{
                                    ...styles.header,
                                    fontSize: 15,
                                }}>Ticket #{ticket}</Text>
                                <Text style={{
                                    ...styles.header,
                                    fontSize: 15,
                                }}>{ClienteNombre}</Text>
                                <LoadingActi loading={Events.loading} />
                            </View>
                            <View style={styles.body2}>
                                <Text>Este ticket no tiene OS asociadas.</Text>
                            </View>
                            <View style={styles.body3}>
                                <TouchableOpacity
                                    onPress={() => IngresarNuevoOsTicket_()}
                                    style={styles.opacity}>
                                    <Text style={styles.text4}>INGRESAR NUEVO OS AL TICKET</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                }
                <ModalGenerico
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    titulo={"Envio de emails"}
                    txtboton1={"Enviar email"}
                    txtboton2={"Cancelar"}
                    subtitle={"Seleccione los emails a los que desea enviar la OS"}
                    contenflex={listadoEmails}
                    setlistadoEmails={setlistadoEmails}
                    idOrdenServicio={idOrdenServicio}
                />

                <BannerTicket
                    {...props}
                    navigation={navigation}
                />
            </View>) :
            <VisualizadorPDF
                url={pdfurl}
                setPdfview={setPdfview}
                setPdfurl={setPdfurl}
            />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "#FFF",
        alignItems: "center",
    },
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    body1: {
        flex: 5,
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        // paddingTop: 20,
    },
    body2: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    body3: {
        // flex: ,
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
    },
    text4: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
    },
    opacity: {
        justifyContent: "center",
        alignItems: "center",
        minWidth: "90%",
        padding: 20,
        backgroundColor: "#FF6B00",
        borderRadius: 30,
        marginBottom: 10,
        elevation: 5,
    },
    text: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Roboto',
        marginLeft: 10
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Roboto',
        margin: 10
    },
    boxOptions: {
        width: 'auto',
        height: 'auto',
        backgroundColor: '#ffffff',
        backgroundColor: '#ffffff',
        position: 'absolute',
        right: 50,
        top: 'auto',
        padding: 10,
        zIndex: 15,

        shadowColor: '#171717',
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
    },
    boxOptionsText: {
        fontsize: 18,
        padding: 5,
        zIndex: 10
    },
    modalInfo: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        minWidth: '40%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 11,
    },
    titleModalInfo: {
        fontWeight: '700',
        color: '#000000',
        fontSize: 16,
        paddingBottom: 5
    },
    textModalInfo: {
        fontSize: 16,
        color: '#666666'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop: 22,
    },
});