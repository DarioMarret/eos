import { StyleSheet, Text, TextInput, View, Switch, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import BannerOrderServi from "../../components/BannerOrdenServ";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { CambieEstadoSwitch, EstadoSwitch, ListaComponentes, ListaDiagnostico } from "../../service/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DATOS_, ticketID } from "../../utils/constantes";
import { DatosOSOrdenServicioID } from "../../service/OS_OrdenServicio";
import { getEquipoTicketStorage } from "../../service/equipoTicketID";
import { getOrdenServicioAnidadasTicket_id } from "../../service/OrdenServicioAnidadas";


export default function Datos(props) {
    const { navigation } = props
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [isRecordatorio, setIsRecordatorio] = useState(false);
    const [isUpgrade, setIsUpgrade] = useState(false);
    const [isVisita, setIsVisita] = useState(false);
    const [incidente, setIncidente] = useState([]);
    const [estadoEquipo, setEstadoEquipo] = useState([]);

    const [tipo, setTipo] = useState("");

    const [isEnabled, setIsEnabled] = useState(false);
    const [isdisabelsub, setDisableSub] = useState(true)

    const [datos, setDatos] = useState({
        sitioTrabajo: "",
        tipoIncidente: "",
        problemaReportado: "",
        sintomas: "",
        diagnostico: "",
        estadoEquipo: "",
        accionInmediata: "",
        recordatorio: null,
        incluyeupgrade: null,
        infoAdicional: "",
        infoAdicional2: "",
        fechaRecordatorio: "",
        requiereVisita: null,
        release: "",
        observacionIngeniero: "",
        FechaSeguimiento: "",
    })



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

                const itenSelect = await AsyncStorage.getItem(ticketID)
                if (itenSelect != null) {
                    const item = JSON.parse(itenSelect)
                    const { equipo, OrdenServicioID, ticket_id } = item
                    if (OrdenServicioID != null) {
                        const response = await getOrdenServicioAnidadasTicket_id(ticket_id)
                        console.log("response", response)
                        response.map(item => setTipo(item.tck_tipoTicket))
                        console.log("OrdenServicioID", OrdenServicioID)
                        setIsEnabled(false)
                        setDisableSub(false)
                        const datosC = await DatosOSOrdenServicioID(OrdenServicioID)
                        datosC.map(d => {
                            setDatos({
                                ...datos,
                                sitioTrabajo: d.SitioTrabajo,
                                tipoIncidente: d.tipoIncidente,
                                sintomas: d.Sintomas,
                                problemaReportado: d.Causas,
                                diagnostico: d.Diagnostico,
                                estadoEquipo: d.EstadoEquipo,
                                accionInmediata: d.Acciones,
                                recordatorio: null,
                                incluyeupgrade: d.IncluyoUpgrade,
                                infoAdicional: d.ComentarioRestringido,
                                infoAdicional2: d.ComentarioUpgrade,
                                fechaRecordatorio: d.FechaSeguimiento,
                                requiereVisita: d.FechaSeguimiento,
                                release: d.release,
                                observacionIngeniero: d.ObservacionIngeniero,

                            })
                        })
                        console.log(await DatosOSOrdenServicioID(OrdenServicioID))
                        return
                    }
                }

                const inci = await ListaComponentes()
                setIncidente(inci)

                const estadoE = await ListaDiagnostico()
                setEstadoEquipo(estadoE)

                let est = await EstadoSwitch(2)
                console.log("est", est);
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

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.ContenedorCliente}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#FF6B00",
                        marginTop: "5%",
                        marginLeft: "3%",
                    }}>Ingreso de datos</Text>
                    <View style={styles.ContainerInputs}>
                        <View style={styles.ContainerTipoModelo}>
                            <View style={{
                                width: "49%",
                                height: 60,
                                marginBottom: '6%',
                                borderWidth: 1,
                                borderColor: '#CECECA',
                                borderRadius: 10,
                            }}>
                                <Picker
                                    style={styles.wFull}
                                    enabled={isEnabled}
                                    selectedValue={selectedLanguage}
                                    onValueChange={(itemValue, itemIndex) =>
                                        console.log(itemValue)
                                    }>
                                    <Picker.Item label={tipo} value={true} />
                                </Picker>
                            </View>
                            <TextInput
                                style={{
                                    ...styles.input,
                                    width: '49%',
                                }}
                                placeholder="Sitio de trabajo"
                                editable={isEnabled}
                                value={datos.sitioTrabajo}
                                onChangeText={(sitioTrabajo) => setDatos({ ...datos, sitioTrabajo })}
                            />
                        </View>
                        <View style={{ paddingHorizontal: 20 }} />
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
                                selectedValue={datos.tipoIncidente}
                                enabled={isEnabled}
                                onValueChange={(itemValue, itemIndex) =>
                                    setDatos({ ...datos, tipoIncidente: itemValue })
                                }>
                                <Picker.Item label="Tipo de Instalacion" value={true} />
                                {
                                    incidente.map((item, index) => (
                                        <Picker.Item label={item.descripcion} value={item.descripcion} />
                                    ))
                                }
                            </Picker>


                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Problema reportado:"
                            editable={isEnabled}
                            value={datos.problemaReportado}
                            onChangeText={(problemaReportado) => setDatos({ ...datos, problemaReportado })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Sintomas:"
                            editable={isEnabled}
                            value={datos.sintomas}
                            onChangeText={(sintomas) => setDatos({ ...datos, sintomas })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Diagnóstico/Resultado visita*:"
                            editable={isEnabled}
                            value={datos.diagnostico}
                            onChangeText={(diagnostico) => setDatos({ ...datos, diagnostico })}
                        />
                        <View style={{
                            width: "100%",
                            height: 60,
                            marginBottom: '6%',
                            borderWidth: 1,
                            borderColor: '#CECECA',
                            borderRadius: 10,
                        }}>
                            {
                                isdisabelsub ?
                                    <Picker
                                        style={{
                                            width: '100%',
                                            height: 60,
                                            borderWidth: 1,
                                            borderColor: '#CECECA',
                                            padding: 10,

                                        }}
                                        selectedValue={datos.estadoEquipo}
                                        enabled={isEnabled}
                                        onValueChange={(itemValue, itemIndex) =>
                                            setDatos({ ...datos, estadoEquipo: itemValue })
                                        }>
                                        <Picker.Item label="Estado de Equipo" value={true} />
                                        {
                                            estadoEquipo.map((item, index) => (
                                                <Picker.Item label={item.descripcion} value={item.descripcion} />
                                            ))
                                        }
                                    </Picker>
                                    :
                                    <Picker
                                        style={{
                                            width: '100%',
                                            height: 60,
                                            borderWidth: 1,
                                            borderColor: '#CECECA',
                                            padding: 10,

                                        }}
                                        selectedValue={datos.tipoIncidente}
                                        enabled={isEnabled}>
                                        <Picker.Item label={datos.estadoEquipo} value={true} />
                                    </Picker>
                            }
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholder="Acción inmediata"
                            editable={isEnabled}
                            value={datos.accionInmediata}
                            onChangeText={(accionInmediata) => setDatos({ ...datos, accionInmediata })}
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
                                    onValueChange={toggleSwitchRecordatorio}
                                    value={isRecordatorio}
                                />
                            </View>
                            <TextInput
                                style={{ ...styles.input, marginBottom: 0, width: '55%' }}
                                placeholder="Inf. adicional"
                                editable={isEnabled}
                                value={datos.infoAdicional}
                                onChangeText={(infoAdicional) => setDatos({ ...datos, infoAdicional })}
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
                                    onValueChange={toggleSwitchUpgrade}
                                    value={isUpgrade}
                                />
                            </View>
                            <TextInput
                                style={{ ...styles.input, marginBottom: 0, width: '55%' }}
                                placeholder="Inf. adicional"
                                editable={isEnabled}
                                value={datos.infoAdicional2}
                                onChangeText={(infoAdicional2) => setDatos({ ...datos, infoAdicional2 })}
                            />
                        </View>
                        <TextInput
                            style={{ ...styles.input, width: '100%' }}
                            placeholder="Fecha Recordatorio"
                            value={datos.FechaSeguimiento}
                            editable={isEnabled}
                        />

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
                                onValueChange={toggleSwitchVisita}
                                value={isVisita}
                            />
                        </View>
                        <TextInput
                            style={{ ...styles.input, width: '100%' }}
                            placeholder="Release"
                            editable={isEnabled}
                            value={datos.release}
                            onChangeText={(release) => setDatos({ ...datos, release })}
                        />
                        <TextInput
                            style={{ ...styles.input, width: '100%', height: "10%" }}
                            placeholder="Observación Ingeniero"
                            multiline
                            editable={isEnabled}
                            value={datos.observacionIngeniero}
                            onChangeText={(observacionIngeniero) => setDatos({ ...datos, observacionIngeniero })}
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
                                onValueChange={SwitchGuardar}
                                value={isEnabled}
                            />
                        </View>
                    </View>
                    <View style={{ padding: 50 }} ></View>

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
