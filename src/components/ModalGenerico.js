import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import React, { useCallback } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView, TouchableOpacity } from 'react-native';
import { useIsConnected } from 'react-native-offline';
import { useSelector, useDispatch } from 'react-redux';
import { loadingCargando } from '../redux/sincronizacion';
import { EnviarCorreo } from '../service/enviarCorreo';
import { getRucCliente } from '../service/OS_OrdenServicio';
import { getToken } from '../service/usuario';
import { ticketID } from '../utils/constantes';
import LoadingActi from './LoadingActi';

export default function ModalGenerico(props) {

    const { modalVisible, setModalVisible,
        titulo, txtboton1, txtboton2, subtitle,
        contenflex, setlistadoEmails, idOrdenServicio
    } = props;

    const Events = useSelector(s => s.sincronizacion)
    const dispatch = useDispatch()

    const handleChange = (id_correoCliente) => {
        let temp = contenflex.map(listC => {
            if (id_correoCliente == listC.id_correoCliente) {
                if (listC.isChecked == "true") {
                    return { ...listC, isChecked: "false" }
                } else {
                    return { ...listC, isChecked: "true" }
                }
            }
            return listC
        })
        setlistadoEmails(temp)
    }
    const isConnected = useIsConnected();
    useFocusEffect(
        useCallback(() => {
            (async () => {
                if (isConnected) {
                    dispatch(loadingCargando(true))
                    const itenSelect = JSON.parse(await AsyncStorage.getItem(ticketID))
                    const { OrdenServicioID } = itenSelect
                    const { ClienteID, UsuarioCreacion } = await getRucCliente(OrdenServicioID)
                    const { token } = await getToken()
                    const { data } = await axios.get(`https://technical.eos.med.ec/MSOrdenServicio/correos?ruc=${ClienteID}&ordServ=${OrdenServicioID}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    if (data.length > 0) {
                        setlistadoEmails(data)
                        dispatch(loadingCargando(false))
                    }
                    dispatch(loadingCargando(false))
                }
            })()
        }, [])
    );

    const handleEnviarCorreo = async () => {
        let temp = contenflex.filter(listC => listC.isChecked == "true")
        var Correo = [JSON.parse(await AsyncStorage.getItem("user:")).username]
        temp.forEach(element => {
            Correo.push(element.Correo)
        })
        if (Correo.length > 0) {
            dispatch(loadingCargando(true))
            const status = await EnviarCorreo(Correo, idOrdenServicio)
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

    const handleCancelar = () => {
        setModalVisible(!modalVisible);
        setlistadoEmails("")
    }
    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => { setModalVisible(!modalVisible) }}
            >
                <View style={styles.centeredView}>
                    {/* <LoadingActi loading={Events.loading} /> */}
                    <LoadingActi loading={Events.loading} />
                    <View style={styles.modalView}>
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                width: '100%',
                            }}
                        >
                            <Text style={{ ...styles.modalText, fontWeight: "bold", fontSize: 20 }}>{titulo}</Text>
                            <Text style={{ ...styles.modalText, fontSize: 13 }}>{subtitle}</Text>
                        </View>
                        <ScrollView
                            showsVerticalScrollIndicator={false}

                        >
                            {
                                contenflex.length > 0 ?
                                    contenflex.map((item, index) => {
                                        if (item.Correo != "" && item.Correo != null) {
                                            return (
                                                <View key={index}
                                                    style={{
                                                        width: '74%',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        // paddingVertical: 0,
                                                        borderBottomWidth: 0.3,
                                                        borderBottomColor: '#B2B2AF',
                                                        marginBottom: 15
                                                    }}>
                                                    <Text style={{ ...styles.modalText, fontSize: 14 }}>{item.Correo}</Text>
                                                    <Pressable onPress={() => handleChange(item.id_correoCliente)}>
                                                        <MaterialCommunityIcons
                                                            name={item.isChecked == "true" ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                                                            size={24}
                                                            color={item.isChecked == "true" ? "#FF6B00" : "#858583"}
                                                        />
                                                    </Pressable>
                                                </View>
                                            )
                                        }
                                    })
                                    :
                                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                                        <Text style={{ ...styles.modalText, fontSize: 12 }}>No hay datos</Text>
                                    </View>
                            }
                        </ScrollView>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                width: '100%',
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
