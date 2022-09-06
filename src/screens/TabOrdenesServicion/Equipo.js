import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Picker } from '@react-native-picker/picker'
import { AntDesign } from '@expo/vector-icons'
import { useCallback, useEffect, useState } from "react";
import BannerOrderServi from "../../components/BannerOrdenServ";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getEquiposStorage } from "../../service/equipos";
import { getModeloEquiposStorage } from "../../service/modeloquipo";
import { getHistorialEquiposStorage } from "../../service/historiaEquipo";
import Checkbox from "expo-checkbox";
import db from "../../service/Database/model";

export default function Equipo(props) {
    const { navigation } = props
    const [equipo, setEquipo] = useState([])
    const [modelo, setModelo] = useState([])
    const [modelosub, setModeloSub] = useState([])
    const [historial, setHistorial] = useState([])
    const [isChecked, setChecked] = useState(false);

    const [selectedLanguage, setSelectedLanguage] = useState();
    const [tipo, setTipo] = useState("")
    const [model, setModel] = useState("")
    const [serie, setSerie] = useState("")

    useFocusEffect(
        useCallback(() => {
            (async () => {
                db.transaction(tx => {
                    tx.executeSql('select * from historialEquipo where equ_tipoEquipo = ? and equ_serie = ?', [10, "002371"], (_, { rows }) => {
                        console.log("resultado-->",rows._array)

                    });
                })
                const response = await getEquiposStorage();
                console.log("response", response.length)
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
    function onChangeModel(item) {
        setModel(item)
        
    }
    const handleCheckboxChange = () => {
        setChecked(!isChecked);
    }
    const _renderItem = ({ item, index }) => {
        return (
            <View style={{ flex: 1, padding: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    width: '100%',
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderBottomWidth: 0.5,
                    borderColor: '#858583'

                }}>
                    <View>
                        <Text>
                            <Checkbox style={{
                                borderRadius: 10
                            }} disabled value={isChecked} onValueChange={handleCheckboxChange} />
                        </Text>
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
                        }}>{item.equ_SitioInstalado+"/"+item.equ_areaInstalado}</Text>
                    </View>
                    <View>
                        <Text style={{
                            rotation: 90,
                        }}>
                            <AntDesign name="ellipsis1" size={24} color="black" />
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
    async function EquipoHistorial() {
        var result = []
        console.log("serie", serie)
        if (tipo !== "" && model !== "") {
            console.log("tipo", tipo, "Model", model)
            result = await getHistorialEquiposStorage(tipo, model, "")
        } else if (tipo !== "Tipo") {
            console.log("tipo", tipo)
            result = await getHistorialEquiposStorage(tipo, "", "")
        } else if (tipo !== "" && model !== "" && serie !== "") {
            console.log("tipo", tipo, "Model", model, "serie",serie)
            result = await getHistorialEquiposStorage(tipo, model, serie)
        }else if (tipo !== "" && serie !== "") {
            console.log("tipo", tipo, "serie",serie)
            result = await getHistorialEquiposStorage(tipo, "", serie)
        }else if(tipo == "" && model == "" && serie !== ""){
            console.log("serie",serie)
            result = await getHistorialEquiposStorage("", "", serie)
        }
        console.log("result", result)
        setHistorial(result)
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
                                {/* onValueChange={(itemValue, itemIndex) => onChangeModel(itemValue)}> */}
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
                        justifyContent:'flex-start',
                        height: "72%",
                    }}>
                        <SafeAreaView>
                            <FlatList
                                data={historial}
                                renderItem={_renderItem}
                                // numColumns={numColumns}
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
            <BannerOrderServi />
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

});
