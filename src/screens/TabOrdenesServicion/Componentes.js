import { StyleSheet, Text, TextInput, View, Switch, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons'
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import BannerOrderServi from "../../components/BannerOrdenServ";
import { ListaComponentes } from "../../service/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ticketID } from "../../utils/constantes";
import { getToken } from "../../service/usuario";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { loadingCargando } from "../../redux/sincronizacion";
import LoadingActi from "../../components/LoadingActi";
import { setComponenteTool } from "../../redux/formulario";
import isEmpty from "just-is-empty";


export default function Componentes(props) {
    const { navigation } = props
    const [Component, setComponent] = useState([])
    const [incidente, setIncidente] = useState([]);

    const [fini, setFini] = useState(true)
    const [ParteOrdenServicioID, setOrdenServicioID] = useState(0)

    const [componente, setComponente] = useState({
        OS_OrdenServicio: null,
        IdParte: 0,
        OrdenServicioID: 0,
        Tipo: null,
        Codigo: null,
        Descripcion: "",
        Cantidad: null,
        Doa: false,
        Exchange: false,
        FechaCreacion: null,
        UsuarioCreacion: null,
        FechaModificacion: null,
        UsuarioModificacion: null,
        Estado: "ACTI",
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
    })

    const limpia = () => {
        setComponente({
            OS_OrdenServicio: null,
            IdParte: 0,
            OrdenServicioID: 0,
            Tipo: null,
            Codigo: null,
            Descripcion: "",
            Cantidad: null,
            Doa: false,
            Exchange: false,
            FechaCreacion: null,
            UsuarioCreacion: null,
            FechaModificacion: null,
            UsuarioModificacion: null,
            Estado: "ACTI",
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
        })
    }
    const Events = useSelector(s => s.sincronizacion)
    const ComponenteStor = useSelector(s => s.formulario)
    const dispatch = useDispatch()


    useFocusEffect(
        useCallback(() => {
            limpia()
            if (typeof ComponenteStor.componente !== "undefined") {
                if (ComponenteStor.componente.length > 0) {
                    let filter = ComponenteStor.componente.filter((item) => item.Estado == "ACTI")
                    setComponent(filter)
                    console.log("ComponenteStor", ComponenteStor.componente)
                }else{
                    setComponent([])
                }
            }
        }, [ComponenteStor.componente])
    )

    useFocusEffect(
        useCallback(() => {
            (async () => {
                try {
                    dispatch(loadingCargando(true))
                    const inci = await ListaComponentes()
                    setIncidente(inci)
                    const itenSelect = await AsyncStorage.getItem(ticketID)
                    if (itenSelect != null) {
                        const item = JSON.parse(itenSelect)
                        const { Accion, OrdenServicioID } = item
                        setOrdenServicioID(OrdenServicioID == null ? 0 : OrdenServicioID)
                        console.log("Accion-->", OrdenServicioID)
                        if (Accion == "FINALIZADO") {
                            
                            // setComponent([])
                            setFini(false)

                        } else if (Accion == "PENDIENTE") {

                            console.log("PENDIENTE")
                            // setComponent([])
                            setFini(true)

                        } else if (Accion == "OrdenSinTicket") {

                            console.log("OrdenSinTicket")
                            // setComponent([])
                            setFini(true)

                        } else if (Accion == "clonar") {

                            // setComponent([])
                            setFini(true)

                        } else if (Accion == "NUEVO OS TICKET") {

                            console.log("NUEVO OS TICKET")
                            // setComponent([])
                            setFini(true)

                        } else if (Accion == "PROCESO") {

                            console.log("PROCESO")
                            setFini(true)
                        }
                    }
                    dispatch(loadingCargando(false))
                } catch (error) {
                    console.log("error", error)
                }
            })()
        }, [])
    )

    const AgregarComponet = async () => {
        if (isEmpty(componente.Codigo) || isEmpty(componente.Descripcion) || isEmpty(componente.Cantidad) || isEmpty(componente.Tipo)) {
            Alert.alert("Error", "Debe llenar todos los campos")
        } else {
            const { userId } = await getToken()
            var parte = ComponenteStor.componente
            let partes = {
                Cantidad: Number(componente.Cantidad),
                Codigo: componente.Codigo,
                Descripcion: componente.Descripcion,
                Doa: componente.Doa,
                Estado: "ACTI",
                Exchange: componente.Exchange,
                FechaCreacion: new Date(),
                FechaModificacion: new Date(),
                Garantia: componente.Garantia,
                IdParte: 0,
                OS_OrdenServicio: null,
                OrdenServicioID: ParteOrdenServicioID,
                Tipo: componente.Tipo,
                UsuarioCreacion: userId,
                UsuarioModificacion: userId,
                componente_id: null,
                fabricante: "",
                fechaFabricacion: "",
                fechaInstalacion: "",
                modelo: "",
                numero: "",
                potencia: "",
                release: "",
                serie: "",
                sistemaOperativo: "",
                tamano: "",
                ubicacion: "",
                voltaje: "",
            }
            parte = [...parte, partes]
            console.log("parte", parte)
            let p = parte.filter((item) => item.Estado == "ACTI")
            dispatch(setComponenteTool(p))
            setComponent(p)
            limpia()
        }
    }
    const EliminadrComponenteAgregado = (item, index) => {
        Alert.alert(
            "Eliminar",
            "¿Está seguro de eliminar el componente?",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => EliminarComponente(item, index) }
            ],
            { cancelable: false }
        )
    }

    const EliminarComponente = async (item, index) => {
        var os_partesRepuestos = ComponenteStor.componente
        var p = os_partesRepuestos.map((part) => {
            if (part.FechaCreacion == item.FechaCreacion) {
                return {
                    ...part,
                    Estado: "INAC"
                }
            } else {
                return part
            }
        })
        let filter = p.filter((item) => item.Estado == "ACTI")
        dispatch(setComponenteTool(filter))
        setComponent(filter)
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={{
                    width: "100%",
                }}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                <View style={styles.ContenedorCliente}>
                    <LoadingActi loading={Events.loading} />
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
                            selectedValue={componente.Tipo}
                            enabled={fini}
                            onValueChange={(itemValue, itemIndex) =>
                                setComponente({
                                    ...componente,
                                    Tipo: itemValue
                                })
                            }>
                            <Picker.Item label="Seleccione un tipo de componente" value="" />
                            {
                                incidente.map((item, index) => (
                                    item.descripcion == componente.Tipo ?
                                        <Picker.Item
                                            label={item.descripcion}
                                            value={item.descripcion}
                                            selected={true}
                                        />
                                        : <Picker.Item label={item.descripcion} value={item.descripcion} />
                                ))
                            }
                        </Picker>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Descripción:"
                        value={componente.Descripcion}
                        editable={fini}
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
                            editable={fini}
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
                        marginBottom: '10%'
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
                        editable={fini}
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

                    <View
                        style={{
                            // ...styles.wFull,
                            height: 'auto',
                            width: '100%',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            // marginTop: '5%',
                            marginBottom: '10%'
                        }}>

                        {
                            Component.length > 0 ?
                                Component.map((item, index) => {
                                    return (
                                        <View
                                            key={index}
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                backgroundColor: "#D6FCD9",
                                                padding: 10,
                                                borderBottomWidth: 0.5,
                                                borderRadius: 0,
                                                width: '100%',
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
                                                onPress={() => EliminadrComponenteAgregado(item, index)}
                                            >
                                                <AntDesign name="delete" size={20} color="red" />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }) : null

                        }

                    </View>
                    <View style={{ paddingBottom: '20%' }} ></View>
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
        height: "100%",
        backgroundColor: '#FFFFFF',
        padding: 20,
        paddingBottom: "20%",
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