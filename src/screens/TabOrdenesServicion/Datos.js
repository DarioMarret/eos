import { CambieEstadoSwitch, ListaComponentes, ListaDiagnostico } from "../../service/config"
import { StyleSheet, Text, Pressable, TextInput, View, Modal, Switch, SafeAreaView, TouchableOpacity, ScrollView, Alert, FlatList } from "react-native"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import BannerOrderServi from "../../components/BannerOrdenServ"
import { SelectCategoria } from "../../service/catalogos"
import { useFocusEffect } from "@react-navigation/native"
import { DATOS_, ticketID } from "../../utils/constantes"
import { Picker } from '@react-native-picker/picker'
import React, { useCallback, useState } from "react"
import { AntDesign } from "@expo/vector-icons"
import moment from "moment"
import LoadingActi from "../../components/LoadingActi"
import { getHistorialEquiposStorageChecklist } from "../../service/historiaEquipo"
import { getToken } from "../../service/usuario"

export default function Datos(props) {
    const { navigation } = props

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

    const [isRecordatorio, setIsRecordatorio] = useState(false);
    const [isUpgrade, setIsUpgrade] = useState(false);
    const [isVisita, setIsVisita] = useState(false);
    const [incidente, setIncidente] = useState([]);
    const [estadoEquipo, setEstadoEquipo] = useState([])

    const [CategoriaTPCK, setCategoriaTPCK] = useState([])
    const [CategoriaTPINC, setCategoriaTPINC] = useState([])
    const [CategoriaESTEQ, setCategoriaESTEQ] = useState([])

    const [select, setSelect] = useState(false)


    const [ofCheck, setOfCheck] = useState(false)

    const [isEnabled, setIsEnabled] = useState(true);
    const [isdisabelsub, setDisableSub] = useState(true)

    const [loading, setLoading] = useState(false)

    const [showCheckList, setShowCheckList] = useState(false)
    const [listCheck, setListCheck] = useState([
    ])



    const [datos, setDatos] = useState({
        SitioTrabajo: "",
        tipoIncidencia: "",
        Causas: "",
        Sintomas: "",
        Diagnostico: "",
        EstadoEquipo: "",
        Acciones: "",
        IncluyoUpgrade: false,
        ComentarioRestringido: "",
        ComentarioUpgrade: "",
        FechaSeguimiento: "",
        nuevaVisita: false,
        release: "",
        ObservacionIngeniero: "",
        FechaSeguimiento: "",
        FechaSeguimientoMostrar: "",
        TipoVisita: "",
        TipoVistaDescripcion: "",
        Seguimento: false,
    })

    async function ActivarChecklist(equipo_id) {
        var checklist = await JSON.parse(await AsyncStorage.getItem("OS_CheckList"))
        if (checklist.length > 0) {
            console.log("ActivarChecklist", checklist)
            const list = JSON.parse(await getHistorialEquiposStorageChecklist(equipo_id))
            var listCheck = []
            for (let index = 0; index < list.length; index++) {
                var lis = list[index].check_id;
                for (let i = 0; i < checklist.length; i++) {
                    if (lis == checklist[i].IdCheckList) {
                        checklist[i].check_actividad = list[index].check_actividad
                        listCheck.push(checklist[i])
                    }
                }
            }
            setListCheck(listCheck)
            setOfCheck(true)
        } else {
            const list = JSON.parse(await getHistorialEquiposStorageChecklist(equipo_id))
            console.log("list", list)
            if (list != null) {
                const { userId } = await getToken()
                var l = list.map(item => {
                    return {
                        check_actividad: item.check_actividad,
                        OS_OrdenServicio: null,
                        CheckListID: 0,
                        OrdenServicioID: 0,
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

    async function TipoVisitadescripcion(items) {
        console.log("TipoVisitadescripcion", items)
        const os = await AsyncStorage.getItem("OS")
        const osItem = JSON.parse(os)
        osItem.TipoVisita = items
        await AsyncStorage.setItem("OS", JSON.stringify(osItem))
        setDatos({
            ...datos,
            TipoVisita: items
        })

        if (items == "01" || items == "09") {
            ActivarChecklist(osItem.equipo_id)
            setOfCheck(true)
        }
    }

    async function TipoIncidencia(items) {

        console.log("TipoIncidencia", items)
        const os = await AsyncStorage.getItem("OS")
        const osItem = JSON.parse(os)
        osItem.tipoIncidencia = items
        await AsyncStorage.setItem("OS", JSON.stringify(osItem))
        setDatos({
            ...datos,
            tipoIncidencia: items
        })
    }
    const handleOnchange = async (name, value) => {
        setDatos({
            ...datos,
            [name]: value
        })
        const os = JSON.parse(await AsyncStorage.getItem("OS"))
        os[name] = value
        await AsyncStorage.setItem("OS", JSON.stringify(os))

    }
    const handleConfirmTime = async (time) => {
        let fec = new Date()
        const os = JSON.parse(await AsyncStorage.getItem("OS"))
        os.FechaSeguimiento = fec
        await AsyncStorage.setItem("OS", JSON.stringify(os))
        setDatos({
            ...datos,
            FechaSeguimiento: fec,
            FechaSeguimientoMostrar: moment(time).format("DD/MM/YYYY")
        })
        hideTimePicker()
    }

    const hideTimePicker = () => {
        setDatePickerVisibility(!isDatePickerVisible);
    }


    const toggleSwitchRecordatorio = () => {
        setIsRecordatorio(!isRecordatorio)
        setDatos({
            ...datos,
            recordatorio: !isRecordatorio
        })
    }
    const toggleSwitchUpgrade = () => {
        setIsUpgrade(!isUpgrade)
        setDatos({
            ...datos,
            incluyeupgrade: !isUpgrade
        })
    }
    const toggleSwitchVisita = () => {
        setIsVisita(!isVisita);
        setDatos({
            ...datos,
            requiereVisita: !isVisita
        })
    }

    useFocusEffect(
        useCallback(() => {
            (async () => {
                setCategoriaTPCK(await SelectCategoria("TPTCK"))
                setCategoriaTPINC(await SelectCategoria("TPINC"))
                setCategoriaESTEQ(await SelectCategoria("ESTEQ"))
                var osItem = JSON.parse(await AsyncStorage.getItem("OS"))
                const itenSelect = await AsyncStorage.getItem(ticketID)
                if (itenSelect != null) {
                    const item = JSON.parse(itenSelect)
                    const { Accion } = item

                    if (Accion == "FINALIZADO") {
                        console.log("Estamos FINALIZADO")
                        TipoVisitadescripcion(osItem.TipoVisita)
                        TipoIncidencia(osItem.tipoIncidencia)

                        setDatos({
                            ...osItem,
                            FechaSeguimientoMostrar: moment(osItem.FechaSeguimiento).format("DD/MM/YYYY")
                        })
                        setIsEnabled(false)
                        setDisableSub(false)
                    } else if (Accion == "clonar") {
                        console.log("Estamos clonar")

                        TipoVisitadescripcion(osItem.TipoVisita)
                        TipoIncidencia(osItem.tipoIncidencia)


                        setDatos({
                            ...osItem,
                            FechaSeguimientoMostrar: moment(osItem.FechaSeguimiento).format("DD/MM/YYYY")
                        })
                        setIsEnabled(true)
                        setDisableSub(true)

                    } else if (Accion == "OrdenSinTicket") {

                        console.log("Estamos OrdenSinTicket")

                        console.log("osItem", datos.FechaSeguimientoMostrar)
                        setDatos({
                            ...osItem,
                            FechaSeguimientoMostrar: moment(osItem.FechaSeguimiento).format("DD/MM/YYYY")
                        })
                        setIsEnabled(true)
                        setDisableSub(true)
                        setOfCheck(false)
                        osItem.TipoVisita == "01" || osItem.TipoVisita == "09"
                            ? ActivarChecklist() : setOfCheck(false)
                        console.log("Checklist", await AsyncStorage.getItem("OS_CheckList"))

                    } else if (Accion == "PENDIENTE") {

                        console.log("Estamos PENDIENTE")
                        // TipoVisitadescripcion(osItem.TipoVisita)
                        // TipoIncidencia(osItem.tipoIncidencia)
                        // console.log("osItem", osItem)
                        delete osItem.OS_ASUNTO
                        delete osItem.OS_Anexos
                        delete osItem.OS_FINALIZADA
                        setDatos({
                            ...osItem,
                            FechaSeguimientoMostrar: moment(osItem.FechaSeguimiento).format("DD/MM/YYYY")
                        })
                        osItem.TipoVisita == "01" || osItem.TipoVisita == "09"
                            ? ActivarChecklist() : setOfCheck(false)
                        setIsEnabled(true)
                        setDisableSub(true)

                    } else if (Accion == "NUEVO OS TICKET") {

                        console.log("Estamos NUEVO OS TICKET")
                        setDatos({
                            ...datos,
                            ...osItem,
                            FechaSeguimientoMostrar: moment(osItem.FechaSeguimiento).format("DD/MM/YYYY")
                        })
                        setIsEnabled(true)
                        setDisableSub(true)
                    } else if (Accion == "PROCESO") {

                        console.log("Estamos PROCESO")
                        setDatos({
                            ...osItem,
                            FechaSeguimientoMostrar: moment(osItem.FechaSeguimiento).format("DD/MM/YYYY")
                        })
                        setSelect(false)//desabilidar select en este estado
                        setIsEnabled(true)
                        setDisableSub(true)
                        osItem.TipoVisita == "01" || osItem.TipoVisita == "09"
                            ? ActivarChecklist(osItem.equipo_id) : setOfCheck(false)

                    }
                }

                const inci = await ListaComponentes()
                setIncidente(inci)

                const estadoE = await ListaDiagnostico()
                setEstadoEquipo(estadoE)

                // let est = await EstadoSwitch(2)
                // if (est.estado == 1) {
                //     setIsEnabled(!true)
                // } else {
                //     setIsEnabled(!false)
                // }
            })()
        }, [])
    )

    const SwitchGuardar = async () => {
        setIsEnabled(!isEnabled)
        if (isEnabled) {
            await GuadadoOS()
            let estado = await CambieEstadoSwitch(2, 1)
            console.log("estado datos", estado.estado)
            await AsyncStorage.setItem(DATOS_, JSON.stringify({
                ...datos
            }))
        } else {
            let estado = await CambieEstadoSwitch(2, 0)

            console.log("estado datos", estado.estado)
        }
    }

    const GuadadoOS = async () => {
        const os = await AsyncStorage.getItem("OS")
        const osItem = JSON.parse(os)
        osItem.Acciones = datos.Acciones,//# accion inmediata
            osItem.Causas = datos.Causas, //# Problema reportado
            osItem.Sintomas = datos.Sintomas, //# sintomas
            osItem.Diagnostico = datos.Diagnostico, //# diagnostico
            osItem.EstadoEquipo = datos.EstadoEquipo, //# estado del equipo
            osItem.ComentarioRestringido = datos.ComentarioRestringido, //# inf. adicional 1
            osItem.ComentarioUpgrade = datos.ComentarioUpgrade, //# inf. adicional 2
            osItem.IncluyoUpgrade = datos.IncluyoUpgrade, //# IncluyoUpgrade estado true false
            osItem.release = datos.release, //# release
            osItem.ObservacionIngeniero = datos.ObservacionIngeniero, //# ObservacionIngeniero
            osItem.nuevaVisita = datos.nuevaVisita, //# requiere nueva visita
            osItem.Seguimento = datos.Seguimento, //# sequimiento
            await AsyncStorage.setItem("OS", JSON.stringify(osItem))
    }

    const verChecklist = () => {
        if (listCheck.length > 0) {
            setShowCheckList(true)
        } else {
            Alert.alert("No hay checklist para mostrar")
        }
    }

    const GuardarChecklist = async () => {
        await AsyncStorage.setItem("OS_CheckList", JSON.stringify(listCheck))
        console.log("Checklist", listCheck)
        setShowCheckList(false)
    }


    const handleChecklist = async (text, index, item) => {
        const newlistcheck = [...listCheck]
        newlistcheck[index].Observacion = text
        console.log("newlistcheck", newlistcheck[index])
        setListCheck(newlistcheck)
    }
    const checkedCheckList = (check, index) => {
        const newlistcheck = [...listCheck]
        newlistcheck[index].Checked = !check
        setListCheck(newlistcheck)
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
                            editable
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
                        <LoadingActi loading={loading} />
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
                                            selectedValue={datos.TipoVisita != "" ? datos.TipoVisita : datos.TipoVisita}
                                            onValueChange={(itemValue) => TipoVisitadescripcion(itemValue)}
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
                                onChangeText={async (itemValue) => handleOnchange('SitioTrabajo', itemValue)}
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
                                        onValueChange={(itemValue, itemIndex) => TipoIncidencia(itemValue)}>
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
                            onChangeText={(text) => handleOnchange('Causas', text)}
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
                            onChangeText={(text) => handleOnchange('Sintomas', text)}
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
                            onChangeText={(text) => handleOnchange('Diagnostico', text)}
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
                                enabled={isEnabled}
                                onValueChange={(itemValue, itemIndex) =>
                                    handleOnchange('EstadoEquipo', itemValue)
                                    // setDatos({ ...datos, EstadoEquipo: itemValue })
                                }>
                                {
                                    CategoriaESTEQ.length > 0 ?
                                        CategoriaESTEQ.map((item, index) => (
                                            item.IdCatalogoDetalle == datos.EstadoEquipo ?
                                                <Picker.Item
                                                    key={index}
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
                            onChangeText={(text) => handleOnchange('Acciones', text)}
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
                                    fontSize: 16, marginRight: 4 }}>Recordatorio</Text>
                                <Switch
                                    trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
                                    thumbColor={isRecordatorio ? "#FF6B00" : "#ffffff"}
                                    ios_backgroundColor="#FFAF75"
                                    onValueChange={() => {
                                        toggleSwitchRecordatorio()
                                        handleOnchange('Seguimento', !isRecordatorio)
                                        // setDatos({ ...datos, Seguimento: !isRecordatorio ? true : false })
                                    }}
                                    value={isRecordatorio}
                                />
                            </View>
                            <TextInput
                                style={{ ...styles.input, marginBottom: 0, width: '55%' }}
                                placeholder="Inf. adicional"
                                editable={isEnabled}
                                value={datos.ComentarioRestringido}
                                onChangeText={(text) => handleOnchange('ComentarioRestringido', text)}
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
                                    fontSize: 16, marginRight: 4 }}>Incluye Upgrade:</Text>
                                <Switch
                                    trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
                                    thumbColor={isUpgrade ? "#FF6B00" : "#ffffff"}
                                    ios_backgroundColor="#FFAF75"
                                    onValueChange={() => {
                                        toggleSwitchUpgrade()
                                        handleOnchange('IncluyoUpgrade', !isUpgrade)
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
                                onChangeText={(text) => handleOnchange('ComentarioUpgrade', text)}
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                fontFamily: "Roboto",
                            }}
                        >Fecha Recordatorio</Text>
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
                                style={{ width: "80%", height: "100%" }}
                                placeholder='Fecha Recordatorio'
                                editable={false}
                                value={datos.FechaSeguimientoMostrar}
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
                                    onPress={() => hideTimePicker()}
                                    name='clockcircleo'
                                    size={24}
                                    color='#000000'
                                />
                            </View>
                        </View>
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
                                    // setDatos({ ...datos, nuevaVisita: !isVisita ? true : false })
                                    handleOnchange('nuevaVisita', !isVisita)
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
                                handleOnchange('release', text)
                                // setDatos({ ...datos, release: text })
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
                            onChangeText={(text) => handleOnchange('ObservacionIngeniero', text)}
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
        </View >
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
