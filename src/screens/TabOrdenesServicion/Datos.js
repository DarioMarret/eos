import { CambieEstadoSwitch, EstadoSwitch, ListaComponentes, ListaDiagnostico } from "../../service/config"
import { getOrdenServicioAnidadasTicket_id } from "../../service/OrdenServicioAnidadas"
import { StyleSheet, Text, TextInput, View, Switch, ScrollView } from "react-native"
import { DatosOSOrdenServicioID } from "../../service/OS_OrdenServicio"
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

    const [tipo, setTipo] = useState("");

    const [isEnabled, setIsEnabled] = useState(false);
    const [isdisabelsub, setDisableSub] = useState(true)

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
    };


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
                    const { ticket_id, equipo, OrdenServicioID, OSClone, Accion } = item
                    // console.log("OSClone", OSClone[0].tipoIncidencia)
                    if (Accion == "FINALIZADO") {
                        console.log("Estamos FINALIZADO")
                        const os = await AsyncStorage.getItem("OS")
                        const osItem = JSON.parse(os)
                        delete osItem.OS_ASUNTO
                        delete osItem.OS_Anexos
                        delete osItem.OS_FINALIZADA
                        console.log("osItem", osItem)
                        console.log("osItem", datos.FechaSeguimientoMostrar)
                        setDatos({
                            ...datos,
                            ...osItem,
                            FechaSeguimientoMostrar: moment(osItem.FechaSeguimiento).format("DD/MM/YYYY")
                        })
                        setIsEnabled(false)
                        setDisableSub(false)
                        return
                    } else if (Accion == "clonar") {
                        console.log("Estamos clonar")

                        const os = await AsyncStorage.getItem("OS")
                        const osItem = JSON.parse(os)
                        setDatos({
                            ...datos,
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
                            ...datos,
                            ...osItem,
                            FechaSeguimientoMostrar: moment(osItem.FechaSeguimiento).format("DD/MM/YYYY")
                        })
                    } else if (Accion == "PENDIENTE") {
                        setDatos({
                            ...datos,
                            ...OSClone[0],
                            FechaSeguimientoMostrar: moment(OSClone[0].FechaSeguimiento).format("DD/MM/YYYY")
                        })

                    } else if (Accion == "NUEVO OS TICKET") {
                        setDatos({
                            ...datos,
                            ...OSClone[0],
                            FechaSeguimientoMostrar: moment(OSClone[0].FechaSeguimiento).format("DD/MM/YYYY")
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
        const itenSelect = await AsyncStorage.getItem(ticketID)
        const it = JSON.parse(itenSelect)
        const { ticket_id, equipo, OrdenServicioID, OSClone, Accion } = it
        if (Accion == "clonar") {
            const os = await AsyncStorage.getItem("OS")
            const osItem = JSON.parse(os)
            osItem.Acciones = datos.Acciones,//# accion inmediata
                osItem.Causas = datos.Causas, //# Problema reportado
                osItem.contrato_id = 397, //# contrat ejemplo
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
        } else if (Accion == "OrdenSinTicket") {
            const os = await AsyncStorage.getItem("OS")
            const osItem = JSON.parse(os)
            osItem.Acciones = datos.Acciones,//# accion inmediata
                osItem.Causas = datos.Causas, //# Problema reportado
                osItem.contrato_id = 397, //# contrat ejemplo
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
    }

    return (
        <View style={styles.container}>
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
                            style={styles.input}
                            placeholder="Problema reportado:"
                            editable={isEnabled}
                            value={datos.Causas}
                            onChangeText={(text) => setDatos({ ...datos, Causas: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Sintomas:"
                            editable={isEnabled}
                            value={datos.Sintomas}
                            onChangeText={(text) => setDatos({ ...datos, Sintomas: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Diagnóstico/Resultado visita*:"
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
                            style={styles.input}
                            placeholder="Acción inmediata"
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
});
