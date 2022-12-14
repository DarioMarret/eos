import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Alert, Modal, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, FlatList, SafeAreaView } from 'react-native';
import { useIsConnected } from 'react-native-offline';
import { useSelector, useDispatch } from 'react-redux';
import { loadingCargando } from '../redux/sincronizacion';
import { EnviarCorreo } from '../service/enviarCorreo';
import { SacarClienteID } from '../service/OS_OrdenServicio';
import LoadingActi from './LoadingActi';
import { GetCorreos } from '../service/getCorreos';


export default function ModalGenerico(props) {

    const { modalVisible, setModalVisible,
        titulo, txtboton1, txtboton2, subtitle,
        contenflex, setlistadoEmails, idOrdenServicio
    } = props;

    const [CorreosEmail, setCorreosEmail] = useState([]);


    const Events = useSelector(s => s.sincronizacion)
    const formulario = useSelector(s => s.formulario)
    const dispatch = useDispatch()



    const handleChangelocal = (id_correoCliente) => {
        let temp = CorreosEmail.map(listC => {
            if (id_correoCliente == listC.id_correoCliente) {
                if (listC.isChecked == "true") {
                    return { ...listC, isChecked: "false" }
                } else {
                    return { ...listC, isChecked: "true" }
                }
            }
            return listC
        })
        setCorreosEmail(temp)
    }
    const isConnected = useIsConnected();
    useFocusEffect(
        useCallback(() => {
            (async () => {
                try {
                    if (isConnected) {
                        dispatch(loadingCargando(true))
                        const ClienteID = await SacarClienteID(formulario.OrdenServicioID)
                        const listCorreos = await GetCorreos(ClienteID, formulario.OrdenServicioID)
                        console.log(listCorreos)
                        if (listCorreos.length > 0) {
                            let correos = listCorreos.filter(c => c.Correo != "" && c.Correo != null)
                            setCorreosEmail(correos)
                        }else{
                            setCorreosEmail([])
                        }
                        dispatch(loadingCargando(false))
                    }
                } catch (error) {
                    dispatch(loadingCargando(false))
                    console.log(error)                    
                }
            })()
        }, [])
    );

    const handleEnviarCorreo = async () => {
        let temp = CorreosEmail.filter(listC => listC.isChecked == "true")
        var Correo = [JSON.parse(await AsyncStorage.getItem("user:")).username]
        temp.forEach(element => {
            Correo.push(element.Correo)
        })
        if (Correo.length > 0) {
            dispatch(loadingCargando(true))
            const status = await EnviarCorreo(Correo, formulario.OrdenServicioID)
            console.log("status", status)
            if (status == 200) {
                Alert.alert("Correo", "Correo enviado correctamente", [
                    {
                        text: "Cancelar", onPress: () => {
                            setModalVisible(!modalVisible)
                            dispatch(loadingCargando(false))
                        }
                    },
                    {
                        text: "OK", onPress: () => {
                            let temp = CorreosEmail.map(listC => {
                                if (listC.isChecked == "true") {
                                    return { ...listC, isChecked: "false" }
                                } else {
                                    return listC
                                }
                            })
                            setCorreosEmail(temp)
                            setModalVisible(!modalVisible)
                            dispatch(loadingCargando(false))
                        }
                    }
                ])
            } else {
                Alert.alert("Correo", "Error al enviar correo", [
                    {
                        text: "Cancelar", onPress: () => {
                            setModalVisible(!modalVisible)
                            dispatch(loadingCargando(false))
                        }
                    },
                    {
                        text: "OK", onPress: () => {
                            setModalVisible(!modalVisible)
                            dispatch(loadingCargando(false))
                        }
                    }
                ])
            }
        } else {
            Alert.alert("Correo", "No hay correos para enviar", [
                {
                    text: "Ok", onPress: () => {
                        setModalVisible(!modalVisible)
                        dispatch(loadingCargando(false))
                    }
                }
            ])
        }
    }

    const BuscarCorreoLocal = (text) => {
        var correos = CorreosEmail.filter(listC => listC.Correo != "" && listC.Correo != null)
        // setCorreosEmail(correos)
        if (text.length != 0) {
            let texto = text.toLowerCase()
            // let temp = correos.filter((items, index) => items.Correo.includes(texto))
            let temp = correos.sort((a, b) => {
                if (a.Correo.toLowerCase().includes(texto)) {
                    return -1
                } else if (b.Correo.toLowerCase().includes(texto)) {
                    return 1
                } else {
                    return 0
                }
            })
            console.log("temp", temp)
            setCorreosEmail(temp)
        } else {
            setCorreosEmail(correos)
        }
    }

    const handleCancelar = () => {
        setModalVisible(!modalVisible);
        setlistadoEmails("")
    }

    // useEffect(() => {
    //     if (modalVisible) {
    //         setCorreosEmail(contenflex)
    //     }
    // }, [modalVisible == false])


    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => { setModalVisible(!modalVisible) }}
            >
                <View style={styles.centeredView}>
                    <LoadingActi loading={Events.loading} />
                    <View style={styles.modalView}>
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                width: '100%',
                                marginBottom: 10
                            }}
                        >
                            <Text style={{ ...styles.modalText, fontWeight: "bold", fontSize: 20 }}>{titulo}</Text>
                            <Text style={{ ...styles.modalText, fontSize: 13 }}>{subtitle}</Text>
                            <TextInput
                                style={{
                                    height: 60,
                                    width: '100%',
                                    borderColor: 'gray',
                                    borderWidth: 1,
                                    borderRadius: 5,
                                    marginBottom: 20,
                                    paddingHorizontal: 10
                                }}
                                placeholder="Buscar Correo"
                                onChangeText={text => BuscarCorreoLocal(text)}
                            />
                        </View>
                        <View style={{ width: '100%', height: '60%' }}>
                            <SafeAreaView>
                            <FlatList
                            style={{
                                paddingHorizontal: 10
                            }}
                                data={CorreosEmail}
                                renderItem={({ item, index }) => (
                                    <View key={index}
                                        style={{
                                            width: '100%',
                                            // height: 50,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'flex-start',
                                            borderBottomWidth: 0.3,
                                            borderBottomColor: '#B2B2AF',
                                            marginBottom: 10
                                        }}>
                                        <Text style={{ ...styles.modalText, fontSize: 14, width: "90%", textAlign: "left" }}>{item.Correo}</Text>
                                        <TouchableOpacity onPress={() => handleChangelocal(item.id_correoCliente)}>
                                            <MaterialCommunityIcons
                                                name={item.isChecked == "true" ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                                                size={24}
                                                color={item.isChecked == "true" ? "#FF6B00" : "#858583"}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                            </SafeAreaView>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                marginTop: 10
                            }}
                        >
                            <TouchableOpacity onPress={handleEnviarCorreo}>
                                <Text style={{
                                    ...styles.textStyle,
                                    color: '#FF6B00',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    marginRight: 20,
                                    borderWidth: 1,
                                    borderColor: '#FF6B00',
                                    borderRadius: 20,
                                    padding: 8,
                                }}>{txtboton1}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancelar}>
                                <Text style={{
                                    ...styles.textStyle,
                                    color: '#B2B2AF',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    marginRight: 15,
                                    borderWidth: 1,
                                    borderColor: '#B2B2AF',
                                    borderRadius: 20,
                                    padding: 8,
                                }}>{txtboton2}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 10,
        width: "85%",
        height: "85%",
        backgroundColor: "white",
        borderRadius: 5,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});
