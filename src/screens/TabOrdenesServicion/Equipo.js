import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Picker } from '@react-native-picker/picker'
import { AntDesign } from '@expo/vector-icons'
import { useCallback, useEffect, useState } from "react";
import BannerOrderServi from "../../components/BannerOrdenServ";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getEquiposStorage } from "../../service/equipos";
import { getModeloEquiposStorage } from "../../service/modeloquipo";
import { getHistorialEquiposStorage } from "../../service/historiaEquipo";
import db from "../../service/Database/model";

export default function Equipo(props) {
    const { navigation } = props
    const [equipo, setEquipo] = useState([])
    const [modelo, setModelo] = useState([])
    const [modelosub, setModeloSub] = useState([])
    const [historialequipoSelect, setHistorialEquipoSelect] = useState([])

    const [selectedLanguage, setSelectedLanguage] = useState();
    const [tipo, setTipo] = useState("tipo")
    const [model, setModel] = useState("Modelo")

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const response = await getEquiposStorage();
                setEquipo(response);
                const modelos = await getModeloEquiposStorage()
                setModelo(modelos)
                await db.exec([{
                    sql: 'SELECT COUNT(equipo_id) FROM historialEquipo',
                    args: []
                }], true, (tx, results) => {
                    console.log(tx)
                    console.log(results)
                })
                // const historial = await getHistorialEquiposStorage()
                // console.log("historial-->",historial)
                // setHistorialEquipoSelect(historial)
            })()
        }, [])
    )
    function DropTabla() {
        db.exec([{
            sql: `DELETE FROM historialEquipo`,
            args: []
        }], false, (tx, results) => {
            console.log("resultado tx", tx);
            console.log("resultado al crear la tabla historialEquipo", results);
        })
    }
    function onChange(item) {
        setTipo(item)
        const respuesta = modelo.filter(e => e.tipoEquipo === item)
        setModeloSub(respuesta)
        FirterOrden()
    }
    function onChangeModel(item) {
        setModel(item)
        FirterOrden()
    }
    function FirterOrden() {
        const respuesta = historialequipoSelect.filter(e => e.tipoEquipo === tipo && e.modeloEquipo === model)
        console.log(respuesta)
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
                                onValueChange={(itemValue, itemIndex) => onChange(itemValue)}>
                                <Picker.Item label="Tipo" value={true} />
                                {
                                    equipo ?
                                        equipo.map((item, index) => (
                                            <Picker.Item key={index + 1} label={item.tipo_descripcion} value={item.tipo_descripcion} />
                                        ))
                                        : null
                                }
                            </Picker>
                        </View>
                        <View style={{ paddingHorizontal: 20 }} />
                        <View style={styles.ContainetTipoModelo}>
                            <Picker
                                style={{ ...styles.input, borderWidth: 1, borderColor: '#CECECA' }}
                                selectedValue={model}
                                onValueChange={(itemValue, itemIndex) => onChangeModel(itemValue)}>
                                <Picker.Item label="Modelo" value={true} />
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
                            placeholder="Serie"
                        />
                    </View>
                    {/*  */}
                    <View style={styles.ContainetBuscador}>
                        <View style={styles.ContainetTipoModelo}>
                            <Picker
                                style={{ ...styles.input, borderWidth: 1, borderColor: '#CECECA' }}
                                selectedValue={selectedLanguage}
                                onValueChange={(itemValue, itemIndex) =>
                                    // setDatauser({ ...datauser, Estado: itemValue })
                                    console.log(itemValue)
                                }>
                                <Picker.Item label="Marca" value={true} />
                                {/* {
                                datauser.Estado === true ? (
                                    <Picker.Item label="Activo" value={true} />
                                ) : (
                                    <Picker.Item label="Desabilitado" value={false} />
                                )
                            } */}
                            </Picker>
                        </View>
                        <View style={{ paddingHorizontal: 20 }} />
                        <View style={styles.ContainetTipoModelo}>
                            <Picker
                                style={{ ...styles.input, borderWidth: 1, borderColor: '#CECECA' }}
                                selectedValue={selectedLanguage}
                                onValueChange={(itemValue, itemIndex) =>
                                    // setDatauser({ ...datauser, Estado: itemValue })
                                    console.log(itemValue)
                                }>
                                <Picker.Item label="Estado" value={true} />
                                {/* {
                                datauser.Estado === true ? (
                                    <Picker.Item label="Activo" value={true} />
                                ) : (
                                    <Picker.Item label="Desabilitado" value={false} />
                                )
                            } */}
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
                </View>
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    marginTop: "15%",
                    height: "20%",
                    width: "100%",
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
        width: '40%',
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
