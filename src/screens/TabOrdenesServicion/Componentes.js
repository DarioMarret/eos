import { StyleSheet, Text, TextInput, View, Switch, ScrollView, TouchableOpacity, FlatList, SafeAreaView, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons'
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import BannerOrderServi from "../../components/BannerOrdenServ";
import { CambieEstadoSwitch, EstadoSwitch, ListaComponentes } from "../../service/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COMPONENTE_, ParteRespuestos, ticketID } from "../../utils/constantes";
import moment from "moment";
import { getToken } from "../../service/usuario";


export default function Componentes(props) {
    const { navigation } = props
    const [Component, setComponent] = useState([])
    const [compo, setCompo] = useState("")
    const [incidente, setIncidente] = useState([]);

    const [fini, setFini] = useState(true)

    const [isEnabled, setIsEnabled] = useState(false);

    const [isGarantia, setIsGarantia] = useState(false);
    const [isDoa, setIsDoa] = useState(false);
    const [isExchange, setIsExchange] = useState(false);

    const [componente, setComponente] = useState({
        OS_OrdenServicio: null,
        IdParte: null,
        OrdenServicioID: null,
        Tipo: null,
        Codigo: null,
        Descripcion: null,
        Cantidad: null,
        Doa: false,
        Exchange: false,
        FechaCreacion: null,
        UsuarioCreacion: null,
        FechaModificacion: null,
        UsuarioModificacion: null,
        Estado: null,
        Garantia: false,
        componente_id: null,
        serie: "",
        modelo: "",
        fabricante: "",
        tamano: "",
        fechaFabricacion: "",
        fechaInstalacion: "",
        voltaje: "",
        ubicacion: "",
        potencia: "",
        numero: "",
        sistemaOperativo: "",
        release: ""
    });

    const toggleSwitchGarantia = () => {
        setIsGarantia(!isGarantia)
        componente({
            ...componente,
            garantia: !isGarantia
        })
    }
    const toggleSwitchDoa = () => {
        setIsDoa(!isDoa)
        componente({
            ...componente,
            doa: !isDoa
        })
    }
    const toggleSwitchExchange = () => {
        setIsExchange(!isExchange);
        componente({
            ...componente,
            exchange: !isExchange
        })
    }

    useFocusEffect(
        useCallback(() => {
            (async () => {
                try {
                    const inci = await ListaComponentes()
                    setIncidente(inci)
                    let est = await EstadoSwitch(3)
                    console.log("est", est);
                    if (est.estado == 1) {
                        setIsEnabled(!true)
                    } else {
                        setIsEnabled(!false)
                    }

                    const itenSelect = await AsyncStorage.getItem(ticketID)
                    if (itenSelect != null) {
                        const item = JSON.parse(itenSelect)
                        const { ticket_id, equipo, OrdenServicioID, OSClone, Accion } = item
                        if (Accion == "FINALIZADO") {
                            setFini(false)

                            const parte = await AsyncStorage.getItem("OS")
                            console.log("parte-->", JSON.parse(parte).OS_PartesRepuestos)
                            let pat = JSON.parse(parte).OS_PartesRepuestos
                            setComponent(JSON.parse(pat))

                        } else if (Accion == "PENDIENTE") {

                            setComponent(JSON.parse(OSClone[0].OS_PartesRepuestos))

                        } else if (Accion == "OrdenSinTicket") {

                            const parte = await AsyncStorage.getItem("OS_PartesRepuestos")
                            console.log("parte-->", parte)
                            setComponent(JSON.parse(parte))

                        } else if (Accion == "clonar") {

                            const parte = await AsyncStorage.getItem("OS")
                            console.log("parte-->", JSON.parse(parte).OS_PartesRepuestos)
                            let pat = JSON.parse(parte).OS_PartesRepuestos
                            setComponent(JSON.parse(pat))

                        }
                    }
                } catch (error) {
                    console.log("error", error)
                }
            })()
        }, [])
    )

    const AgregarComponet = async () => {
        if (componente.Codigo == null && componente.Descripcion == null && componente.Cantidad == null && componente.Tipo == null) {
            Alert.alert("Error", "Debe llenar todos los campos")
        } else {
            const { userId } = await getToken()
            const itenSelect = await AsyncStorage.getItem(ticketID)
            const it = JSON.parse(itenSelect)
            const { Accion } = it
            if (Accion == "OrdenSinTicket") {
                ParteRespuestos.Tipo = componente.Tipo
                ParteRespuestos.Codigo = componente.Codigo
                ParteRespuestos.Descripcion = componente.Descripcion
                ParteRespuestos.Cantidad = Number(componente.Cantidad)
                ParteRespuestos.Doa = componente.Doa
                ParteRespuestos.Exchange = componente.Exchange
                ParteRespuestos.FechaCreacion = new Date()
                ParteRespuestos.UsuarioCreacion = userId
                ParteRespuestos.FechaModificacion = new Date()
                ParteRespuestos.UsuarioModificacion = userId
                ParteRespuestos.Estado = "ACTI"
                ParteRespuestos.Garantia = componente.Garantia
                ParteRespuestos.componente_id = null
                ParteRespuestos.idLocal = moment().format("YYYYMMDDHHmmss")
                const rest = await AsyncStorage.getItem("OS_PartesRepuestos")
                if (rest != null) {
                    const res = JSON.parse(rest)
                    res.push(ParteRespuestos)
                    await AsyncStorage.setItem("OS_PartesRepuestos", JSON.stringify(res))
                    console.log("res", res)
                } else {
                    await AsyncStorage.setItem("OS_PartesRepuestos", JSON.stringify([ParteRespuestos]))
                }
                const result = await AsyncStorage.getItem("OS_PartesRepuestos")
                const res = JSON.parse(result)
                console.log("res", res)
                setComponent(res)

            } else if (Accion == "PENDIENTE") {

                const parte = await AsyncStorage.getItem("OS")
                let pat = JSON.parse(parte).OS_PartesRepuestos
                let comp = JSON.parse(pat)
                comp.push(componente)
                console.log("comp", comp)
                await AsyncStorage.setItem(ParteRespuestos, JSON.stringify(comp))

            } else if (Accion == "clonar") {

                const parte = await AsyncStorage.getItem("OS")
                let pat = JSON.parse(parte).OS_PartesRepuestos
                let comp = JSON.parse(pat)
                comp.push(componente)
                console.log("comp", comp)
                await AsyncStorage.setItem(ParteRespuestos, JSON.stringify(comp))

            }else if (Accion == "NUEVO OS TICKET") {

                const parte = await AsyncStorage.getItem("OS")
                let pat = JSON.parse(parte).OS_PartesRepuestos
                let comp = JSON.parse(pat)
                comp.push(componente)
                console.log("comp", comp)
                await AsyncStorage.setItem(ParteRespuestos, JSON.stringify(comp))

            }
        }
    }
    const EliminadrComponenteAgregado = (item) => {
        Alert.alert(
            "Eliminar",
            "¿Está seguro de eliminar el componente?",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => EliminarComponente(item) }
            ],
            { cancelable: false }
        )
    }

    const EliminarComponente = async (item) => {
        const os_partesRepuestos = await AsyncStorage.getItem("OS_PartesRepuestos")
        const OS_PartesRepuestos = JSON.parse(os_partesRepuestos)
        const index = OS_PartesRepuestos.findIndex(x => x.componente_id == item.componente_id)
        OS_PartesRepuestos.splice(index, 1)
        setComponent(OS_PartesRepuestos)
        await AsyncStorage.setItem("OS_PartesRepuestos", JSON.stringify(OS_PartesRepuestos))
    }

    const _iTemView = ({ item }) => {
        return (
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#D6FCD9",
                padding: 10,
                borderBottomWidth: 0.5,
                borderRadius: 0,
            }}>
                <View>
                    <Text style={{
                        ...styles.text,
                        textTransform: "uppercase",
                    }}>{item.Tipo}/ # {item.Codigo}/{"CANT:" + item.Cantidad}</Text>
                    <Text style={{
                        ...styles.text,
                        textTransform: "uppercase",
                    }}>{item.Descripcion}</Text>
                    <Text style={styles.text}>DOA:{item.doa == false ? "OFF" : "ON"}/GARANTIA:{item.garantia == false ? "OFF" : "ON"}/EXCHANGE:{item.exchange == false ? "OFF" : "ON"}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => EliminadrComponenteAgregado(item)}
                >
                    <AntDesign name="delete" size={20} color="red" />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    width: "100%",
                    height: "100%",
                }}
            >
                <View style={styles.ContenedorCliente}>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#FF6B00",
                        marginTop: "5%",
                    }}>Agregar componentes</Text>
                    <View style={{
                        width: "100%",
                        height: 60,
                        marginTop: '3%',
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
                            selectedValue={componente.tipoComponente}
                            onValueChange={(itemValue, itemIndex) =>
                                setComponente({
                                    ...componente,
                                    Tipo: itemValue
                                })
                            }>
                            {
                                componente.Tipo == null ?
                                    <Picker.Item label="Seleccione un tipo de componente" value="" />
                                    : null
                            }
                            {
                                incidente.map((item, index) => (
                                    item.tipoComponente == componente.Tipo ?
                                        <Picker.Item label={item.descripcion} value={item.descripcion} />
                                        : <Picker.Item label={item.descripcion} value={item.descripcion} />
                                ))
                            }
                        </Picker>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Descripción:"
                        value={componente.Descripcion}
                        editable={isEnabled}
                        onChangeText={(text) => setComponente({ ...componente, Descripcion: text })} />
                    <View style={{
                        ...styles.wFull,
                        width: '100%',
                        height: 'auto',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6%'
                    }}>
                        <TextInput
                            style={{ ...styles.input, marginBottom: 0, width: '40%' }}
                            placeholder="Cantidad:"
                            value={componente.Cantidad}
                            keyboardType="numeric"
                            onChangeText={(text) => setComponente({ ...componente, Cantidad: text })}
                            editable={isEnabled}
                        />
                        <View style={{
                            ...styles.wFull,
                            height: 60,
                            width: '50%',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontSize: 16, marginRight: 4 }}>Garantía</Text>
                            <Switch
                                trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
                                thumbColor={componente.Garantia ? "#FF6B00" : "#ffffff"}
                                ios_backgroundColor="#FFAF75"
                                onValueChange={() => {
                                    setComponente({ ...componente, Garantia: !componente.Garantia })
                                }}
                                value={componente.Garantia}
                            />
                        </View>
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
                            width: '50%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: '5%'
                        }}>
                            <Text style={{ fontSize: 16, marginRight: 4 }}>DOA:</Text>
                            <Switch
                                trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
                                thumbColor={componente.Doa ? "#FF6B00" : "#ffffff"}
                                ios_backgroundColor="#FFAF75"
                                onValueChange={() => {
                                    setComponente({
                                        ...componente,
                                        Doa: !componente.Doa
                                    })
                                }}
                                value={componente.Doa}
                            />
                        </View>
                        <View style={{
                            ...styles.wFull,
                            height: 60,
                            width: '50%',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontSize: 16, marginRight: 4 }}>Exchange</Text>
                            <Switch
                                trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
                                thumbColor={componente.Exchange ? "#FF6B00" : "#ffffff"}
                                ios_backgroundColor="#FFAF75"
                                onValueChange={() => {
                                    setComponente({
                                        ...componente,
                                        Exchange: !componente.Exchange
                                    })
                                }}
                                value={componente.Exchange}
                            />
                        </View>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Numero de parte:"
                        value={componente.Codigo}
                        editable={isEnabled}
                        onChangeText={(text) => setComponente({ ...componente, Codigo: text })} />

                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        height: "15%",
                        width: "100%",
                        backgroundColor: "#FFFFFF"
                    }}>
                        {
                            fini ?
                                <TouchableOpacity style={styles.btn} onPress={() => AgregarComponet()}>
                                    <AntDesign name="plus" size={24} color="#FFF" />
                                    <Text style={{
                                        fontSize: 18,
                                        color: '#FFF',
                                        fontFamily: 'Roboto',
                                        marginLeft: 10
                                    }}>AGREGAR COMPONENTE</Text>
                                </TouchableOpacity> :
                                <TouchableOpacity style={styles.btn} onPress={() => {
                                    Alert.alert(
                                        "Alerta",
                                        "No se puede agregar un componente con orden de servicio finalizada",
                                    )
                                }}>
                                    <AntDesign name="plus" size={24} color="#FFF" />
                                    <Text style={{
                                        fontSize: 18,
                                        color: '#FFF',
                                        fontFamily: 'Roboto',
                                        marginLeft: 10
                                    }}>AGREGAR COMPONENTE</Text>
                                </TouchableOpacity>
                        }
                    </View>
                    <View>
                        <SafeAreaView>
                            <FlatList
                                data={Component}
                                renderItem={_iTemView}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </SafeAreaView>

                    </View>
                    <View style={{ paddingBottom: 50 }} ></View>
                </View>
            </ScrollView>
            <BannerOrderServi
                {...props}
                navigation={navigation}
                screen={"4-COMPONENTES"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#FFFFFF',
    },
    ContenedorCliente: {
        marginTop: 30,
        flex: 1,
        width: "100%",
        backgroundColor: '#FFFFFF',
        padding: 20,
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
    text: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Roboto',
        marginLeft: 10
    },
});