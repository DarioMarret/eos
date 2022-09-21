import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, ScrollView } from 'react-native';

export default function ModalGenerico(props) {

    const { modalVisible, setModalVisible, titulo, txtboton1, txtboton2, subtitle, contenflex } = props;

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => { setModalVisible(!modalVisible); }}
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
                            <Text style={{ ...styles.modalText, fontSize: 12 }}>{subtitle}</Text>
                        </View>
                        <ScrollView
                            style={{
                                flexDirection: 'column',
                                padding: 0,
                            }}
                        >
                            {
                                contenflex.length > 0 ?
                                    contenflex.map((item, index) => {
                                        if (item.Correo != "") {
                                            return (
                                                <View key={index} style={{
                                                    width: '70%',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-start',
                                                    paddingVertical: 0,
                                                    borderBottomWidth: 0.3,
                                                    borderBottomColor: '#B2B2AF',
                                                    marginBottom: 15
                                                }}>
                                                    <Text style={{ ...styles.modalText, fontSize: 12 }}>{item.Correo}</Text>
                                                    <Pressable>
                                                        <MaterialCommunityIcons
                                                            name={'checkbox-marked-circle'}
                                                            // name={'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                                                            size={24}
                                                            color={"#FF6B00"}
                                                        // color={item.isChecked == "true" ? "#FF6B00" : "#858583"}
                                                        />
                                                    </Pressable>
                                                </View>
                                            )
                                        }
                                    }
                                    )
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
                            <Pressable>
                                <Text style={{
                                    ...styles.textStyle,
                                    color: '#FF6B00',
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                    marginRight: 20,
                                }}>{txtboton1}</Text>
                            </Pressable>
                            <Pressable>
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
