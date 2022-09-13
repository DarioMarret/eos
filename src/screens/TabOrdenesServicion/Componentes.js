import { StyleSheet, Text, TextInput, View, Switch, ScrollView, TouchableOpacity, FlatList, SafeAreaView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { AntDesign } from '@expo/vector-icons'
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import BannerOrderServi from "../../components/BannerOrdenServ";
import { CambieEstadoSwitch, EstadoSwitch, ListaComponentes } from "../../service/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COMPONENTE_ } from "../../utils/constantes";


export default function Componentes(props) {
    const { navigation } = props
    const [selectComponent, setSelectedLanguage] = useState();
    const [incidente, setIncidente] = useState([]);

    const [nComponente, setNComponente] = useState([
        {
            tipoComponente: "Parte Solicitada",
            description: "prueba",
            garantia: false,
            doa: false,
            exchange: false,
            cantidad: 1,
            numeroParte: 123,
        },
        {
            tipoComponente: "Parte Instalada",
            description: "prueba",
            garantia: false,
            doa: false,
            exchange: false,
            cantidad: 1,
            numeroParte: 123,
        }
    ]);
    const [isEnabled, setIsEnabled] = useState(false);

    const [isGarantia, setIsGarantia] = useState(false);
    const [isDoa, setIsDoa] = useState(false);
    const [isExchange, setIsExchange] = useState(false);

    const [componente, setComponente] = useState({
        tipoComponente: "",
        description: "",
        garantia: false,
        doa: false,
        exchange: false,
        cantidad: 0,
        numeroParte: 0,
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
                const inci = await ListaComponentes()
                setIncidente(inci)


                let est = await EstadoSwitch(3)
                console.log("est", est);
                if (est.estado == 1) {
                    setIsEnabled(!true)
                } else {
                    setIsEnabled(!false)
                }
                let dat = await AsyncStorage.getItem(COMPONENTE_)
                if (dat != null) {
                    setDatos(JSON.parse(dat))
                }
            })()
        }, [])
    )

    const SwitchGuardar = async () => {
        setIsEnabled(!isEnabled)
        if (isEnabled) {
            let estado = await CambieEstadoSwitch(3, 1)
            console.log("estado datos", estado.estado)
            await AsyncStorage.setItem(COMPONENTE_, JSON.stringify({
                ...componente
            }))
        } else {
            let estado = await CambieEstadoSwitch(3, 0)

            console.log("estado datos", estado.estado)
        }
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
                borderRadius: 10,
            }}>
                <View>
                    <Text style={styles.text}>{item.tipoComponente}/{item.description}/{"CANT:" + item.cantidad}</Text>
                    <Text style={styles.text}>PARTE:{item.numeroParte}</Text>
                    <Text style={styles.text}>DOA:{item.doa == false ? "OFF": "ON"}/GARANTIA:{item.garantia  == false ? "OFF": "ON"}/EXCHANGE:{item.exchange  == false ? "OFF": "ON"}</Text>
                </View>
                <TouchableOpacity>
                    <AntDesign name="delete" size={20} color="red" />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView
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
                                    tipoComponente: itemValue
                                })
                            }>
                            <Picker.Item label="Tipo de Incidente" value={true} />
                            {
                                incidente.map((item, index) => (
                                    <Picker.Item label={item.descripcion} value={item.id} />
                                ))
                            }
                        </Picker>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Descripción:"
                        value={componente.description}
                        editable={isEnabled}
                        onChangeText={(text) => setComponente({ ...componente, description: text })} />
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
                            value={componente.cantidad}
                            onChangeText={(text) => setComponente({ ...componente, cantidad: text })}
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
                                thumbColor={isEnabled ? "#FF6B00" : "#ffffff"}
                                ios_backgroundColor="#FFAF75"
                                onValueChange={toggleSwitchGarantia}
                                value={isEnabled}
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
                                thumbColor={isEnabled ? "#FF6B00" : "#ffffff"}
                                ios_backgroundColor="#FFAF75"
                                onValueChange={toggleSwitchDoa}
                                value={isEnabled}
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
                                thumbColor={isEnabled ? "#FF6B00" : "#ffffff"}
                                ios_backgroundColor="#FFAF75"
                                onValueChange={toggleSwitchExchange}
                                value={isEnabled}
                            />
                        </View>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Numero de parte:"
                        value={componente.numeroParte}
                        editable={isEnabled}
                        onChangeText={(text) => setComponente({ ...componente, numeroParte: text })} />
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        height: "15%",
                        width: "100%",
                        backgroundColor: "#FFFFFF"
                    }}>
                        <TouchableOpacity style={styles.btn} onPress={() => console.log("Crear componente")}>
                            <AntDesign name="plus" size={24} color="#FFF" />
                            <Text style={{
                                fontSize: 18,
                                color: '#FFF',
                                fontFamily: 'Roboto',
                                marginLeft: 10
                            }}>AGREGAR COMPONENTE</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flexDirection: "column",
                    }}>
                        <SafeAreaView>
                            <FlatList
                                data={nComponente}
                                renderItem={_iTemView}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </SafeAreaView>

                    </View>
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