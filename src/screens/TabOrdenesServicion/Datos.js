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
        IncluyoUpgrade: 0,
        ComentarioRestringido: "",
        ComentarioUpgrade: "",
        FechaSeguimiento: "",
        nuevaVisita: 0,
        release: "",
        ObservacionIngeniero: "",
        FechaSeguimiento: "",
        TipoVisita: "",
        TipoVistaDescripcion: "",
        Seguimento: 0,
    })

    function TipoVisitadescripcion(items) {
        setDatos({
            ...datos,
            TipoVisita: items
        })
    }
    function TipoIncidencia(items) {
        setDatos({
            ...datos,
            tipoIncidencia: items
        })
    }
    const handleConfirmTime = (time) => {
        setDatos({
            ...datos,
            FechaSeguimiento: moment(time).format('YYYY-MM-DD')
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
                    console.log("OSClone", OSClone)
                    if (Accion == "FINALIZADO") {
                        const response = await getOrdenServicioAnidadasTicket_id(ticket_id)
                        // console.log("response", response)
                        response.map(item => setTipo(item.tck_tipoTicket))
                        setIsEnabled(false)
                        setDisableSub(false)
                        const datosC = await DatosOSOrdenServicioID(OrdenServicioID)
                        datosC.map(d => {
                            setDatos({
                                ...datos,
                                SitioTrabajo: d.SitioTrabajo,
                                tipoIncidente: d.tipoIncidente,
                                Sintomas: d.Sintomas,
                                Causas: d.Causas,
                                Diagnostico: d.Diagnostico,
                                EstadoEquipo: d.EstadoEquipo,
                                Acciones: d.Acciones,
                                recordatorio: null,
                                incluyeupgrade: d.IncluyoUpgrade,
                                ComentarioRestringido: d.ComentarioRestringido,
                                ComentarioUpgrade: d.ComentarioUpgrade,
                                FechaSeguimiento: d.FechaSeguimiento,
                                requiereVisita: d.FechaSeguimiento,
                                release: d.release,
                                observacionIngeniero: d.ObservacionIngeniero,
                            })
                        })
                        return
                    } else if (Accion == "clonar") {
                        setIsEnabled(true)
                        setDisableSub(true)
                        setDatos({
                            ...datos,
                            SitioTrabajo: OSClone[0].SitioTrabajo,
                            tipoIncidente: OSClone[0].tipoIncidente,
                            Sintomas: OSClone[0].Sintomas,
                            Causas: OSClone[0].Causas,
                            Diagnostico: OSClone[0].Diagnostico,
                            EstadoEquipo: OSClone[0].EstadoEquipo,
                            Acciones: OSClone[0].Acciones,
                            recordatorio: null,
                            IncluyoUpgrade: OSClone[0].IncluyoUpgrade,
                            ComentarioRestringido: OSClone[0].ComentarioRestringido,
                            ComentarioUpgrade: OSClone[0].ComentarioUpgrade,
                            fechaRecordatorio: OSClone[0].FechaSeguimiento,
                            FechaSeguimiento: OSClone[0].FechaSeguimiento,
                            release: OSClone[0].release,
                            ObservacionIngeniero: OSClone[0].ObservacionIngeniero,
                        })
                    } else if (Accion == "OrdenSinTicket") {
                        const os = await AsyncStorage.getItem("OS")
                        const osItem = JSON.parse(os)
                        setDatos({
                            ...datos,
                            ...osItem
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
                let dat = await AsyncStorage.getItem(DATOS_)
                if (dat != null) {
                    setDatos(JSON.parse(dat))
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
            OSClone[0].ClienteNombre = cliente.CustomerName,
                OSClone[0].Direccion = direccion.Direccion,
                OSClone[0].Ciudad = provincia.descripcion,
                OSClone[0].contrato_id = equipoTicket.id_contrato,
                OSClone[0].equipo_id = equipoTicket.id_equipo,
                OSClone[0].codOS = equipoTicket.codOS,
                OSClone[0].ticket_id = equipoTicket.ticket_id,
                OSClone[0].Estado = equipoTicket.Estado,
                OSClone[0].CodigoEquipoCliente = equipoTicket.CodigoEquipoCliente,
                console.log("OSClone", OSClone)
            await AsyncStorage.setItem(ticketID, JSON.stringify({ ticket_id, equipo, OrdenServicioID, OSClone, Accion }))
        } else if (Accion == "OrdenSinTicket") {
            const os = await AsyncStorage.getItem("OS")
            const osItem = JSON.parse(os)
            osItem.Acciones = datos.Acciones,//# accion inmediata
                osItem.Causas = datos.Causas, //# Problema reportado
                osItem.SitioTrabajo = datos.SitioTrabajo, //# sitio de trabajo
                osItem.Sintomas = datos.Sintomas, //# sintomas
                osItem.Diagnostico = datos.Diagnostico, //# diagnostico
                osItem.EstadoEquipo = datos.EstadoEquipo, //# estado del equipo
                osItem.ComentarioRestringido = datos.ComentarioRestringido, //# inf. adicional 1
                osItem.ComentarioUpgrade = datos.ComentarioUpgrade, //# inf. adicional 2
                osItem.FechaSeguimiento = datos.FechaSeguimiento, //# fecha recordatorio
                osItem.IncluyoUpgrade = datos.IncluyoUpgrade, //# IncluyoUpgrade estado true false
                osItem.release = datos.release, //# release
                osItem.ObservacionIngeniero = datos.ObservacionIngeniero, //# ObservacionIngeniero
                osItem.nuevaVisita = datos.nuevaVisita, //# requiere nueva visita
                osItem.Seguimento = datos.Seguimento, //# sequimiento
                osItem.tipoIncidencia = datos.tipoIncidencia, //# sequimiento
                osItem.TipoVisita = datos.TipoVisita, //# sequimiento
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
                                onChangeText={(SitioTrabajo) => setDatos({ ...datos, SitioTrabajo })}
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
                                                    value={item.Descripcion}
                                                    selected={true}
                                                />
                                                : <Picker.Item key={index} label={item.Descripcion} value={item.Descripcion} />
                                        ))
                                        : null
                                }
                            </Picker>


                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Acción inmediata"
                            editable={isEnabled}
                            value={datos.accionInmediata}
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
                                        setDatos({ ...datos, Seguimento: !isRecordatorio ? 1 : 0 })
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
                                        setDatos({ ...datos, IncluyoUpgrade: !isUpgrade ? 1 : 0 })
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
                                style={{ width: "90%", height: "100%" }}
                                placeholder='Fecha Recordatorio'
                                editable={isEnabled}
                                value={datos.FechaSeguimiento}
                            />
                            <AntDesign
                                onPress={() => hideTimePicker()}
                                name='clockcircleo'
                                size={24}
                                color='#000000'
                            />
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
                                    setDatos({ ...datos, nuevaVisita: !isVisita ? 1 : 0 })
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
