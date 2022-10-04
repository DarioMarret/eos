import "react-native-gesture-handler";
import React, { useCallback, useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useFocusEffect, useNavigation } from "@react-navigation/native";
import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import Firmador from "../components/Firmador"

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';


import Consultas from '../screens/Consultas';
import OdernServicio from '../screens/OdernServicio';
import Separador from "../components/Separador";
import { MaterialCommunityIcons } from "@expo/vector-icons/build/Icons";
import useUser from "../hook/useUser";
import TicketsOS from "../screens/TabScreem/TicketsOS";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ticketID, os_firma } from "../utils/constantes";
import { FinalizarOS_ } from "../service/OS";
import VisualizadorPDF from "../components/VisualizadorPDF";
import { PDFVisializar, getRucCliente } from "../service/OS_OrdenServicio";
import { getToken } from "../service/usuario";
import ModalGenerico from "../components/ModalGenerico";

const Drawer = createDrawerNavigator();

function MenuLateral(prop) {

    const { logout } = useUser()

    const handleLogout = async () => {
        await logout()
    }

    return (
        <View style={styles.menu}>
            <View style={styles.header}>
                <Text style={{ fontWeight: "bold", fontSize: 20, color: "#FFF" }}>Soporte Pruebas</Text>
                <Text style={{ fontSize: 12, color: "#FFF" }}>soporte@eos.med.ec</Text>
            </View>
            <Separador />
            <TouchableOpacity style={styles.MenuIten} onPress={() => prop.navigation.navigate("Consultas")}>
                <View style={styles.item}>
                    <Text style={{ fontSize: 15, color: "#B2B2AF" }}>Inicia</Text>
                    <MaterialCommunityIcons name="home-floor-g" size={24} color="#B2B2AF" />
                </View>
            </TouchableOpacity>
            <Separador />
            <TouchableOpacity style={styles.MenuIten} onPress={handleLogout}>
                <View style={styles.item}>
                    <Text style={{ fontSize: 15, color: "#B2B2AF" }}>Cerrar</Text>
                    <MaterialCommunityIcons name="close-circle" size={24} color="#B2B2AF" />
                </View>
            </TouchableOpacity>
            <Separador />
        </View>
    )
}

function MenuFinal({setModalEmails, setModalSignature, VisualizarPdf, item}) {

    const [estado, setEstado] = useState(null)
    const [orderID, setOrderID] = useState(null)

    const FinalizarOS = async () => {
        var os = JSON.parse(await AsyncStorage.getItem("OS"))
        console.log(os)
        const itenSelect = JSON.parse(await AsyncStorage.getItem(ticketID))
        const { OrdenServicioID, Accion } = itenSelect

        if (OrdenServicioID != null) {
            let respuesta = await FinalizarOS_(OrdenServicioID, os)
            console.log("FinalizarOS", respuesta)
        }
    }


    useFocusEffect(
        useCallback(() => {
            (async () => {
                const itenSelect = JSON.parse(await AsyncStorage.getItem(ticketID))
                const { OrdenServicioID, Accion } = itenSelect
                console.log("OrdenServicioID", OrdenServicioID)
                console.log("Accion", Accion)
                setOrderID(OrdenServicioID)
                setEstado(Accion)
            })()
        }, [])
    );

    return (
        <Menu>
            <MenuTrigger
                text={<FontAwesome5 name="ellipsis-v" size={24} color="#FFFFFF" />}
                customStyles={{
                    triggerText: {
                        fontSize: 35,
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                    },
                }} />
            <MenuOptions
                customStyles={{
                    optionsContainer: {
                        width: 150,
                        backgroundColor: '#FFFFFF',
                        borderRadius: 3,
                        padding: 10,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    },
                }}
            >
                {
                    estado == "FINALIZADO" ? <>
                        <MenuOption
                            onSelect={() => setModalSignature(true)}
                            text='Agresar firma'
                            customStyles={{
                                optionText: {
                                    fontSize: 16,
                                    color: '#000000',
                                    fontWeight: 'bold',
                                    paddingBottom: 10,
                                },
                            }} />
                        <MenuOption
                            onSelect={() => setModalEmails(true)}
                            text='Enviar OS'
                            customStyles={{
                                optionText: {
                                    fontSize: 16,
                                    color: '#000000',
                                    fontWeight: 'bold',
                                    paddingBottom: 10,
                                },
                            }} />
                        <MenuOption
                            onSelect={() => VisualizarPdf(orderID)}
                            text='Vizualizar PDF'
                            customStyles={{
                                optionText: {
                                    fontSize: 16,
                                    color: '#000000',
                                    fontWeight: 'bold',
                                    paddingBottom: 10,
                                },
                            }} />
                    </> : <>
                        <MenuOption
                            onSelect={() => console.log("")}
                            text='Vizualizar PDF'
                            customStyles={{
                                optionText: {
                                    fontSize: 16,
                                    color: '#000000',
                                    fontWeight: 'bold',
                                    paddingBottom: 10,
                                },
                            }} />
                        <MenuOption
                            onSelect={() => FinalizarOS()}
                            text='Finalizar OS'
                            customStyles={{
                                optionText: {
                                    fontSize: 16,
                                    color: '#000000',
                                    fontWeight: 'bold',
                                },
                            }} />
                    </>
                }

            </MenuOptions>
        </Menu>
    )
}

function NavigatioGotBack() {
    const navigation = useNavigation();
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    )
}

function NavigatioGotBack2() {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalSignature, setModalSignature] = useState(false);
    const [OrdenServicioID, setOrdenServicioID] = useState(null)
    const [userData, setUserData] = useState(os_firma)
    const [pdfview, setPdfview] = useState(false)
    const [pdfurl, setPdfurl] = useState("")

    const [listadoEmails, setlistadoEmails] = useState([])
    const [idOrdenServicio, setIdOrdenServicio] = useState(null)
    const [modalEmails, setModalEmails] = useState(false);

    const enviarFirma = () => {
        setModalSignature(false)
    }
    async function EnviarOS(item) {
        console.log("EnviarOS", item)
        const { ClienteID, UsuarioCreacion } = await getRucCliente(item)
        console.log("ClienteID", ClienteID)

        const { token } = await getToken()
        const { data } = await axios.get(`https://technical.eos.med.ec/MSOrdenServicio/correos?ruc=${ClienteID}&c=${UsuarioCreacion}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        setlistadoEmails(data)
        setIdOrdenServicio(item)
        setModalEmails(!modalEmails)

    }
    async function VisualizarPdf(item) {
        const base64 = await PDFVisializar(item)
        setPdfurl(base64)
        setPdfview(true)
    }
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingRight: 15, width: "60%" }}>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Ionicons name="md-information-circle" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <MenuFinal setModalEmails={setModalEmails} modalSignature={modalSignature} VisualizarPdf={VisualizarPdf} setModalSignature={setModalSignature}/>
            <ModalGenerico
                modalVisible={modalEmails}
                setModalVisible={setModalEmails}
                titulo={"Envio de emails"}
                txtboton1={"Enviar email"}
                txtboton2={"Cancelar"}
                subtitle={"Seleccione los emails a los que desea enviar la OS"}
                contenflex={listadoEmails}
                setlistadoEmails={setlistadoEmails}
                idOrdenServicio={idOrdenServicio}
            />
            <Modal
                    transparent={true}
                    visible={modalSignature}
                    onRequestClose={() => {
                        setModalSignature(!modalSignature);
                    }}
                    propagateSwipe={true}
                >
                <Firmador
                    enviarFirma={enviarFirma}
                    setModalSignature={setModalSignature}
                    datauser={userData}
                    setUserData={setUserData}
                    OrdenServicioID={OrdenServicioID}
                />
            </Modal>
            <Modal
                    transparent={true}
                    visible={pdfview}
                    onRequestClose={() => {
                        setPdfview(!pdfview);
                    }}
                    propagateSwipe={true}
                >
                <VisualizadorPDF
                    url={pdfurl}
                    setPdfview={setPdfview}
                    setPdfurl={setPdfurl}
                    pdfview={pdfview}
                />
            </Modal>
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible)
                }}
            >
                <View style={{
                    flex: 1, justifyContent: "center", alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.5)"
                }}>
                    <View style={{ width: "80%", height: "50%", backgroundColor: "#FFF", borderRadius: 5 }}>
                        <View style={{
                            flex: 1,
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            padding: 10,
                            paddingHorizontal: 20,
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                            shadowColor: '#000',
                        }}>
                            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Información</Text>
                            <Text style={{ fontSize: 15, fontWeight: "normal" }}>
                                Puedes escoger entre las opciones enumeradas en la parte superios para la sección que deseas ingresar, ademas puedes navegar
                                enttre la seccioones para verificar informaciones y corregila si es necesario.
                            </Text>
                            <View>
                                <Text style={{ fontSize: 15, fontWeight: "normal", marginTop: 10 }}>1-EQUIPO</Text>
                                <Text style={{ fontSize: 15, fontWeight: "normal", marginTop: 10 }}>2-CLIENTE</Text>
                                <Text style={{ fontSize: 15, fontWeight: "normal", marginTop: 10 }}>3-DATOS</Text>
                                <Text style={{ fontSize: 15, fontWeight: "normal", marginTop: 10 }}>4-COMPONENTES</Text>
                                <Text style={{ fontSize: 15, fontWeight: "normal", marginTop: 10 }}>5-ADJUNTOS</Text>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "flex-end",
                                    flexDirection: "column",
                                    textAlign: "right",
                                    width: "100%",
                                    marginTop: 10,
                                }}
                            >
                                <TouchableOpacity>
                                    <Text
                                        style={{
                                            fontSize: 15,
                                            fontWeight: "bold",
                                            color: "#FF6B00",
                                            textAlign: "center",
                                        }}
                                        onPress={() => setModalVisible(!modalVisible)}
                                    >
                                        CERRAR
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            
        </View>
    )
}

export default function DrawerNavigation(props) {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                drawerContent={props => <MenuLateral {...props} />}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#EA0029',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
                initialRouteName="Consultas"
            >
                <Drawer.Screen name="Consultas" component={Consultas} />
                <Drawer.Screen name="Ordenes"
                    options={{
                        headerTitle: "Orden de servicio",
                        headerLeft: () => <NavigatioGotBack />,
                        headerRight: () => <NavigatioGotBack2 />,
                    }}
                    component={OdernServicio}
                />
                <Drawer.Screen name="Ticket"
                    component={TicketsOS}
                    options={{
                        headerTitle: "Ticket",
                        headerLeft: () => <NavigatioGotBack />,
                    }}
                />
                
            </Drawer.Navigator>

        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    search: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 10,
        width: "50%",
        marginRight: 20,
    },
    menu: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
    },
    header: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: '#EA0029',
        height: "20%",
        width: "100%"
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 10,
        width: "100%",
        position: "absolute",
    },
    MenuIten: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: "5%",
        width: "100%",
    },
})
