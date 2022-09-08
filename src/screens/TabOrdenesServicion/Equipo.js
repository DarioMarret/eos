import { FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Picker } from '@react-native-picker/picker'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useCallback, useEffect, useState } from "react";
import BannerOrderServi from "../../components/BannerOrdenServ";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getEquiposStorage } from "../../service/equipos";
import { getModeloEquiposStorage } from "../../service/modeloquipo";
import { getHistorialEquiposStorage } from "../../service/historiaEquipo";


export default function Equipo(props) {
    const { navigation, route } = props
    const { name, params } = route

    console.log(params)


    const [equipo, setEquipo] = useState([])
    const [modelo, setModelo] = useState([])
    const [modelosub, setModeloSub] = useState([])
    const [historial, setHistorial] = useState([])

    const [tipo, setTipo] = useState("")
    const [model, setModel] = useState("")
    const [serie, setSerie] = useState("")

    const [showMenu, setShowMenu] = useState(false)
    const [itemIndex, setItemIndex] = useState(null)
    const [isVisible, setIsVisible] = useState(false)

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const response = await getEquiposStorage();
                setEquipo(response.sort((a, b) => a.tipo_descripcion.localeCompare(b.tipo_descripcion)))
                const modelos = await getModeloEquiposStorage()
                setModelo(modelos.sort((a, b) => a.modelo_descripcion.localeCompare(b.modelo_descripcion)))
            })()
        }, [])
    )
    useEffect(() => {
        EquipoHistorial()
    }, [tipo, model, serie]);
    useEffect(() => {
        onChange()
    }, [tipo]);

    async function onChange() {
        setModel("")
        const respuesta = modelo.filter(e => e.tipo_id === tipo)
        setModeloSub(respuesta)
        await EquipoHistorial()
    }

    const handleChange = (equ_serie) => {
        let temp = historial.map((hist) => {
            if (equ_serie === hist.equ_serie) {
                if (hist.isChecked === true) {
                    return { ...hist, isChecked: false };
                } else {
                    return { ...hist, isChecked: true };
                }
            }
            return hist;
        });
        setHistorial(temp);
        console.log(equ_serie, "a")
    };
    const showCoso = (index) => {
        setItemIndex(index)
    }
    const showModal = (type) => {
        console.log(type)
    }
    const _renderItem = ({ item, index, isClick }) => {
        if (!isVisible) return null
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
                        <Pressable onPress={() => handleChange(item.equ_serie)} >
                            <MaterialCommunityIcons
                                name={item.isChecked ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                                size={24}
                                color={item.isChecked ? "#FF6B00" : "#858583"}
                            />
                        </Pressable>
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
                        <Text onPress={() => showCoso(index)} style={{
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
                        <TouchableOpacity style={styles.boxOptionsText} onPress={() => showModal('history')}>
                            <Text style={styles.boxOptionsText}>Historial de Equipo
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.boxOptionsText} onPress={() => showModal('team')}>
                            <Text style={styles.boxOptionsText}>Detalles de Equipo
                            </Text>
                        </TouchableOpacity>
                    </View>)

                }
            </View>
        )
    }

    async function EquipoHistorial() {
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
        console.log("resultado de busqueda-->",result)
        // setHistorial(result)
    }



    return (
        <View style={styles.container}>
            <View style={styles.contenedor}>
                <View style={styles.ContainetEquipo}>
                    <View style={styles.ContainetBuscador}>
                        <View style={styles.ContainetTipoModelo}>
                            <Picker
                                style={{ ...styles.input, borderWidth: 1, borderColor: '#CECECA' }}
                                selectedValue={tipo}
                                onValueChange={(itemValue) => setTipo(itemValue)}
                            >
                                <Picker.Item label="Tipo" value={""} />
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
                                onValueChange={(itemValue, itemIndex) => setModel(itemValue)}>
                                <Picker.Item label="Modelo" value={""} />
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
                            onChangeText={text => setSerie(text)}
                            placeholder="Serie"
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
                    }} onPress={() => DropTabla()}>
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
            <BannerOrderServi
                {...props}
                navigation={navigation}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
        backgroundColor: '#E5E5E5',
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
        right: 30,
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
    }
});
