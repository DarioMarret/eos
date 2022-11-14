import { getHistorialEquiposStorage, getHistorialEquiposStorageChecked, isChecked, isCheckedCancelar, isCheckedCancelaReturn } from "../../service/historiaEquipo"
import { FlatList, Pressable, ScrollView, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal } from "react-native"
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getIngenierosStorageById } from "../../service/ingenieros"
import { getModeloEquiposStorage } from "../../service/modeloquipo"
import BannerOrderServi from "../../components/BannerOrdenServ"
import { useFocusEffect } from "@react-navigation/native"
import { getEquiposStorage } from "../../service/equipos"
import { useCallback, useEffect, useState } from "react"
import { Picker } from '@react-native-picker/picker'
import { ticketID } from "../../utils/constantes"
import { getToken } from "../../service/usuario"
import LoadingActi from "../../components/LoadingActi"
import empty from "is-empty"
import { GetClienteClienteName } from "../../service/clientes"
import { useDispatch, useSelector } from "react-redux"
import { loadingCargando } from "../../redux/sincronizacion"
import { actualizarClienteTool, actualizarDatosTool, resetFormularioTool, SetByOrdenServicioID, setEquipoTool } from "../../redux/formulario"

export default function Equipo(props) {
    const { navigation } = props
    const [equipo, setEquipo] = useState([])
    const [modelo, setModelo] = useState([])
    const [modelosub, setModeloSub] = useState([])
    const [historial, setHistorial] = useState([])

    const [loading, setLoading] = useState(false)
    const [OrdenServicioID, setOrdenServicioID] = useState(0)


    const [modalCreateEquip, setModalCreateEquip] = useState(false)

    const [isdisabel, setDisable] = useState(true)
    const [isdisabelsub, setDisableSub] = useState(true)

    const [tipo, setTipo] = useState("Tipo")
    const [model, setModel] = useState("Modelo")
    const [serie, setSerie] = useState("")


    const [infoModal, setInfoModal] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    const [typeInfo, setTypeInfo] = useState("")
    const [itemIndex, setItemIndex] = useState(null)
    const [isVisible, setIsVisible] = useState(false)

    const Events = useSelector(s => s.sincronizacion)
    const EquipoStor = useSelector(s => s.formulario)
    const dispatch = useDispatch()

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setHistorial([])
                setTipo("Tipo")
                setModel("Modelo")
                setSerie("")
                var equipoCheck = await getHistorialEquiposStorageChecked()
                console.log("equipoCheck", equipoCheck)
                if (equipoCheck.length > 1) {
                    const itenSelect = await AsyncStorage.getItem(ticketID)
                    if (itenSelect != null) {
                        const item = JSON.parse(itenSelect)
                        const { equipo } = item
                        equipo.map((item, index) => {
                            if (equipoCheck[0].equipo_id == equipo[index].equipo_id) {
                                setTipo(item.tipo)
                                setSerie(item.equ_serie)
                                setModel(item.modelo)
                                GuadadoOS(item)
                                item.isChecked = "true"
                            }
                        })
                        setHistorial(equipo)
                    }
                } else {
                    const itenSelect = await AsyncStorage.getItem(ticketID)
                    if (itenSelect != null) {
                        const item = JSON.parse(itenSelect)
                        const { equipo } = item
                        if (equipo != null) {
                            equipo.map((item, index) => {
                                if(item.isChecked == "true"){
                                    setTipo(item.tipo)
                                    setSerie(item.equ_serie)
                                    setModel(item.modelo)
                                    GuadadoOS(item)
                                    // item.isChecked = "true"
                                }
                            })
                            await isChecked(equipo[0].equipo_id)
                            setHistorial(equipo)
                        }
                    }
                }
            })()
        }, [])
    )

    useFocusEffect(
        useCallback(() => {
            (async () => {
                dispatch(loadingCargando(true))
                const response = await getEquiposStorage()
                setEquipo(response.sort((a, b) => a.tipo_descripcion.localeCompare(b.tipo_descripcion)))
                const modelos = await getModeloEquiposStorage()
                setModelo(modelos.sort((a, b) => a.modelo_descripcion.localeCompare(b.modelo_descripcion)))

                const itenSelect = await AsyncStorage.getItem(ticketID)
                if (itenSelect != null) {
                    const item = JSON.parse(itenSelect)
                    const { equipo, OrdenServicioID, Accion } = item
                    console.log("OrdenServicioID", OrdenServicioID)
                    setOrdenServicioID(OrdenServicioID)
                    dispatch(SetByOrdenServicioID(OrdenServicioID))
                    if (Accion == "clonar") {

                        setDisableSub(true)
                        setDisable(true)

                    } else if (Accion == "OrdenSinTicket") {

                        console.log("OrdenSinTicket")
                        setDisableSub(true)
                        setDisable(true)

                    } else if (Accion == "PENDIENTE") {

                        console.log("PENDIENTE")
                        setDisableSub(true)
                        setDisable(true)

                    } else if (Accion == "FINALIZADO") {

                        setDisableSub(false)
                        setDisable(true)

                    } else if (Accion == "NUEVO OS TICKET") {

                        console.log("NUEVO OS TICKET")
                        setDisableSub(true)
                        setDisable(true)

                    } else if (Accion == "PROCESO") {

                        console.log("PROCESO")
                        setDisableSub(true)
                        setDisable(true)

                    } else if (Accion == "PENDIENTE DE APROBAR") {

                        console.log("PENDIENTE DE APROBAR")
                        setDisableSub(false)
                        setDisable(true)

                    }
                }
                dispatch(loadingCargando(false))
            })()
        }, [])
    )


    async function onChangeTipo(tipo) {
        dispatch(loadingCargando(true))
        setTipo(tipo)
        let result = await getHistorialEquiposStorage(tipo, null, null)
        console.log("onChangeTipo", result)
        if (result.length > 0) {
            const respuesta = modelo.filter(e => e.tipo_id === tipo)
            setModeloSub(respuesta)
            setHistorial(result)
        }
        dispatch(loadingCargando(false))
    }
    async function onChangeModelo(model) {
        dispatch(loadingCargando(true))
        setModel(model)
        let result = await getHistorialEquiposStorage(tipo, model, null)
        console.log("onChangeModelo", result)
        if (result.length > 0) {
            setHistorial(result)
        }
        dispatch(loadingCargando(false))
    }

    async function onChangeSerie(text) {
        setSerie(text)
        let result = await getHistorialEquiposStorage(null, null, text)
        console.log("onChangeSerie", result)
        if (result.length > 0) {
            setHistorial(result)
        }
    }

    const handleChange = async (equipo_id) => {
        var hist = []
        historial.map((item, index) => {
            if (item.equipo_id == equipo_id) {
                item.isChecked = 'true'
                GuadadoOS(item)
                setTipo(item.tipo)
                setSerie(item.equ_serie)
                setModel(item.modelo)
                isChecked(equipo_id).then((res) => {
                    console.log("res", res)
                })
            } else {
                item.isChecked = 'false'
            }
            hist.push(item)
        })
        setHistorial(hist)
    }

    const GuadadoOS = async (item) => {
        console.log("item", item)
        // try {
        dispatch(loadingCargando(true))
        const { userId } = await getToken()
        const { IdUsuario } = await getIngenierosStorageById(userId)
        const cliente = await GetClienteClienteName(item.con_ClienteNombre)
        const itenSelect = await AsyncStorage.getItem(ticketID)
        if (itenSelect != null) {
            const itemOS = JSON.parse(itenSelect)
            const { OrdenServicioID } = itemOS
            console.log("OrdenServicioID", OrdenServicioID)
            let equipo = {
                OrdenServicioID: OrdenServicioID,
                equipo_id: item.equipo_id, //#
                contrato_id: item.id_contrato, //#
                Serie: item.equ_serie, //#
                Marca: item.marca, //#
                ClienteID: !empty(EquipoStor.cliente.ClienteID) ? EquipoStor.cliente.ClienteID : cliente[0].CustomerID, //#
                ClienteNombre: !empty(EquipoStor.cliente.ClienteNombre) ? EquipoStor.cliente.ClienteNombre : item.con_ClienteNombre, //#
                ObservacionCliente: "", //#
                IdEquipoContrato: Number(item.id_equipoContrato), //#
                EstadoEqPrevio: item.equ_estado, //#
                EstadoEquipo: item.equ_estado, //#
                TipoEquipo: item.equ_tipoEquipo, //#
                ModeloEquipo: item.equ_modeloEquipo, //#
                IngenieroID: IdUsuario, //#
                UsuarioCreacion: userId, //#
                UsuarioModificacion: userId,
            }
            // console.log("equipo ok", equipo)
            dispatch(setEquipoTool(equipo))
            dispatch(actualizarClienteTool({
                name: 'ClienteID',
                value: equipo.ClienteID
            }))
            dispatch(actualizarClienteTool({
                name: 'ClienteNombre',
                value: item.con_ClienteNombre
            }))
            dispatch(actualizarDatosTool({
                name: 'EstadoEquipo',
                value: item.equ_estado
            }))
            dispatch(loadingCargando(false))
        }
    }

    const showSelect = (index, item) => {
        setItemIndex(index)
    }

    const showModal = (type, item) => {
        let body
        if (type === 'history') {
            body = item.historial !== 'null' ? JSON.parse(item.historial)[0] :
                {
                    ingenieroResp: "",
                    OrdenServicioID: "",
                    Fecha: "",
                    ComentarioUpgrade: "",
                    Sintomas: "",
                    Causas: "",
                    Diagnostico: "",
                    Acciones: "",
                    ObservacionIngeniero: ""
                }
        } else if (type === 'details') {
            body = {
                tipo: item.tipo,
                modelo: item.modelo,
                serie: item.equ_serie,
                estado: item.equ_estado,
                sitio: item.equ_SitioInstalado,
                area: item.equ_areaInstalado,
                marca: item.marca,
                cliente: item.con_ClienteNombre,
                sucursal: item.localidad_id,
            }
        }
        setShowPopup(true)
        setTypeInfo(type)
        setInfoModal(body)
        setIsVisible(false)
    }

    const _renderItem = ({ item, index, isClick }) => {
        return (
            <View style={{ flex: 1, padding: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    width: '100%',
                    minHeight: 100,
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderBottomWidth: 0.5,
                    borderColor: '#858583',
                    position: 'relative'
                }}>
                    <View>
                        {
                            isdisabelsub ?
                                (
                                    item.disable == 'true' ?
                                        <Pressable>
                                            <MaterialCommunityIcons
                                                name="checkbox-marked-circle"
                                                size={24}
                                                color={item.isChecked == "true" ? "#FF6B00" : "#323232"}
                                            />
                                        </Pressable>
                                        :
                                        <Pressable onPress={() => handleChange(item.equipo_id)}>
                                            <MaterialCommunityIcons
                                                name={item.isChecked == "true" ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                                                size={24}
                                                color={item.isChecked == "true" ? "#FF6B00" : "#858583"}
                                            />
                                        </Pressable>
                                )
                                :
                                <Pressable >
                                    <MaterialCommunityIcons
                                        name={item.isChecked == "true" ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                                        size={24}
                                        color={item.isChecked == "true" ? "#FF6B00" : "#858583"}
                                    />
                                </Pressable>
                        }
                    </View>
                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-start',
                        paddingHorizontal: 10
                    }}>
                        <Text style={{
                            fontSize: 12,
                            color: '#858583',
                        }}>{item.tipo + "/" + item.modelo + "/" + item.equ_serie}</Text>
                        <Text style={{
                            fontWeight: 'bold',
                        }}>{item.con_ClienteNombre}</Text>
                        <Text style={{
                            fontSize: 12,
                            color: '#858583',
                        }}>{item.equ_SitioInstalado + "/" + item.equ_areaInstalado}</Text>
                    </View>
                    <View >
                        <Text onPress={() => { showSelect(index, item); setIsVisible(!isVisible) }} style={{
                            rotation: 90,
                            padding: 10
                        }}>
                            <AntDesign name="ellipsis1" size={24} color="black" />
                        </Text>
                    </View>
                </View>

                {
                    isVisible && index === itemIndex &&
                    (<View style={styles.boxOptions} >
                        <TouchableOpacity style={styles.boxOptionsText} onPress={() => showModal('history', item)}>
                            <Text style={styles.boxOptionsText}>Historial de Equipo
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.boxOptionsText} onPress={() => showModal('details', item)}>
                            <Text style={styles.boxOptionsText}>Detalles de Equipo
                            </Text>
                        </TouchableOpacity>
                    </View>)

                }
            </View>
        )
    }

    async function CancelarEvento() {
        dispatch(loadingCargando(true))
        await isCheckedCancelar()
        setTipo("Tipo")
        setModel("Modelo")
        setSerie("")
        setModeloSub([])
        setHistorial([])
        dispatch(resetFormularioTool())
        dispatch(loadingCargando(false))
        // await AsyncStorage.removeItem(ticketID)
        const screen = await AsyncStorage.getItem("SCREMS")
        console.log("screen", screen)
        navigation.navigate(screen)
        // navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <Modal
                transparent={true}
                visible={modalCreateEquip}
                onRequestClose={() => {
                    setModalCreateEquip(!modalCreateEquip);
                }}
                propagateSwipe={true}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalContainer}>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            style={{ width: "100%", height: 'auto', marginLeft: 20 }}>
                            <Text style={{
                                fontSize: 20,
                                color: '#000',
                                fontFamily: 'Roboto',
                                fontWeight: 'bold',
                                textAlign: 'center',
                                marginTop: 10
                            }}>Crear Equipo</Text>
                            <View style={{ ...styles.ContainetEquipo, top: 0 }}>
                                <View style={styles.ContainetBuscador}>
                                    <View style={styles.ContainetTipoModelo}>

                                        <Picker
                                            style={{ ...styles.input, borderWidth: 1, borderColor: '#CECECA' }}
                                            selectedValue={tipo}
                                            onValueChange={(itemValue) => onChangeTipo(itemValue)}
                                            enabled={isdisabelsub}
                                        >
                                            <Picker.Item label={tipo} value={""} />
                                            {
                                                equipo ?
                                                    equipo.map((item, index) => (
                                                        <Picker.Item key={index + 1} label={item.tipo_descripcion} value={item.tipo_id} />
                                                    ))
                                                    : null
                                            }
                                        </Picker>
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }} />
                                    <View style={styles.ContainetTipoModelo}>
                                        <Picker
                                            style={{ ...styles.input, borderWidth: 1, borderColor: '#CECECA' }}
                                            selectedValue={model}
                                            enabled={isdisabelsub}
                                            onValueChange={(itemValue, itemIndex) => onChangeModelo(itemValue)}>

                                            <Picker.Item label={model} value={""} />
                                            {
                                                modelosub ?
                                                    modelosub.map((item, index) => (
                                                        <Picker.Item key={index + 1} label={item.modelo_descripcion} value={item.modelo_descripcion} />
                                                    ))
                                                    : null
                                            }
                                        </Picker>
                                    </View>
                                </View>
                                <View style={{
                                    flexDirection: "row",
                                    marginTop: "10%",
                                    width: "100%",
                                }}>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#CECECA',
                                            width: "95%",
                                            height: 60,
                                            borderRadius: 10,
                                            padding: 10
                                        }}
                                        value={serie}
                                        onChangeText={text => onChangeSerie(text)}
                                        placeholder="Serie"
                                        editable={isdisabelsub}
                                    />
                                </View>

                                <View style={styles.ContainetBuscador}>
                                    <View style={styles.ContainetTipoModelo}>

                                        <Picker
                                            style={{ ...styles.input, borderWidth: 1, borderColor: '#CECECA' }}
                                            selectedValue={tipo}
                                            onValueChange={(itemValue) => onChangeTipo(itemValue)}
                                            enabled={isdisabelsub}
                                        >
                                            <Picker.Item label={"Marca"} value={""} />
                                            {
                                                equipo ?
                                                    equipo.map((item, index) => (
                                                        <Picker.Item key={index + 1} label={item.tipo_descripcion} value={item.tipo_id} />
                                                    ))
                                                    : null
                                            }
                                        </Picker>
                                    </View>
                                    <View style={{ paddingHorizontal: 10 }} />
                                    <View style={styles.ContainetTipoModelo}>
                                        <Picker
                                            style={{ ...styles.input, borderWidth: 1, borderColor: '#CECECA' }}
                                            selectedValue={model}
                                            enabled={isdisabelsub}
                                            onValueChange={(itemValue, itemIndex) => onChangeModelo(itemValue)}>

                                            <Picker.Item label={"Estado"} value={""} />
                                            {
                                                modelosub ?
                                                    modelosub.map((item, index) => (
                                                        <Picker.Item key={index + 1} label={item.modelo_descripcion} value={item.modelo_descripcion} />
                                                    ))
                                                    : null
                                            }
                                        </Picker>
                                    </View>
                                </View>
                                <View style={{
                                    flexDirection: "row",
                                    marginTop: "10%",
                                    width: "100%",
                                }}>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#CECECA',
                                            width: "95%",
                                            height: 60,
                                            borderRadius: 10,
                                            padding: 10
                                        }}
                                        value={serie}
                                        onChangeText={text => onChangeSerie(text)}
                                        placeholder="Observación"
                                        editable={isdisabelsub}
                                    />
                                </View>
                            </View>
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: 'center', padding: 15, marginTop: 20 }}>
                                <TouchableOpacity >
                                    <Text style={{ backgroundColor: "#FF6B00", borderRadius: 50, color: "#FFFFFF", paddingHorizontal: 30, paddingVertical: 10 }}>CREAR</Text>
                                </TouchableOpacity>
                                <View style={{ paddingHorizontal: 20 }} />
                                <TouchableOpacity onPress={() => setModalCreateEquip(false)}>
                                    <Text style={{ backgroundColor: "#FFFFFF", borderColor: "#FF6B00", borderWidth: 1, borderRadius: 50, color: "#FF6B00", paddingHorizontal: 30, paddingVertical: 10 }}>CERRAR</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <View style={styles.contenedor}>
                <LoadingActi loading={Events.loading} />
                <View style={styles.ContainetEquipo}>
                    <View style={styles.ContainetBuscador}>
                        <View style={styles.ContainetTipoModelo}>

                            <Picker
                                style={{ ...styles.input, borderWidth: 1, borderColor: '#CECECA' }}
                                selectedValue={tipo}
                                onValueChange={(itemValue) => onChangeTipo(itemValue)}
                                enabled={isdisabelsub}
                            >
                                <Picker.Item label={tipo} value={""} />
                                {
                                    equipo ?
                                        equipo.map((item, index) => (
                                            <Picker.Item key={index + 1} label={item.tipo_descripcion} value={item.tipo_id} />
                                        ))
                                        : null
                                }
                            </Picker>
                        </View>
                        <View style={{ paddingHorizontal: 10 }} />
                        <View style={styles.ContainetTipoModelo}>
                            <Picker
                                style={{ ...styles.input, borderWidth: 1, borderColor: '#CECECA' }}
                                selectedValue={model}
                                enabled={isdisabelsub}
                                onValueChange={(itemValue, itemIndex) => onChangeModelo(itemValue)}>

                                <Picker.Item label={model} value={""} />
                                {
                                    modelosub ?
                                        modelosub.map((item, index) => (
                                            <Picker.Item key={index + 1} label={item.modelo_descripcion} value={item.modelo_descripcion} />
                                        ))
                                        : null
                                }
                            </Picker>
                        </View>
                    </View>
                    <View style={{
                        flexDirection: "row",
                        marginTop: "10%",
                        width: "100%",
                    }}>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#CECECA',
                                width: "95%",
                                height: 60,
                                borderRadius: 10,
                                padding: 10
                            }}
                            value={serie}
                            onChangeText={text => onChangeSerie(text)}
                            placeholder="Serie"
                            editable={isdisabelsub}
                        />
                    </View>
                    {/*  */}
                    <View style={{
                        justifyContent: 'flex-start',
                        height: "72%",
                    }}>
                        <SafeAreaView>
                            <FlatList
                                data={historial}
                                renderItem={_renderItem}
                                // numColumns={numColumns}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </SafeAreaView>
                    </View>

                    {/* <View style={styles.ContainetBuscador}>
                        <View style={styles.ContainetTipoModelo}>
                            <Picker
                                style={{ ...styles.input, borderWidth: 1, borderColor: '#CECECA' }}
                                selectedValue={selectedLanguage}
                                onValueChange={(itemValue, itemIndex) =>
                                    console.log(itemValue)
                                }>
                                <Picker.Item label="Marca" value={true} />
    
                            </Picker>
                        </View>
                        <View style={{ paddingHorizontal: 20 }} />
                        <View style={styles.ContainetTipoModelo}>
                            <Picker
                                style={{ ...styles.input, borderWidth: 1, borderColor: '#CECECA' }}
                                selectedValue={selectedLanguage}
                                onValueChange={(itemValue, itemIndex) =>
                                    console.log(itemValue)
                                }>
                                <Picker.Item label="Estado" value={true} />
                            </Picker>
                        </View>
                    </View> 
                    <View style={{
                        flexDirection: "row",
                        marginTop: "15%",
                        width: "100%",
                    }}>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#CECECA',
                                width: "90%",
                                height: 60,
                                borderRadius: 10,
                                padding: 10
                            }}
                            placeholder="Observación"
                        />
                    </View>
                    */}
                </View>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    marginTop: "10%",
                    height: "15%",
                    width: "100%",
                    backgroundColor: "#FFFFFF"
                }}>
                    <TouchableOpacity style={styles.btn} onPress={() => {
                        console.log("hola")
                    }/*setModalCreateEquip(true)*/
                    }>
                        <AntDesign name="plus" size={24} color="#FFF" />
                        <Text style={{
                            fontSize: 16,
                            color: '#FFF',
                            fontFamily: 'Roboto',
                            marginLeft: "5%"
                        }}>Crear Equipo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        ...styles.btn,
                        backgroundColor: '#FFF',
                        borderColor: '#FF6B00',
                        borderWidth: 1,
                    }} onPress={CancelarEvento}>
                        <AntDesign name="close" size={24} color="#FF6B00" />
                        <Text style={{
                            fontSize: 16,
                            color: '#FF6B00',
                            fontFamily: 'Roboto',
                            marginLeft: "5%"
                        }}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {showPopup &&
                <Modal
                    animationType="slide"
                    visible={true}
                    transparent={true}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "100%",
                        // backgroundColor: "#000000AA"
                    }}>
                        {typeInfo === "details" ?
                            <View style={styles.modalInfo}>
                                <View>
                                    <Text style={styles.titleModalInfo}>Detalles de Equipo</Text>
                                    <Text style={styles.textModalInfo}>Tipo: {infoModal.tipo}</Text>
                                    <Text style={styles.textModalInfo}>Modelo: {infoModal.modelo}</Text>
                                    <Text style={styles.textModalInfo}>Serie: {infoModal.equ_serie}</Text>
                                    <Text style={styles.textModalInfo}>Estado: {infoModal.equ_estado}</Text>
                                    <Text style={styles.textModalInfo}>Sitio instalado: {infoModal.equ_SitioInstalado}</Text>
                                    <Text style={styles.textModalInfo}>Área instalada: {infoModal.equ_areaInstalado}</Text>
                                    <Text style={styles.textModalInfo}>Marca: {infoModal.marca}</Text>
                                    <Text style={styles.textModalInfo}>Cliente: {infoModal.con_ClienteNombre}</Text>
                                    <Text style={styles.textModalInfo}>Sucursal: {infoModal.localidad_id}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setShowPopup(false)}
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 20,
                                        marginTop: 10,
                                        paddingHorizontal: 30,
                                        paddingVertical: 10,
                                        backgroundColor: '#FF6B00',
                                        padding: 5,
                                    }}>
                                    <Text style={{ fontSize: 18, color: '#FFF' }} >
                                        CERRAR</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={styles.modalInfo} >
                                <View>
                                    <Text style={styles.titleModalInfo}>Ultimo Historial del Equipo</Text>
                                    <Text style={styles.textModalInfo}>Ingeniero Resp.: {infoModal.ingenieroResp}</Text>
                                    <Text style={styles.textModalInfo}>Id Orden Servicio: {infoModal.OrdenServicioID}</Text>
                                    <Text style={styles.textModalInfo}>Fecha evento: {infoModal.Fecha}</Text>
                                    <Text style={styles.textModalInfo}>Upgrade: {infoModal.ComentarioUpgrade}</Text>
                                    <Text style={styles.textModalInfo}>Síntomas: {infoModal.Sintomas}</Text>
                                    <Text style={styles.textModalInfo}>Causas: {infoModal.Causas}</Text>
                                    <Text style={styles.textModalInfo}>Diagnóstico: {infoModal.Diagnostico}</Text>
                                    <Text style={styles.textModalInfo}>Acciones: {infoModal.Acciones}</Text>
                                    <Text style={styles.textModalInfo}>Comentarios: {infoModal.ObservacionIngeniero}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setShowPopup(false)}
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                        borderRadius: 20,
                                        marginTop: 10,
                                        paddingHorizontal: 30,
                                        paddingVertical: 10,
                                        backgroundColor: '#FF6B00',
                                        padding: 5,
                                    }}>
                                    <Text style={{ fontSize: 18, color: '#FFF' }} >
                                        CERRAR</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </Modal>
            }
            <BannerOrderServi
                {...props}
                navigation={navigation}
                screen={"2-CLIENTE"}
            />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#E5E5E5',
        position: 'relative'
    },
    contenedor: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#FFF',
        width: "100%",
    },
    input: {
        width: '100%',
    },
    ContainetEquipo: {
        flex: 1,
        top: "5%",
        borderColor: '#CECECA',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    ContainetBuscador: {
        flexDirection: 'row',
        width: '100%',
        top: "7%",
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    ContainetTipoModelo: {
        borderWidth: 1,
        width: '45%',
        borderColor: '#CECECA',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    btn: {
        flexDirection: 'row',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B00',
        padding: 15,
    },
    boxOptions: {
        width: 'auto',
        height: 'auto',
        backgroundColor: '#ffffff',
        position: 'absolute',
        right: 50,
        top: 'auto',
        padding: 10,
        zIndex: 10,

        shadowColor: '#171717',
        shadowOffset: { width: 4, height: 4 },
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
        height: "auto",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalContainer: {
        width: "90%",
        height: "auto",
        borderRadius: 5,
        backgroundColor: "#FFFFFF",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 5,
    },
})