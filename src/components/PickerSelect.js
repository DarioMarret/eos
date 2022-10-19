import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { GetClienteCustimerName } from '../service/clientes'
import { AntDesign } from '@expo/vector-icons'
import React, { useState } from 'react'
import { getCantonesStorageBy } from '../service/cantones';
import { useDispatch } from 'react-redux';
import { actualizarClienteTool } from '../redux/formulario';

export default function PickerSelect(props) {

    const { modalVisible, setModalVisible,
        setCliente,
        setDirecciones
    } = props;

    const [listCline, setlistCline] = useState([])
    const [search, setSearch] = useState("")
    const dispatch = useDispatch()

    const handleCancelar = () => {
        setModalVisible(!modalVisible);
    }

    async function handleBuscarCliente() {
        console.log(search)
        if (search.length > 0) {
            const list = await GetClienteCustimerName(search)
            setlistCline(list)
        }
    }


    const handleSelectCliente = async (cliente) => {
        const pro = await getCantonesStorageBy(cliente.CantonID)
        dispatch(actualizarClienteTool({
            name:'Ciudad',
            value:pro[0].descripcion
        }))
        dispatch(actualizarClienteTool({
            name:'ClienteID',
            value:cliente.CustomerID
        }))
        dispatch(actualizarClienteTool({
            name:'ClienteNombre',
            value:cliente.CustomerName
        }))
        setCliente({
            ...cliente,
            Sucursal: JSON.parse(cliente.Sucursal),
            Ciudad: pro[0].descripcion
        })
        setDirecciones(JSON.parse(cliente.Sucursal))
        setModalVisible(!modalVisible)
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
                            onChangeText={(text) => {
                                setSearch(text)
                                handleBuscarCliente()
                            }}
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

                                    >
                                        <TouchableOpacity
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
                                            onPress={() => handleSelectCliente(listC)}
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
                    <View>
                        <TouchableOpacity
                            style={{
                                width: '100%',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingVertical: 0,
                                borderWidth: 0.3,
                                borderBottomColor: '#B2B2AF',
                                marginBottom: 15,
                                height: 50,
                                width: 100,
                                borderRadius: 20,
                            }}
                            onPress={() => handleCancelar()}
                        >
                            <Text>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
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