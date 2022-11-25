import "react-native-gesture-handler";
import React, { useCallback, useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useFocusEffect, useNavigation } from "@react-navigation/native";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
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
import VisualizadorPDF from "../components/VisualizadorPDF";
import { PDFVisializar, ActualizarEstadoOS, 
    SacarDatosClienteOS, DatosOSOrdenServicioID, DatosEquipo, datosClienteOSOrdenServicioID,
 } from "../service/OS_OrdenServicio";
import { getToken } from "../service/usuario";
import ModalGenerico from "../components/ModalGenerico";
import { useDispatch } from "react-redux";
import moment from "moment";
import { getEventosByDate, listarEventoAyer, listarEventoHoy, listarEventoMnn } from "../redux/sincronizacion";
import { EditareventoLocal, FinalizarOSLocal } from "../service/ServicioLoca";
import { getIngenierosStorageById } from "../service/ingenieros";
import { ActualizaEstadoOrdenServicioAnidadas } from "../service/OrdenServicioAnidadas";



const Drawer = createDrawerNavigator();

function MenuLateral(prop) {

    const { logout } = useUser()
    const [user, setUser] = useState({
        nombre: "",
        email: "",
    });


    const handleLogout = async () => {
        await logout()
    }
    
    useFocusEffect(
        useCallback(() => {
            (async () => {
                const { userId } = await getToken()
                const { NombreUsuario } = await getIngenierosStorageById(userId)
                setUser({
                    nombre: NombreUsuario,
                    email: JSON.parse(await AsyncStorage.getItem("user:")).username
                })
            })()
        }, [])
    )

    return (
        <View style={styles.menu}>
            <View style={styles.header}>
                <Text style={{ fontWeight: "bold", fontSize: 20, color: "#FFF" }}>{ user.nombre }</Text>
                <Text style={{ fontSize: 12, color: "#FFF" }}>{ user.email }</Text>
            </View>
            <Separador />
            <TouchableOpacity style={styles.MenuIten} onPress={() => prop.navigation.navigate("Consultas")}>
                <View style={styles.item}>
                    <Text style={{ fontSize: 15, color: "#B2B2AF" }}>Inicio</Text>
                    <MaterialCommunityIcons name="home-floor-g" size={24} color="#B2B2AF" />
                </View>
            </TouchableOpacity>
            <Separador />
            <TouchableOpacity style={styles.MenuIten} onPress={handleLogout}>
                <View style={styles.item}>
                    <Text style={{ fontSize: 15, color: "#B2B2AF" }}>Cerrar Sesión</Text>
                    <MaterialCommunityIcons name="close-circle" size={24} color="#B2B2AF" />
                </View>
            </TouchableOpacity>
            <Separador />
        </View>
    )
}


///TRES PUNTOS
function MenuFinal({ setModalEmails, setModalSignature, VisualizarPdf, item }) {

    const [estado, setEstado] = useState(null)
    const [orderID, setOrderID] = useState(null)

    const navigation = useNavigation()

    const handleBack = () => {
        // navigation.navigate("Consultas")
        navigation.goBack()
    }

    const dispatch = useDispatch()

    async function Dispatcher() {
        var hoy = moment().format('YYYY-MM-DD')
        var ayer = moment().add(-1,'days').format('YYYY-MM-DD')
        var mnn = moment().add(1,'days').format('YYYY-MM-DD')
        const promisa_hoy = dispatch(getEventosByDate(`${hoy}T00:00:00`))
        promisa_hoy.then((res) => {
            if (res.payload.length > 0) {
                dispatch(listarEventoHoy(res.payload))
            }
        })
        const promisa_ayer = dispatch(getEventosByDate(`${ayer}T00:00:00`))
        promisa_ayer.then((res) => {
            if (res.payload.length > 0) {
                dispatch(listarEventoAyer(res.payload))
            }
        })
        const promisa_mnn = dispatch(getEventosByDate(`${mnn}T00:00:00`))
        promisa_mnn.then((res) => {
            if (res.payload.length > 0) {
                dispatch(listarEventoMnn(res.payload))
            }
        })
    }

    const FinalizarOS = async () => {
        console.log("FinalizarOS")
        const itenSelect = JSON.parse(await AsyncStorage.getItem(ticketID))
        const { OrdenServicioID, tck_tipoTicketCod } = itenSelect
        if (OrdenServicioID != null && OrdenServicioID != 0) {
            console.log("tck_tipoTicketCod", tck_tipoTicketCod)
            await FinalizarOSLocal([OrdenServicioID])
            await Dispatcher()
            alert("Se actualizo el estado de la OS en local hasta que se sincronice")
            handleBack()
        }
    }



    useFocusEffect(
        useCallback(() => {
            (async () => {
                const itenSelect = JSON.parse(await AsyncStorage.getItem(ticketID))
                const { OrdenServicioID, Accion } = itenSelect
                setOrderID(OrdenServicioID)
                setEstado(Accion)
            })()
        }, [])
    );

    if(estado !== "PENDIENTE"){
        return (
            <Menu>
                <MenuTrigger
                    text={<FontAwesome5 name="ellipsis-v" size={24} color="#FFFFFF" />}
                    customStyles={{
                        triggerText: {
                            fontSize: 35,
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                            padding: 15,
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
                                text='Agregar firma'
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
}

function NavigatioGotBack() {
    const navigation = useNavigation()

    const handleBack = async () => {
        // const screen = await AsyncStorage.getItem("SCREMS")
        // console.log("screen", screen)
        // navigation.navigate(screen)
        navigation.goBack()
    }

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10 }}>
            <TouchableOpacity onPress={handleBack}>
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

    const [dataCliente, setDataCliente] = useState({
        Ciudad:"",
        ClienteNombre:"",
        Direccion: ""
    });
    const [dataEquipo, setDataEquipo] = useState( {
        ModeloEquipo:0,
        Serie:"",
    },);
    const [dataOrden, setDataOrden] = useState({
        Acciones:"",
        Causas:"",
        Diagnostico:"",
        EstadoEqPrevio:"",
        EstadoEquipo:"",
        FechaSeguimiento:"",
        IncluyoUpgrade:null,
        OS_CheckList:"",
        ObservacionCheckList:"",
        ObservacionIngeniero:"",
        Sintomas:"",
        SitioTrabajo:"",
        ticket_id:"",
        tipoIncidencia:null,
        TipoVisita: "",
      },);

    const [isActivePDF, setIsActivePDF] = useState(false)

    const enviarFirma = () => {
        setModalSignature(false)
    }
    /*
    async function EnviarOS(item) {
        console.log("EnviarOS", item)

        const { ClienteID, UsuarioCreacion } = await getRucCliente(item)
        console.log("ClienteID", ClienteID)
        console.log("UsuarioCreacion", UsuarioCreacion)

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
    */


    async function VisualizarPdf(item) {
        console.log("item",item)
        const base64 = await PDFVisializar(item)
        if(base64 != null){
            setPdfurl(base64)
            setPdfview(true)
        }else{
            const cliente = await SacarDatosClienteOS(item);
            const orden = await DatosOSOrdenServicioID(item);
            const equipo = await DatosEquipo(item);
            setDataCliente(cliente)
            setDataEquipo(equipo[0])
            setDataOrden(orden[0])
            setIsActivePDF(true);
        }
    }

    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingRight: 15, width: "60%" }}>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Ionicons name="md-information-circle" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <MenuFinal setModalEmails={setModalEmails} modalSignature={modalSignature} VisualizarPdf={VisualizarPdf} setModalSignature={setModalSignature} />
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
                transparent={true}
                visible={isActivePDF}
                onRequestClose={() => {
                    setIsActivePDF(!isActivePDF);
                }}
                propagateSwipe={true}
            >
                <View style={styles.centeredView}>
                    <View style={{...styles.modalView, padding: 10}}>
                        <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={{ width: "100%" }}>
                            <View>
                                <Text style={styles.titleModal}>
                                    Datos Cliente
                                </Text>
                                <View style = {styles.lineStyle} />
                                <View style={styles.containerData}>
                                    <View style={styles.containerTexts}>
                                        <Text style={styles.subTitleModal}>
                                            Nombre: {dataCliente.ClienteNombre}
                                        </Text>
                                    </View>
                                    <View style={styles.containerTexts}>
                                        <Text style={styles.subTitleModal}>
                                            Ciudad: {dataCliente.Ciudad}
                                        </Text>
                                    </View>
                                    <View style={styles.containerTexts}>
                                        <Text style={styles.subTitleModal}>
                                            Dirección: {dataCliente.Direccion}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.titleModal}>
                                    Datos del Equipo
                                </Text>
                                <View style = {styles.lineStyle} />
                                <View style={styles.containerData}>
                                    <View style={styles.containerTexts}>
                                        <Text style={styles.subTitleModal}>
                                            Modelo: {dataEquipo.ModeloEquipo}
                                        </Text>
                                    </View>
                                    <View style={styles.containerTexts}>
                                        <Text style={styles.subTitleModal}>
                                            Serie: {dataEquipo.Serie}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.titleModal}>
                                    Datos de la Orden de Servicio
                                </Text>
                                <View style = {styles.lineStyle} />
                                <View style={styles.containerData}>
                                    <View style={styles.containerTexts}>
                                        <Text style={styles.subTitleModal}>
                                            Tipo de Orden: {dataOrden.tipoIncidencia}
                                        </Text>
                                    </View>
                                    <View style={styles.containerTexts}>
                                        <Text style={styles.subTitleModal}>
                                            Síntomas: {dataOrden.Sintomas}
                                        </Text>
                                    </View>
                                    <View style={styles.containerTexts}>
                                        <Text style={styles.subTitleModal}>
                                            Diagnóstico: {dataOrden.Diagnostico}
                                        </Text>
                                    </View>
                                    <View style={styles.containerTexts}>
                                        <Text style={styles.subTitleModal}>
                                            Acciones a tomar: {dataOrden.Acciones}
                                        </Text>
                                    </View>
                                    <View style={styles.containerTexts}>
                                        <Text style={styles.subTitleModal}>
                                            Incluyo upgrade: {dataOrden.IncluyoUpgrade!==null?dataOrden.IncluyoUpgrade:"No"}
                                        </Text>
                                    </View>
                                    <View style={styles.containerTexts}>
                                        <Text style={styles.subTitleModal}>
                                            Causas: {dataOrden.Causas}
                                        </Text>
                                    </View>
                                    <View style={styles.containerTexts}>
                                        <Text style={styles.subTitleModal}>
                                            Fecha de Seguimiento: {moment(dataOrden.FechaSeguimiento).format("DD/MM/YYYY")}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{width:80}}>
                                <TouchableOpacity
                                    onPress={() => setIsActivePDF(false)}
                                >
                                    <Text style={{
                                        color: '#FF6B00',
                                        fontWeight: 'bold',
                                        fontSize: 16,
                                        borderWidth: 1,
                                        borderColor: '#FF6B00',
                                        borderRadius: 20,
                                        padding: 8,
                                    }}>Cerrar</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
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
                                Puedes escoger entre las opciones enumeradas que están en la parte superior del formulario para ingresar
                                a la opción que desees.
                            </Text>
                            <Text>Adicional puedes navegar entre las secciones en caso que sea necesario corregirlas.</Text>
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
    centeredView: {
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width: "90%",
        height: "auto",
        backgroundColor: "white",
        borderRadius: 3,
        paddingHorizontal: 20,
        paddingVertical: 30,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    titleModal: {
        fontSize: 20,
        fontweight: "bold",
        color: "#FF6B00"
    },
    containerTexts:{ 
        alignItems: "center",
        flexDirection: "row", 
        width: "100%" 
    },
    subTitleModal:{
        fontSize: 18,
        fontWeight: "normal",
    },
    textModal: {
        fontSize: 16,
    },
    lineStyle:{
        borderWidth: 0.5,
        borderColor:'#FF6B00',
        marginBottom: 5,
    },
    containerData:{ 
        flexDirection: "column", 
        width: "100%",
        marginBottom: 20,
    },
})
