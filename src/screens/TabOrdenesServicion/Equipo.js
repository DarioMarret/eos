import { getHistorialEquiposStorage, getHistorialEquiposStoragId, isChecked, isCheckedCancelar, isCheckedCancelaReturn } from "../../service/historiaEquipo"
import { FlatList, ActivityIndicador, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal } from "react-native"
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getIngenierosStorageById } from "../../service/ingenieros"
import { getModeloEquiposStorage } from "../../service/modeloquipo"
import BannerOrderServi from "../../components/BannerOrdenServ"
import { DatosEquipo } from "../../service/OS_OrdenServicio"
import { useFocusEffect } from "@react-navigation/native"
import { getEquiposStorage } from "../../service/equipos"
import { useCallback, useEffect, useState } from "react"
import { Picker } from '@react-native-picker/picker'
import { OS, OS_Anexos, OS_CheckList, OS_Firmas, OS_PartesRepuestos, ticketID } from "../../utils/constantes"
import { getToken } from "../../service/usuario"
import LoadingActi from "../../components/LoadingActi"
import empty from "is-empty"
import isEmpty from "is-empty"
import { time } from "../../service/CargaUtil"

export default function Equipo(props) {
    const { navigation } = props
    const [equipo, setEquipo] = useState([])
    const [modelo, setModelo] = useState([])
    const [modelosub, setModeloSub] = useState([])
    const [historial, setHistorial] = useState([])

    const [loading, setLoading] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const [isdisabel, setDisable] = useState(true)
    const [isdisabelsub, setDisableSub] = useState(true)
    const [equipoSelect, setEquipoSelect] = useState({
        Modalidad: "",
        con_ClienteNombre: "",
        equ_SitioInstalado: "",
        equ_areaInstalado: "",
        equ_canton: "",
        equ_estado: "",
        equ_marca: "",
        equ_modalidad: "",
        equ_modeloEquipo: "",
        equ_provincia: "",
        equ_serie: "",
        equ_tipoEquipo: "",
        equipo_id: "",
        id_equipoContrato: "",
        marca: "",
        modelo: "",
        tipo: "",
    })

    const [tipo, setTipo] = useState("Tipo")
    const [model, setModel] = useState("Modelo")
    const [serie, setSerie] = useState("")


    const [infoModal, setInfoModal] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    const [typeInfo, setTypeInfo] = useState("")
    const [itemIndex, setItemIndex] = useState(null)
    const [isVisible, setIsVisible] = useState(false)

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setLoading(true)
                const response = await getEquiposStorage()
                setEquipo(response.sort((a, b) => a.tipo_descripcion.localeCompare(b.tipo_descripcion)))
                const modelos = await getModeloEquiposStorage()
                setModelo(modelos.sort((a, b) => a.modelo_descripcion.localeCompare(b.modelo_descripcion)))

                var os = JSON.parse(await AsyncStorage.getItem("OS"))
                const itenSelect = await AsyncStorage.getItem(ticketID)
                if (itenSelect != null) {
                    const item = JSON.parse(itenSelect)
                    const { equipo, OrdenServicioID, Accion } = item
                    // console.log("equipo", equipo)
                    if (Accion == "clonar") {

                        let equiId = await getHistorialEquiposStoragId(os.equipo_id)
                        console.log("equipo", equiId[0])
                        GuadadoOS(equiId[0])
                        equiId.map((item, index) => {
                            setTipo(item.tipo)
                            setSerie(item.equ_serie)
                            setModel(item.modelo)
                        })
                        equiId[0]['isChecked'] = 'true'
                        setHistorial(equiId)
                        setDisableSub(true)
                        setDisable(true)

                    } else if (Accion == "OrdenSinTicket") {

                        console.log("OrdenSinTicket")
                        console.log("OS", os)
                        setHistorial(await isCheckedCancelaReturn(2916))
                        setDisableSub(true)
                        setDisable(true)

                    } else if (Accion == "PENDIENTE") {

                        console.log("PENDIENTE")
                        let equiId = await getHistorialEquiposStoragId(os.equipo_id)
                        GuadadoOS(equiId[0])
                        equiId.map((item, index) => {
                            setTipo(item.tipo)
                            setSerie(item.equ_serie)
                            setModel(item.modelo)
                        })
                        equiId[0]['isChecked'] = 'true'
                        setHistorial(equiId)
                        setDisableSub(true)
                        setDisable(true)

                    } else if (Accion == "FINALIZADO") {

                        let equiId = await getHistorialEquiposStoragId(os.equipo_id)
                        GuadadoOS(equiId[0])
                        equiId.map((item, index) => {
                            setTipo(item.tipo)
                            setSerie(item.equ_serie)
                            setModel(item.modelo)
                        })
                        equiId[0]['isChecked'] = 'true'
                        setHistorial(equiId)
                        setDisableSub(false)
                        setDisable(true)

                    } else if (Accion == "NUEVO OS TICKET") {

                        console.log("NUEVO OS TICKET")
                        let equiId = await getHistorialEquiposStoragId(os.equipo_id)
                        console.log("equipo", equiId[0])
                        GuadadoOS(equiId[0])
                        setHistorial(equiId)
                        setDisableSub(true)
                        setDisable(true)

                    } else if (Accion == "PROCESO") {

                        console.log("PROCESO")
                        console.log("OS", os)
                        let equiId = await getHistorialEquiposStoragId(os.equipo_id)
                        GuadadoOS(equiId[0])
                        equiId.map((item, index) => {
                            setTipo(item.tipo)
                            setSerie(item.equ_serie)
                            setModel(item.modelo)
                        })
                        equiId[0]['isChecked'] = 'true'
                        setHistorial(equiId)
                    }
                }
                time(1000)
                setLoading(false)
            })()
        }, [])
    )


    async function onChangeTipo(tipo) {
        setLoading(true)
        setTipo(tipo)
        let result = await getHistorialEquiposStorage(tipo, "", "")
        const respuesta = modelo.filter(e => e.tipo_id === tipo)
        setModeloSub(respuesta)
        setHistorial(result)
        setLoading(false)
    }
    async function onChangeModelo(model) {
        setLoading(true)
        setModel(model)
        let result = await getHistorialEquiposStorage(tipo, model, "")
        setHistorial(result)
        setLoading(false)
    }

    async function onChangeSerie(text) {
        setSerie(text)
        let result = await getHistorialEquiposStorage("", "", text)
        setHistorial(result)
    }

    const handleChange = async (equipo_id) => {
        let temp = historial.map(async (hist) => {
            if (equipo_id == hist.equipo_id) {
                if (hist.isChecked == "true") {
                    setDisable(!isdisabel)
                    setHistorial(await isCheckedCancelaReturn(equipo_id))
                    return { ...hist, isChecked: "false" }
                } else {
                    let equipo = await isChecked(equipo_id)
                    setEquipoSelect(equipo[0])
                    setHistorial(equipo)
                    await GuadadoOS(equipo[0])
                    // console.log("equipo-->", equipo[0])
                    equipo.forEach((item) => {
                        setTipo(item.tipo)
                        setModel(item.modelo)
                        setSerie(item.equ_serie)
                    })
                    return { ...hist, isChecked: "true" }
                }
            }
            return hist;
        });
        setHistorial(temp);
    }
    const GuadadoOS = async (item) => {
        console.log(item.equipo_id)
        try {
            const { userId } = await getToken()
            const { IdUsuario } = await getIngenierosStorageById(userId)
            const os = await AsyncStorage.getItem("OS")
            const osItem = JSON.parse(os)
            console.log("controtal-->", osItem.contrato_id)
            osItem.equipo_id = item.equipo_id,//#
                osItem.contrato_id = item.id_contrato //#
            osItem.Serie = item.equ_serie,//#
                osItem.Marca = item.marca //#
            osItem.ClienteNombre = empty(osItem.ClienteNombre) ? item.con_ClienteNombre : osItem.ClienteNombre //#
            osItem.ObservacionCliente = "" //#
            osItem.IdEquipoContrato = Number(item.id_equipoContrato) //#
            osItem.EstadoEqPrevio = item.equ_estado //#
            osItem.EstadoEquipo = item.equ_estado //#
            osItem.TipoEquipo = item.equ_tipoEquipo //#
            osItem.ModeloEquipo = item.equ_modeloEquipo //#
            osItem.IngenieroID = IdUsuario//#
            osItem.empresa_id = 1 //#
            osItem.UsuarioCreacion = userId //#
            osItem.UsuarioModificacion = userId //#
            await AsyncStorage.setItem("OS", JSON.stringify(osItem))
            console.log("Equipo OS", osItem)
        } catch (error) {
            console.log("GuadadoOS en EQUIPO", error)
        }
        // }
    }

    const showSelect = (index, item) => {
        setItemIndex(index)
    }

    const showModal = (type, item) => {
        let body
        console.log("item", item, "item")
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
                                <Pressable onPress={() => handleChange(item.equipo_id)}>
                                    <MaterialCommunityIcons
                                        name={item.isChecked == "true" ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                                        size={24}
                                        color={item.isChecked == "true" ? "#FF6B00" : "#858583"}
                                    />
                                </Pressable>
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

    async function EquipoHistorial() {
        const itenSelect = await AsyncStorage.getItem(ticketID)
        const item = JSON.parse(itenSelect)
        const { OrdenServicioID, OSClone } = item
        if (OrdenServicioID != null && OSClone == null) {
            return
        }

        var result = []
        console.log("tipo", tipo, "model", model, "serie", serie)
        if (tipo !== "" && model !== "") {
            console.log("tipo", tipo, "Model", model)
            result = await getHistorialEquiposStorage(tipo, model, "")
        } else if (tipo !== "") {
            console.log("tipo", tipo)
            result = await getHistorialEquiposStorage(tipo, "", "")
        } else if (tipo !== "" && model !== "" && serie !== "") {
            console.log("tipo", tipo, "Model", model, "serie", serie)
            result = await getHistorialEquiposStorage(tipo, model, serie)
        } else if (tipo !== "" && serie !== "") {
            console.log("tipo", tipo, "serie", serie)
            result = await getHistorialEquiposStorage(tipo, "", serie)
        } else if (tipo == "" && model == "" && serie != "") {
            console.log("serie", serie)
            result = await getHistorialEquiposStorage("", "", serie)
        }
        setHistorial(result)
    }

    async function CancelarEvento() {
        setLoading(true)
        await AsyncStorage.removeItem(ticketID)
        await AsyncStorage.removeItem("OS_PartesRepuestos")
        await AsyncStorage.removeItem("OS_CheckList")
        await AsyncStorage.removeItem("OS_Firmas")
        await AsyncStorage.removeItem("OS_Anexos")
        await AsyncStorage.removeItem("OS")
        await AsyncStorage.setItem("OS_PartesRepuestos", JSON.stringify(OS_PartesRepuestos))
        await AsyncStorage.setItem("OS_CheckList", JSON.stringify(OS_CheckList))
        await AsyncStorage.setItem("OS_Firmas", JSON.stringify(OS_Firmas))
        await AsyncStorage.setItem("OS_Anexos", JSON.stringify(OS_Anexos))
        await AsyncStorage.setItem("OS", JSON.stringify(OS))
        await isCheckedCancelar()
        setTipo("Tipo")
        setModel("Modelo")
        setSerie("")
        setModeloSub([])
        setHistorial([])
        setLoading(false)
        navigation.navigate("Consultas")
    }

    return (
        <View style={styles.container}>
            {/* <ActivityIndicador size={100} color="#FF6B00" /> */}
            <View style={styles.contenedor}>
                <LoadingActi loading={loading} />
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
                    <TouchableOpacity style={styles.btn} onPress={() => console.log("Crear Equipo")}>
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
    }
})