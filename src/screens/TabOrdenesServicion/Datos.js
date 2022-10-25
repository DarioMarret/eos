import { StyleSheet, Text, Pressable, TextInput, View, Modal, Switch, SafeAreaView, TouchableOpacity, ScrollView, Alert, FlatList } from "react-native"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import BannerOrderServi from "../../components/BannerOrdenServ"
import { SelectCategoria } from "../../service/catalogos"
import { useFocusEffect } from "@react-navigation/native"
import { ticketID } from "../../utils/constantes"
import { Picker } from '@react-native-picker/picker'
import React, { useCallback, useEffect, useState } from "react"
import { AntDesign } from "@expo/vector-icons"
import moment from "moment"
import LoadingActi from "../../components/LoadingActi"
import { getHistorialEquiposStorageChecklist } from "../../service/historiaEquipo"
import { getToken } from "../../service/usuario"
import { loadingCargando } from "../../redux/sincronizacion"
import { useDispatch } from "react-redux"
import { useSelector } from "react-redux"
import { actualizarDatosTool, setChecklistTool } from "../../redux/formulario"
import isEmpty from "just-is-empty"

export default function Datos(props) {
    const { navigation } = props

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

    const [OrdenServicioID, setOrdenServicioID] = useState(0)

    const [isRecordatorio, setIsRecordatorio] = useState(false);
    const [isUpgrade, setIsUpgrade] = useState(false);
    const [isVisita, setIsVisita] = useState(false);
    const [estadoEquipo, setEstadoEquipo] = useState("")

    const [CategoriaTPCK, setCategoriaTPCK] = useState([])
    const [CategoriaTPINC, setCategoriaTPINC] = useState([])
    const [CategoriaESTEQ, setCategoriaESTEQ] = useState([])

    const [select, setSelect] = useState(true)


    const [ofCheck, setOfCheck] = useState(false)

    const [isEnabled, setIsEnabled] = useState(true);
    const [isdisabelsub, setDisableSub] = useState(true)

    const [showCheckList, setShowCheckList] = useState(false)
    const [listCheck, setListCheck] = useState([
    ])

    const Events = useSelector(s => s.sincronizacion)
    const DatosStor = useSelector(s => s.formulario)
    const dispatch = useDispatch()

    const [datos, setDatos] = useState({
        SitioTrabajo: "",
        tipoIncidencia: "",
        Causas: "",
        Sintomas: "",
        Diagnostico: "",
        EstadoEquipo: "",
        EstadoEqPrevio: "",
        Acciones: "",
        IncluyoUpgrade: false,
        ComentarioRestringido: "",
        ComentarioUpgrade: "",
        FechaSeguimiento: "",
        nuevaVisita: false,
        release: "",
        ObservacionIngeniero: "",
        TipoVisita: "",
        Seguimento: false,
    })
    function LimpiarData() {
        setDatos({
            SitioTrabajo: "",
            tipoIncidencia: "",
            Causas: "",
            Sintomas: "",
            Diagnostico: "",
            EstadoEquipo: "",
            EstadoEqPrevio: "",
            Acciones: "",
            IncluyoUpgrade: false,
            ComentarioRestringido: "",
            ComentarioUpgrade: "",
            FechaSeguimiento: "",
            nuevaVisita: false,
            release: "",
            ObservacionIngeniero: "",
            TipoVisita: "",
            Seguimento: false,
        })
    }

    async function ActivarChecklist(equipo_id) {
        var checklist = DatosStor.checklist
        if (checklist.length > 0) {
            console.log("checklist")
            dispatch(loadingCargando(true))
            var list_ = JSON.parse(await getHistorialEquiposStorageChecklist(equipo_id))
            var listCheck = []

            checklist.map((item, index) => {
                let obj = {
                    ...item,
                    check_actividad: list_[index].check_actividad
                }
                listCheck.push(obj)
            })

            console.log("list",listCheck)
            setListCheck(listCheck)
            setOfCheck(true)
            dispatch(loadingCargando(false))
        } else {
            console.log("no hay checklist")
            let lista = await getHistorialEquiposStorageChecklist(equipo_id)
            const list = JSON.parse(lista)
            // console.log("LISTA",list)
            if (list != null && list.length > 0) {
                const { userId } = await getToken()
                var l = list.map(item => {
                    return {
                        check_actividad: item.check_actividad,
                        OS_OrdenServicio: null,
                        CheckListID: 0,
                        OrdenServicioID: OrdenServicioID == 0 ? 0 : OrdenServicioID,
                        empresa_id: 1,
                        IdCheckList: item.check_id,//#CONSULTA
                        Checked: false,
                        UsuarioCreacion: userId,
                        FechaCreacion: `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
                        UsuarioModificacion: userId,
                        FechaModificacion: `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
                        Estado: "ACTI",
                        Observacion: item.check_observacion
                    }
                })
                setListCheck(l)
                setOfCheck(true)
            }
        }
    }

    function GuardarDatos(name, value) {
        dispatch(actualizarDatosTool({
            name,
            value
        }))
        setDatos({
            ...datos,
            [name]: value
        })
    }

    const hideTimePicker = () => {
        setDatePickerVisibility(!isDatePickerVisible);
    }


    const toggleSwitchRecordatorio = () => {
        setIsRecordatorio(!isRecordatorio)
    }
    const toggleSwitchUpgrade = () => {
        setIsUpgrade(!isUpgrade)
    }
    const toggleSwitchVisita = () => {
        setIsVisita(!isVisita);
    }


    useFocusEffect(
        useCallback(() => {
            LimpiarData()
            console.log("DatosStor", DatosStor.datos)
            console.log("EquipoStore", DatosStor.equipo)
            console.log("ClienteStore", DatosStor.cliente)
            setDatos(DatosStor.datos)
            if (DatosStor.datos.TipoVisita == "01" || DatosStor.datos.TipoVisita == "09") {
                ActivarChecklist(DatosStor.equipo.equipo_id)
                setOfCheck(true)
            }
        }, [DatosStor.datos])
    )

    useFocusEffect(
        useCallback(() => {
            (async () => {
                dispatch(loadingCargando(true))
                setCategoriaTPCK(await SelectCategoria("TPTCK"))
                setCategoriaTPINC(await SelectCategoria("TPINC"))
                setCategoriaESTEQ(await SelectCategoria("ESTEQ"))
                const itenSelect = await AsyncStorage.getItem(ticketID)
                if (itenSelect != null) {
                    const item = JSON.parse(itenSelect)
                    const { Accion, OrdenServicioID } = item
                    setOrdenServicioID(OrdenServicioID)
                    if (Accion == "FINALIZADO") {
                        
                        console.log("Estamos FINALIZADO")
                        setIsEnabled(false)
                        setDisableSub(false)
                        setSelect(false)

                    } else if (Accion == "clonar") {
                        console.log("Estamos clonar")
                        setSelect(true)
                        setIsEnabled(true)
                        setDisableSub(true)

                    } else if (Accion == "OrdenSinTicket") {

                        console.log("Estamos OrdenSinTicket")
                        setSelect(true)
                        setIsEnabled(true)
                        setDisableSub(true)

                    } else if (Accion == "PENDIENTE") {

                        console.log("Estamos PENDIENTE")
                        setSelect(false)
                        setIsEnabled(true)
                        setDisableSub(true)


                    } else if (Accion == "NUEVO OS TICKET") {

                        console.log("Estamos NUEVO OS TICKET")
                        setSelect(true)
                        setIsEnabled(true)
                        setDisableSub(true)

                    } else if (Accion == "PROCESO") {

                        console.log("Estamos PROCESO")
                        setSelect(false)
                        setIsEnabled(true)
                        setDisableSub(true)
                        
                    } else if (Accion == "PENDIENTE DE APROBAR") {
                            
                        console.log("Estamos PENDIENTE DE APROBAR")
                        setSelect(false)
                        setIsEnabled(true)
                        setDisableSub(true)
                    }
                }
                dispatch(loadingCargando(false))
            })()
        }, [])
    )

    const verChecklist = () => {
        if (listCheck.length > 0) {
            setShowCheckList(true)
        } else {
            Alert.alert("No hay checklist para mostrar")
        }
    }

    const GuardarChecklist = async () => {
        dispatch(loadingCargando(true))
        dispatch(setChecklistTool(listCheck))
        setShowCheckList(false)
        dispatch(loadingCargando(false))
    }


    const handleChecklist = async (text, index, item) => {
        const newlistcheck = [...listCheck]
        newlistcheck[index].Observacion = text
        console.log("newlistcheck", newlistcheck[index])
        setListCheck(newlistcheck)
        // dispatch(setChecklistTool(newlistcheck))
    }
    const checkedCheckList = (check, index) => {
        const newlistcheck = [...listCheck]
        newlistcheck[index].Checked = !check
        setListCheck(newlistcheck)
        // dispatch(setChecklistTool(newlistcheck))
    }
    const handleConfirmTime = async (time) => {
        let fec = new Date(time)
        dispatch(actualizarDatosTool({
            name: 'FechaSeguimiento',
            value: `${moment(fec).format("YYYY-MM-DDTHH:mm:ss.SSS")}`
        }))
        console.log("FechaSeguimiento", fec)
        setDatos({
            ...datos,
            FechaSeguimiento: `${moment(fec).format("YYYY-MM-DDTHH:mm:ss.SSS")}`,
        })
        hideTimePicker()
    }


    const _renderItem = ({ item, index }) => {
        return (
            <View style={styles.boxActivity} key={index}>
                <View style={styles.infoActivity}>
                    <Text style={{ color: "#666666" }}>{item.check_actividad}</Text>
                    <View style={{
                        ...styles.inputActivity
                    }}>
                        <TextInput
                            value={item.Observacion}
                            placeholder="Observación actividad"
                            onChangeText={text => {
                                handleChecklist(text, index, item)
                            }}
                        />
                    </View>
                </View>
                <View style={styles.iconActivity}>
                    <TouchableOpacity
                        onPress={() => checkedCheckList(item.Checked, index)}
                    >
                        <AntDesign
                            name='checkcircleo'
                            size={24}
                            color={item.Checked ? '#FF6B00' : '#666666'}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showCheckList}
                onRequestClose={() => {
                    setShowCheckList(!showCheckList);
                }}
            >
                <View style={styles.centeredView}>
                    <SafeAreaView>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Checklist</Text>
                            <FlatList
                                data={listCheck}
                                renderItem={_renderItem}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            <View style={{ width: "100%", flexDirection: "row", justifyContent: "flex-end" }}>
                                <Pressable
                                    style={styles.button}
                                    onPress={() => GuardarChecklist()}
                                >
                                    <Text style={{ ...styles.textStyle, color: "#FF6B00" }}>GRABAR</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.button}
                                    onPress={() => {
                                        setShowCheckList(!showCheckList)
                                    }}
                                >
                                    <Text style={styles.textStyle}>CERRAR</Text>
                                </Pressable>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>

            </Modal >



            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={styles.ContenedorCliente}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#FF6B00",
                            marginTop: 5,
                            marginLeft: 5,
                        }}>Ingreso de datos</Text>
                    <View style={styles.ContainerInputs}>
                        <LoadingActi loading={Events.loading} />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >
                            Tipo</Text>
                        <View style={styles.ContainerTipoModelo}>
                            <View
                                style={{
                                    width: "49%",
                                    height: 60,
                                    marginBottom: '6%',
                                    borderWidth: 1,
                                    borderColor: '#CECECA',
                                    borderRadius: 10,
                                }}>
                                {
                                    CategoriaTPCK.length > 0 ?
                                        <Picker
                                            style={styles.wFull}
                                            enabled={select}
                                            selectedValue={datos.TipoVisita}
                                            onValueChange={(itemValue) => {
                                                GuardarDatos('TipoVisita', itemValue)
                                            }}
                                        >
                                            {
                                                CategoriaTPCK.map((item, index) => (
                                                    item.IdCatalogoDetalle == datos.TipoVisita ?
                                                        <Picker.Item
                                                            key={index}
                                                            label={item.Descripcion}
                                                            value={item.IdCatalogoDetalle}
                                                            selected={true}
                                                        />
                                                        : <Picker.Item key={index} label={item.Descripcion} value={item.IdCatalogoDetalle} />
                                                ))
                                            }
                                        </Picker>
                                        : null
                                }
                            </View>
                            <TextInput
                                style={{
                                    ...styles.input,
                                    width: '49%',
                                }}
                                placeholder="Sitio de trabajo"
                                editable={isEnabled}
                                value={datos.SitioTrabajo}
                                onChangeText={async (itemValue) => GuardarDatos('SitioTrabajo', itemValue)}
                            />

                        </View>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            marginBottom: 20,
                            width: "100%",
                            backgroundColor: "#FFFFFF"
                        }}>
                            {
                                ofCheck ?
                                    <TouchableOpacity style={styles.btn} onPress={() => verChecklist()} >
                                        <Text style={{
                                            fontSize: 18,
                                            color: '#FFF',
                                            fontFamily: 'Roboto',
                                            marginLeft: 10
                                        }}>VER CHECKLIST</Text>
                                    </TouchableOpacity> : null
                            }
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >
                            Tipo de incidencia</Text>
                        <View style={{ paddingHorizontal: 20 }} />
                        <View
                            style={{
                                width: "100%",
                                height: 60,
                                marginBottom: '6%',
                                borderWidth: 1,
                                borderColor: '#CECECA',
                                borderRadius: 10,
                            }}>
                            {
                                CategoriaTPINC.length > 0 ?
                                    <Picker
                                        style={{
                                            width: '100%',
                                            height: 60,
                                            borderWidth: 1,
                                            borderColor: '#CECECA',
                                            padding: 10,

                                        }}
                                        selectedValue={datos.tipoIncidencia}
                                        enabled={select}
                                        onValueChange={(itemValue, itemIndex) => GuardarDatos('tipoIncidencia', itemValue)}>
                                        {
                                            CategoriaTPINC.map((item, index) => (
                                                item.IdCatalogoDetalle == datos.tipoIncidencia ?
                                                    <Picker.Item
                                                        key={index}
                                                        label={item.Descripcion}
                                                        value={item.IdCatalogoDetalle}
                                                        selected={true}
                                                    />
                                                    : <Picker.Item key={index} label={item.Descripcion} value={item.IdCatalogoDetalle} />
                                            ))
                                        }
                                    </Picker>
                                    : null
                            }
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >Problema reportado</Text>
                        <TextInput
                            style={{ ...styles.input, width: '100%', height: 80, textAlignVertical: 'top' }}
                            placeholder="Problema reportado:"
                            multiline
                            numberOfLines={3}
                            editable={isEnabled}
                            value={datos.Causas}
                            onChangeText={(text) => GuardarDatos('Causas', text)}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >Sintomas</Text>
                        <TextInput
                            style={{ ...styles.input, width: '100%', height: 80, textAlignVertical: 'top' }}
                            placeholder="Sintomas:"
                            multiline
                            numberOfLines={3}
                            editable={isEnabled}
                            value={datos.Sintomas}
                            onChangeText={(text) => GuardarDatos('Sintomas', text)}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >Diagnóstico/Resultado visita*</Text>
                        <TextInput
                            style={{ ...styles.input, width: '100%', height: 80, textAlignVertical: 'top' }}
                            placeholder="Diagnóstico/Resultado visita*:"
                            multiline
                            numberOfLines={3}
                            editable={isEnabled}
                            value={datos.Diagnostico}
                            onChangeText={(text) => GuardarDatos('Diagnostico', text)}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >Estado del equipo</Text>
                        <View style={{
                            width: "100%",
                            height: 60,
                            marginBottom: '6%',
                            borderWidth: 1,
                            borderColor: '#CECECA',
                            borderRadius: 10,
                        }}>

                            <Picker
                                style={{
                                    width: '100%',
                                    height: 60,
                                    borderWidth: 1,
                                    borderColor: '#CECECA',
                                    padding: 10,

                                }}
                                selectedValue={datos.EstadoEquipo}
                                enabled={true}
                                onValueChange={(itemValue, itemIndex) =>
                                    GuardarDatos('EstadoEquipo', itemValue)
                                }>
                                {
                                    CategoriaESTEQ ?
                                        CategoriaESTEQ.map((item, index) => (
                                            // console.log('entro', datos.EstadoEquipo) ,
                                            datos.EstadoEquipo == item.IdCatalogoDetalle ?
                                                <Picker.Item
                                                    key={index + 1}
                                                    label={item.Descripcion}
                                                    value={item.IdCatalogoDetalle}
                                                    selected={true}
                                                />
                                                : <Picker.Item key={index} label={item.Descripcion} value={item.IdCatalogoDetalle} />
                                        ))
                                        : null
                                }
                            </Picker>


                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >Acción inmediata</Text>
                        <TextInput
                            // style={styles.input}
                            style={{ ...styles.input, width: '100%', height: 80, textAlignVertical: 'top' }}
                            placeholder="Acción inmediata"
                            multiline
                            numberOfLines={3}
                            editable={isEnabled}
                            value={datos.Acciones}
                            onChangeText={(text) => GuardarDatos('Acciones', text)}
                        />
                        <View style={{
                            ...styles.wFull,
                            width: '100%',
                            height: 'auto',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '6%'
                        }}>
                            <View style={{
                                ...styles.wFull,
                                height: 60,
                                width: '45%',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 16, marginRight: 4
                                }}>Recordatorio</Text>
                                <Switch
                                    trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
                                    thumbColor={isRecordatorio ? "#FF6B00" : "#ffffff"}
                                    ios_backgroundColor="#FFAF75"
                                    onValueChange={() => {
                                        toggleSwitchRecordatorio()
                                        GuardarDatos('Seguimento', !isRecordatorio)
                                    }}
                                    value={isRecordatorio}
                                />
                            </View>
                            <TextInput
                                style={{ ...styles.input, marginBottom: 0, width: '55%' }}
                                placeholder="Inf. adicional"
                                editable={isEnabled}
                                value={datos.ComentarioRestringido}
                                onChangeText={(text) => GuardarDatos('ComentarioRestringido', text)}
                            />
                        </View>
                        <View style={{
                            ...styles.wFull,
                            width: '100%',
                            height: 'auto',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '6%'
                        }}>
                            <View style={{
                                ...styles.wFull,
                                height: 60,
                                width: '45%',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}>
                                <Text style={{
                                    fontWeight: "bold",
                                    fontFamily: "Roboto",
                                    fontSize: 16, marginRight: 4
                                }}>Incluye Upgrade:</Text>
                                <Switch
                                    trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
                                    thumbColor={isUpgrade ? "#FF6B00" : "#ffffff"}
                                    ios_backgroundColor="#FFAF75"
                                    onValueChange={() => {
                                        toggleSwitchUpgrade()
                                        GuardarDatos('IncluyoUpgrade', !isUpgrade)
                                        // setDatos({ ...datos, IncluyoUpgrade: !isUpgrade ? true : false })
                                    }}
                                    value={isUpgrade}
                                />
                            </View>
                            <TextInput
                                style={{ ...styles.input, marginBottom: 0, width: '55%' }}
                                placeholder="Inf. adicional"
                                editable={isEnabled}
                                value={datos.ComentarioUpgrade}
                                onChangeText={(text) => GuardarDatos('ComentarioUpgrade', text)}
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >Fecha Recordatorio</Text>
                        <TouchableOpacity
                            onPress={() => hideTimePicker()}
                            style={{
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
                                style={{ width: "80%", height: "100%" }}
                                placeholder='Fecha Recordatorio'
                                editable={false}
                                value={
                                    !isEmpty(datos.FechaSeguimiento) ? datos.FechaSeguimiento.split('T')[0]
                                        : ''
                                }
                            />
                            <View
                                style={{
                                    width: "20%",
                                    height: "100%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: 0,
                                }}
                            >
                                <AntDesign

                                    name='clockcircleo'
                                    size={24}
                                    color='#000000'
                                />
                            </View>
                        </TouchableOpacity>
                        <View style={{
                            ...styles.wFull,
                            height: 60,
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: '4%'
                        }}>
                            <Text style={{
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                                fontSize: 16,
                                marginRight: '5%'
                            }}>Requiere nueva visita</Text>
                            <Switch
                                trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
                                thumbColor={isVisita ? "#FF6B00" : "#ffffff"}
                                ios_backgroundColor="#FFAF75"
                                onValueChange={() => {
                                    toggleSwitchVisita()
                                    GuardarDatos('nuevaVisita', !isVisita)
                                }}
                                value={isVisita}
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >Release</Text>
                        <TextInput
                            style={{ ...styles.input, width: '100%' }}
                            placeholder="Release"
                            editable={isEnabled}
                            value={datos.release}
                            onChangeText={(text) => {
                                GuardarDatos('release', text)
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >Observación Ingeniero</Text>
                        <TextInput
                            style={{ ...styles.input, width: '100%', height: "10%", textAlignVertical: 'top' }}
                            placeholder="Observación Ingeniero"
                            multiline
                            numberOfLines={4}
                            editable={isEnabled}
                            value={datos.ObservacionIngeniero}
                            onChangeText={(text) => GuardarDatos('ObservacionIngeniero', text)}
                        />
                        {/* <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}
                        >
                            {
                                isEnabled ?
                                    <Text style={{ fontSize: 16, marginRight: 4 }}>Editable:</Text>
                                    : <Text style={{ fontSize: 16, marginRight: 4 }}>Guardado:</Text>
                            }
                            <Switch
                                trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
                                thumbColor={isEnabled ? "#FF6B00" : "#ffffff"}
                                ios_backgroundColor="#FFAF75"
                                onValueChange={() => SwitchGuardar()}
                                value={isEnabled}
                            />
                        </View> */}
                    </View>
                    <View style={{ padding: 50 }} ></View>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode='date'
                        onConfirm={handleConfirmTime}
                        onCancel={hideTimePicker}
                        style={{ color: "#FF6B00" }}
                    />
                </View>
            </ScrollView>
            <BannerOrderServi
                {...props}
                navigation={navigation}
                screen={"3-DATOS"}
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
        marginTop: 25,
        flex: 1,
        width: "100%",
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 15,
        paddingRigth: 20,

    },
    ContainerInputs: {
        flexDirection: "column",
        // padding: 10,
        height: "auto",
        width: "100%",
    },

    ContainetBuscador: {
        flexDirection: 'row',
        width: '100%',
        top: "7%",
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    ContainerTipoModelo: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    wFull: {
        width: "100%",
    },
    input: {
        borderWidth: 1,
        borderColor: '#CECECA',
        width: "auto",
        height: 60,
        borderRadius: 10,
        padding: 10,
        marginBottom: "6%"
    },
    btn: {
        width: '100%',
        flexDirection: 'row',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B00',
        padding: 15,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 5,
        paddingVertical: 20,
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "90%",
        maxHeight: "90%",
        overflow: "scroll"
    },
    modalText: {
        marginBottom: 15,
        marginLeft: 20,
        textAlign: "left",
        fontSize: 16
    },
    button: {

    },
    textStyle: {
        color: "#7B7B7B",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 18,
        padding: 20
    },
    boxActivity: {
        width: "100%",
        height: "auto",
        flexDirection: 'row',
        alignItems: "center",
        borderBottomColor: '#D6D6D6',
        borderBottomWidth: 1,
        paddingVertical: 10,
        padding: 20
    },
    infoActivity: {
        width: "85%",
    },
    inputActivity: {
        width: "100%",
        borderRadius: 10,
        borderColor: "#666666",
        borderWidth: 1,
        padding: 10,
        marginTop: 10
    },
    iconActivity: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    }
});
