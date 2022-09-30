import { CambieEstadoSwitch, EstadoSwitch, ListaComponentes, ListaDiagnostico } from "../../service/config"
import { getOrdenServicioAnidadasTicket_id } from "../../service/OrdenServicioAnidadas"
import { StyleSheet, Text, Pressable, TextInput, View, Modal, Switch, TouchableOpacity, ScrollView, Alert } from "react-native"
import { DatosOSOrdenServicioID } from "../../service/OS_OrdenServicio"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import AsyncStorage from "@react-native-async-storage/async-storage"
import BannerOrderServi from "../../components/BannerOrdenServ"
import { SelectCategoria } from "../../service/catalogos"
import { useFocusEffect } from "@react-navigation/native"
import { DATOS_, OS_CheckList, os_checklist, ticketID } from "../../utils/constantes"
import { Picker } from '@react-native-picker/picker'
import React, { useCallback, useState } from "react"
import { AntDesign } from "@expo/vector-icons"
import Firmador from "../../components/Firmador"
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


    const [ofCheck, setOfCheck] = useState(false)

    const [tipo, setTipo] = useState("");

    const [isEnabled, setIsEnabled] = useState(false);
    const [isdisabelsub, setDisableSub] = useState(true)

    const [loading, setLoading] = useState(false)

    const [showCheckList, setShowCheckList] = useState(false)
    const [listCheck, setListCheck] = useState([
        // {
        //     "Checked": false,
        //     "check_actividad": "",
        //     "check_duracion": "",
        //     "check_id": 0,
        //     "check_observacion": "",
        //     "modelo_id": 0,
        // }
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
            setOfCheck(true)
            osItem.equipo_id
            const list = await getHistorialEquiposStorageChecklist(osItem.equipo_id)
            console.log("list", list)
            if (JSON.parse(list[0].checklist) != "null") {
                var l = JSON.parse(list[0].checklist).map(item => {
                    return {
                        ...item,
                        Checked: false
                    }
                })
                setListCheck(l)
                console.log("listCheck", l)
            }
        } else {
            setOfCheck(false)
        }
    }

    async function SitioTrabajoValue(items) {
        setDatos({
            ...datos,
            SitioTrabajo: items
        })
        console.log("SitioTrabajo", items)
        const os = await AsyncStorage.getItem("OS")
        const osItem = JSON.parse(os)
        osItem.SitioTrabajo = items
        await AsyncStorage.setItem("OS", JSON.stringify(osItem))
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

    const handleConfirmTime = (time) => {
        let fec = new Date()
        setDatos({
            ...datos,
            FechaSeguimiento: fec,
            FechaSeguimientoMostrar: moment(time).format("DD/MM/YYYY")
        })
        hideTimePicker();
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
                const itenSelect = await AsyncStorage.getItem(ticketID)
                if (itenSelect != null) {
                    const item = JSON.parse(itenSelect)
                    const { Accion } = item

                    if (Accion == "FINALIZADO") {
                        console.log("Estamos FINALIZADO")
                        const os = await AsyncStorage.getItem("OS")
                        const osItem = JSON.parse(os)
                        setDatos({
                            ...osItem,
                            FechaSeguimientoMostrar: moment(osItem.FechaSeguimiento).format("DD/MM/YYYY")
                        })
                        setIsEnabled(false)
                        setDisableSub(false)
                    } else if (Accion == "clonar") {
                        console.log("Estamos clonar")

                        const os = await AsyncStorage.getItem("OS")
                        const osItem = JSON.parse(os)
                        setDatos({
                            ...osItem,
                            FechaSeguimientoMostrar: moment(osItem.FechaSeguimiento).format("DD/MM/YYYY")
                        })
                        setIsEnabled(true)
                        setDisableSub(true)

                    } else if (Accion == "OrdenSinTicket") {
                        console.log("Estamos OrdenSinTicket")
                        const os = await AsyncStorage.getItem("OS")
                        const osItem = JSON.parse(os)
                        console.log("osItem", datos.FechaSeguimientoMostrar)
                        setDatos({
                            ...osItem,
                            FechaSeguimientoMostrar: moment(osItem.FechaSeguimiento).format("DD/MM/YYYY")
                        })
                    } else if (Accion == "PENDIENTE") {

                        console.log("Estamos PENDIENTE")
                        const os = await AsyncStorage.getItem("OS")
                        const osItem = JSON.parse(os)
                        delete osItem.OS_ASUNTO
                        delete osItem.OS_Anexos
                        delete osItem.OS_FINALIZADA
                        setDatos({
                            ...osItem,
                            FechaSeguimientoMostrar: moment(osItem.FechaSeguimiento).format("DD/MM/YYYY")
                        })
                        await AsyncStorage.removeItem("OS_CheckList")
                        await AsyncStorage.setItem("OS_CheckList", JSON.stringify(OS_CheckList))

                    } else if (Accion == "NUEVO OS TICKET") {

                        console.log("Estamos NUEVO OS TICKET")
                        const os = await AsyncStorage.getItem("OS")
                        const osItem = JSON.parse(os)
                        setDatos({
                            ...datos,
                            ...osItem,
                            FechaSeguimientoMostrar: moment(osItem.FechaSeguimiento).format("DD/MM/YYYY")
                        })
                    }
                }

                const inci = await ListaComponentes()
                setIncidente(inci)

                const estadoE = await ListaDiagnostico()
                setEstadoEquipo(estadoE)

                let est = await EstadoSwitch(2)
                if (est.estado == 1) {
                    setIsEnabled(!true)
                } else {
                    setIsEnabled(!false)
                }
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
        console.log("osItem", osItem)
    }

    const verChecklist = () => {

        if(listCheck.length > 0){
            setActivities([])
            setShowCheckList(true)
        }else{
            Alert.alert("No hay checklist para mostrar")
        }

    }

    const GuardarChecklist = async () => {
       
        const os = await AsyncStorage.getItem("OS_CheckList")
        const OS_CheckList = JSON.parse(os)
        OS_CheckList.push(activities)
        console.log("OS_CheckList", OS_CheckList)
        await AsyncStorage.setItem("OS_CheckList", JSON.stringify(OS_CheckList))
        // setActivities([])
        setShowCheckList(false)

    }
    const [activities, setActivities] = useState([])

    const handleChecklist = async (text, index, item) => {
        var activ = []
        const { userId } = await getToken()
        const existe = activities.some((i) => i.IdCheckList == item.check_id)
        if (existe) {
            activities[index].Observacion = text
            activities[index].IdCheckList = item.check_id
            activities[index].UsuarioCreacion = userId
            activities[index].UsuarioModificacion = userId
            activities[index].FechaCreacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
            activities[index].FechaModificacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
            setActivities(activities)
            console.log("activities", text.length)
            // listCheck[index].Checked = text.length > 1 ? true : false
            // setListCheck(listCheck)
        } else {
            console.log("no existe")
            os_checklist.Observacion = text
            os_checklist.IdCheckList = item.check_id
            os_checklist.UsuarioCreacion = userId
            os_checklist.UsuarioModificacion = userId
            os_checklist.FechaCreacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
            os_checklist.FechaModificacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
            activ = activities
            activ.push(os_checklist)
            setActivities(activ)
        }
        console.log("activities", activities.length)
    }
    const checkedCheckList = (check,index) => {

        // const existe = activities.some((i) => i.IdCheckList == check.check_id)
        // if (existe) {
            
            const newlistcheck = [...listCheck]
            newlistcheck[index].Checked = !check
            setListCheck(newlistcheck)

            activities[index].Checked = !check
            setActivities(activities)
        // } else {
        //     Alert.alert("Error", "Debe ingresar una observación")
            // os_checklist.Checked = true
            // os_checklist.IdCheckList = check.check_id
            // activities.push(os_checklist)
            // setActivities(activities)
        // }
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
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Checklist</Text>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                        >
                            {
                                
                                listCheck.length > 0 &&  listCheck.map((item, index) => {
                                        // console.log("item", item)
                                        return (
                                            <View style={styles.boxActivity} key={index}>
                                                <View style={styles.infoActivity}>
                                                    <Text style={{ color: "#666666" }}>{item.check_actividad}</Text>
                                                    <View style={{
                                                        ...styles.inputActivity
                                                    }}>
                                                        <TextInput
                                                            editable
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
                                    }) 
                            }
                        </ScrollView>
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
                                    setActivities([])
                                    setShowCheckList(!showCheckList)
                                }}
                            >
                                <Text style={styles.textStyle}>CERRAR</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

            </Modal>
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={styles.ContenedorCliente}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#FF6B00",
                            marginTop: "5%",
                            marginLeft: "3%",
                        }}>Ingreso de datos</Text>
                    <View style={styles.ContainerInputs}>
                        <LoadingActi loading={loading} />
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
                                            enabled={isEnabled}
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
                                onChangeText={async (itemValue) => SitioTrabajoValue(itemValue)}
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
                                        enabled={isEnabled}
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
                        <TextInput
                            style={{ ...styles.input, width: '100%', height: 80, textAlignVertical: 'top' }}
                            placeholder="Problema reportado:"
                            multiline
                            numberOfLines={3}
                            editable={isEnabled}
                            value={datos.Causas}
                            onChangeText={(text) => setDatos({ ...datos, Causas: text })}
                        />
                        <TextInput
                            style={{ ...styles.input, width: '100%', height: 80, textAlignVertical: 'top' }}
                            placeholder="Sintomas:"
                            multiline
                            numberOfLines={3}
                            editable={isEnabled}
                            value={datos.Sintomas}
                            onChangeText={(text) => setDatos({ ...datos, Sintomas: text })}
                        />
                        <TextInput
                           style={{ ...styles.input, width: '100%', height: 80, textAlignVertical: 'top' }}
                            placeholder="Diagnóstico/Resultado visita*:"
                            multiline
                            numberOfLines={3}
                            editable={isEnabled}
                            value={datos.Diagnostico}
                            onChangeText={(text) => setDatos({ ...datos, Diagnostico: text })}
                        />
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
                                    setDatos({ ...datos, EstadoEquipo: itemValue })
                                }>
                                {
                                    CategoriaESTEQ.length > 0 ?
                                        CategoriaESTEQ.map((item, index) => (
                                            item.IdCatalogoDetalle == datos.Descripcion ?
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
                        <TextInput
                            // style={styles.input}
                            style={{ ...styles.input, width: '100%', height: 80, textAlignVertical: 'top' }}
                            placeholder="Acción inmediata"
                            multiline
                            numberOfLines={3}
                            editable={isEnabled}
                            value={datos.Acciones}
                            onChangeText={(text) => setDatos({ ...datos, Acciones: text })}
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
                                <Text style={{ fontSize: 16, marginRight: 4 }}>Recordatorio</Text>
                                <Switch
                                    trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
                                    thumbColor={isRecordatorio ? "#FF6B00" : "#ffffff"}
                                    ios_backgroundColor="#FFAF75"
                                    onValueChange={() => {
                                        toggleSwitchRecordatorio()
                                        setDatos({ ...datos, Seguimento: !isRecordatorio ? true : false })
                                    }}
                                    value={isRecordatorio}
                                />
                            </View>
                            <TextInput
                                style={{ ...styles.input, marginBottom: 0, width: '55%' }}
                                placeholder="Inf. adicional"
                                editable={isEnabled}
                                value={datos.ComentarioRestringido}
                                onChangeText={(text) => setDatos({ ...datos, ComentarioRestringido: text })}
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
                                <Text style={{ fontSize: 16, marginRight: 4 }}>Incluye Upgrade:</Text>
                                <Switch
                                    trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
                                    thumbColor={isUpgrade ? "#FF6B00" : "#ffffff"}
                                    ios_backgroundColor="#FFAF75"
                                    onValueChange={() => {
                                        toggleSwitchUpgrade()
                                        setDatos({ ...datos, IncluyoUpgrade: !isUpgrade ? true : false })
                                    }}
                                    value={isUpgrade}
                                />
                            </View>
                            <TextInput
                                style={{ ...styles.input, marginBottom: 0, width: '55%' }}
                                placeholder="Inf. adicional"
                                editable={isEnabled}
                                value={datos.ComentarioUpgrade}
                                onChangeText={(text) => setDatos({ ...datos, ComentarioUpgrade: text })}
                            />
                        </View>
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
                            <Text style={{ fontSize: 16, marginRight: '5%' }}>Requiere nueva visita</Text>
                            <Switch
                                trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
                                thumbColor={isVisita ? "#FF6B00" : "#ffffff"}
                                ios_backgroundColor="#FFAF75"
                                onValueChange={() => {
                                    toggleSwitchVisita()
                                    setDatos({ ...datos, nuevaVisita: !isVisita ? true : false })
                                }}
                                value={isVisita}
                            />
                        </View>
                        <TextInput
                            style={{ ...styles.input, width: '100%' }}
                            placeholder="Release"
                            editable={isEnabled}
                            value={datos.release}
                            onChangeText={(text) => setDatos({ ...datos, release: text })}
                        />
                        <TextInput
                            style={{ ...styles.input, width: '100%', height: "10%", textAlignVertical: 'top' }}
                            placeholder="Observación Ingeniero"
                            multiline
                            numberOfLines={4}
                            editable={isEnabled}
                            value={datos.ObservacionIngeniero}
                            onChangeText={(text) => setDatos({ ...datos, ObservacionIngeniero: text })}
                        />
                        <View
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
                        </View>
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
        marginTop: 30,
        flex: 1,
        width: "100%",
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    ContainerInputs: {
        flexDirection: "column",
        padding: 10,
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
