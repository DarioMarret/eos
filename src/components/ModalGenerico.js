import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView } from 'react-native';
import { EnviarCorreo } from '../service/enviarCorreo';

export default function ModalGenerico(props) {

    const { modalVisible, setModalVisible,
        titulo, txtboton1, txtboton2, subtitle,
        contenflex, setlistadoEmails, idOrdenServicio
    } = props;

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

    const handleEnviarCorreo = async () => {
        let temp = contenflex.filter(listC => listC.isChecked == "true")
        var Correo = []
        temp.forEach(element => {
            Correo.push(element.Correo)
        })
        if (Correo.length > 0) {
            const { Message, Status } = await EnviarCorreo(Correo, idOrdenServicio)
            if (Status) {
                Alert.alert("Correo", "Correo enviado correctamente", [
                    { text: "Cancelar", onPress: () => setModalVisible(!modalVisible) },
                    { text: "OK", onPress: () => setModalVisible(!modalVisible) }
                ])
            }
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
                                                        width: '79%',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'flex-start',
                                                        paddingVertical: 0,
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
                            <Pressable onPress={handleEnviarCorreo}>
                                <Text style={{
                                    ...styles.textStyle,
                                    color: '#FF6B00',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    marginRight: 20,
                                }}>{txtboton1}</Text>
                            </Pressable>
                            <Pressable onPress={handleCancelar}>
                                <Text style={{
                                    ...styles.textStyle,
                                    color: '#B2B2AF',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    marginRight: 15,
                                }}>{txtboton2}</Text>
                            </Pressable>
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
