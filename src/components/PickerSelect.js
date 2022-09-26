import { Button, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { GetClienteCustimerName } from '../service/clientes'
import { AntDesign } from '@expo/vector-icons'
import React, { useState } from 'react'
import { getProvinciasStorageBy } from '../service/provincias';
import { getCantonesStorageBy } from '../service/cantones';

export default function PickerSelect(props) {

    const { modalVisible, setModalVisible,
        setCliente
    } = props;

    const [listCline, setlistCline] = useState([])
    const [search, setSearch] = useState("")

    const handleCancelar = () => {
        setModalVisible(!modalVisible);
        setlistadoEmails("")
    }

    async function handleBuscarCliente() {
        // setSearch(text)
        console.log(search)
        const list = await GetClienteCustimerName(search)
        // console.log("list", list);
        setlistCline(list)
    }


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => { setModalVisible(!modalVisible) }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={{
                        borderWidth: 1,
                        borderColor: "#CECECA",
                        width: "100%",
                        height: 60,
                        borderRadius: 10,
                        padding: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 20,
                    }}>
                        <TextInput
                            style={{ width: "90%", height: "100%" }}
                            placeholder="Escriba el nombre del cliente"
                            value={search}
                            onChangeText={(text) => setSearch(text)}
                        // editable={false}
                        />
                        <AntDesign
                            onPress={() => handleBuscarCliente()}
                            name='search1'
                            size={24}
                            color='#000000'
                        />
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        {
                            listCline.map((listC, index) => {
                                return (
                                    <View key={index}
                                        style={{
                                            width: '100%',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'flex-start',
                                            paddingVertical: 0,
                                            borderBottomWidth: 0.3,
                                            borderBottomColor: '#B2B2AF',
                                            marginBottom: 15,
                                            height: 50
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={async () => {
                                                const pro = await getCantonesStorageBy(listC.CantonID)
                                                setCliente({
                                                    ...listC,
                                                    Sucursal: JSON.parse(listC.Sucursal),
                                                    Ciudad: pro[0].descripcion
                                                })
                                                setModalVisible(!modalVisible)
                                            }}
                                        >
                                            <Text>
                                                {listC.CustomerName}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }

                    </ScrollView>
                </View>
            </View>
        </Modal>
    )
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
        width: "90%",
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
})