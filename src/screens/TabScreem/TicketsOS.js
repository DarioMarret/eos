import { useFocusEffect } from "@react-navigation/native";

import { useCallback, useState } from "react";

import { FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ticketID } from "../../utils/constantes";
import BannerTicket from "../../components/BannerTicket";
import { getOrdenServicioAnidadasTicket_id } from "../../service/OrdenServicioAnidadas";
import db from "../../service/Database/model";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import VisualizadorPDF from "../../components/VisualizadorPDF";
import { getRucCliente, PDFVisializar, SelectOSOrdenServicioID } from "../../service/OS_OrdenServicio";
import ModalGenerico from "../../components/ModalGenerico";
import axios from "axios";
import { getToken } from "../../service/usuario";


export default function TicketsOS(props) {
    const { navigation } = props
    const [eventosAnidados, seteventosAnidados] = useState([])

    const [listadoEmails, setlistadoEmails] = useState([])

    const [itemIndex, setItemIndex] = useState(null)
    const [idOrdenServicio, setIdOrdenServicio] = useState(null)

    const [modalVisible, setModalVisible] = useState(false);

    const [pdfview, setPdfview] = useState(true)
    const [pdfurl, setPdfurl] = useState("")

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const ticket_id = JSON.parse(await AsyncStorage.getItem(ticketID)).ticket_id
                const response = await getOrdenServicioAnidadasTicket_id(ticket_id)
                seteventosAnidados(response)
            })()
        }, [])
    )

    functionColor = (type) => {
        if (type == "PENDIENTE") {
            return "#FFECDE"
        } else if (type == "NUEVO") {
            return "#FFFFFF"
        } else if (type == "FINALIZADO") {
            return "#E2FAE0"
        } else {
            return "#FFFFFF"
        }
    }

    async function Ordene(ticket_id, OrdenServicioID, estado) {
        // console.log("ticket_id", ticket_id)
        try {
            db.transaction(tx => {
                tx.executeSql(`SELECT * FROM equipoTicket where ticket_id = ?`, [ticket_id], (_, { rows }) => {
                    db.transaction(tx => {
                        tx.executeSql(`SELECT * FROM historialEquipo where equipo_id = ?`, [rows._array[0].id_equipo], (_, { rows }) => {
                            Rutes(rows._array, ticket_id, OrdenServicioID, null, estado)
                        })
                    })
                })
            })
        } catch (error) {
            console.log("error", error)
        }
    }



    async function AgregarFirma(item) {
        console.log("AgregarFirma", item)
    }

    async function ClonarOS(ticket_id, OrdenServicioID) {
        const OSClone = await SelectOSOrdenServicioID(OrdenServicioID)
        OSClone[0]['OS_ASUNTO'] = []
        OSClone[0]['OS_FINALIZADA'] = null
        OSClone[0]['OrdenServicioID'] = null
        OSClone[0]['OS_Firmas'] = []
        OSClone[0]['OS_Anexos'] = []
        // OSClone[0]['OS_Tiempos'] = []
        OSClone[0]['codOS'] = null
        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM equipoTicket where ticket_id = ?`, [ticket_id], (_, { rows }) => {
                db.transaction(tx => {
                    tx.executeSql(`SELECT * FROM historialEquipo where equipo_id = ?`, [rows._array[0].id_equipo], (_, { rows }) => {
                        Rutes(rows._array, ticket_id, OrdenServicioID, OSClone, "clonar")
                    })
                })
            })
        })
    }

    async function EnviarOS(item) {
        const { ClienteID, UsuarioCreacion } = await getRucCliente(item)
        const { token } = await getToken()
        const { data } = await axios.get(`https://technical.eos.med.ec/MSOrdenServicio/correos?ruc=${ClienteID}&c=${UsuarioCreacion}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        console.log("data", data)
        setlistadoEmails(data)
        setIdOrdenServicio(item)
        setModalVisible(!modalVisible);
    }

    async function VisualizarPdf(item) {
        const base64 = await PDFVisializar(item)
        setPdfurl(base64)
        setPdfview(false)
        console.log("VisualizarPdf", base64)
    }

    async function Rutes(equipo, ticket_id, OrdenServicioID, OSClone, accion) {
        await AsyncStorage.removeItem(ticketID)
        await AsyncStorage.setItem(ticketID, JSON.stringify({
            ticket_id,
            equipo,
            OrdenServicioID: OrdenServicioID == null || OrdenServicioID == "" ? null : OrdenServicioID,
            OSClone: OSClone == null ? null : OSClone,
            Accion: accion
        }))
        navigation.navigate("Ordenes")
    }

    return (

        pdfview ?
            (<View style={styles.container} >
                {
                    eventosAnidados.length > 0 ?
                        <View style={styles.body}>
                            <Text style={styles.header}>{eventosAnidados[0].tck_cliente}</Text>
                            <Text style={{
                                ...styles.header,
                                fontSize: 15,
                            }}>Ticket #{eventosAnidados[0].ticket_id}</Text>
                            <View style={{ ...styles.body1 }} >
                                {/* <Pressable onPress={() => setItemIndex(null)}> */}
                                <ScrollView showsVerticalScrollIndicator={false} >
                                    {
                                        eventosAnidados.map((item, index) => {
                                            return (
                                                <View key={index}
                                                    style={{ width: '90%', alignSelf: 'center', marginBottom: 10, }}
                                                >
                                                    <TouchableOpacity
                                                        onPress={() => Ordene(String(item.ticket_id), item.OrdenServicioID, item.ev_estado)}>
                                                        <View
                                                            style={{
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center',
                                                                backgroundColor: functionColor(item.ev_estado),
                                                                width: '100%',
                                                                minHeight: 80,
                                                                paddingHorizontal: 20,
                                                                borderBottomWidth: 0.5,
                                                                borderColor: '#858583'
                                                            }}>
                                                            <View>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 12,
                                                                        color: '#858583'
                                                                    }}
                                                                >{"#" + item.ticket_id + " - " + item.tck_tipoTicket.toUpperCase()} </Text>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 16,
                                                                        fontWeight: 'bold',
                                                                    }}
                                                                >{item.tck_tipoTicket} / {item.ev_horaAsignadaDesde.substring(0, 5)}</Text>
                                                                <Text
                                                                    style={{
                                                                        fontSize: 12,
                                                                        color: '#858583'
                                                                    }}
                                                                >{item.ev_descripcion}</Text>
                                                            </View>
                                                            <Menu>
                                                                <MenuTrigger
                                                                    text='...'
                                                                    customStyles={{
                                                                        triggerText: {
                                                                            fontSize: 35,
                                                                            color: '#858583',
                                                                            fontWeight: 'bold',
                                                                            transform: [{ rotate: '90deg' }],
                                                                            padding: 10,
                                                                        },
                                                                    }} />
                                                                <MenuOptions
                                                                    customStyles={{
                                                                        optionsContainer: {
                                                                            width: 150,
                                                                            backgroundColor: '#FFFFFF',
                                                                            borderRadius: 5,
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
                                                                    <MenuOption
                                                                        onSelect={() => AgregarFirma(item.OrdenServicioID)}
                                                                        text='Agregar Firma'
                                                                        customStyles={{
                                                                            optionText: {
                                                                                fontSize: 16,
                                                                                color: '#000000',
                                                                                fontWeight: 'bold',
                                                                                paddingBottom: 10,
                                                                            },
                                                                        }} />
                                                                    <MenuOption
                                                                        onSelect={() => ClonarOS(String(item.ticket_id), item.OrdenServicioID)}
                                                                        text='Clonar OS'
                                                                        customStyles={{
                                                                            optionText: {
                                                                                fontSize: 16,
                                                                                color: '#000000',
                                                                                fontWeight: 'bold',
                                                                                paddingBottom: 10,
                                                                            },
                                                                        }} />
                                                                    <MenuOption
                                                                        onSelect={() => EnviarOS(item.OrdenServicioID)}
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
                                                                        onSelect={() => VisualizarPdf(item.OrdenServicioID)}
                                                                        text='Visializar PDF'
                                                                        customStyles={{
                                                                            optionText: {
                                                                                fontSize: 16,
                                                                                color: '#000000',
                                                                                fontWeight: 'bold',
                                                                            },
                                                                        }} />
                                                                    {/* <MenuOption disabled={true} text='Disabled' /> */}
                                                                </MenuOptions>
                                                            </Menu>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>
                                {/* </Pressable> */}
                            </View>
                            <Pressable style={styles.body3} onPress={() => setItemIndex(null)}>
                                <TouchableOpacity style={styles.opacity}>
                                    <Text style={styles.text4}>INGRESAR NUEVO OS AL TICKET</Text>
                                </TouchableOpacity>
                            </Pressable>
                        </View>
                        :
                        <View style={styles.body}>
                            <View style={styles.body1}>
                                <Text>{"TicketsOS"}</Text>
                            </View>
                            <View style={styles.body2}>
                                <Text>Este ticket no tiene OS asociadas.</Text>
                            </View>
                            <View style={styles.body3}>
                                <TouchableOpacity style={styles.opacity}>
                                    <Text style={styles.text4}>INGRESAR NUEVO OS AL TICKET</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                }
                <ModalGenerico
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    titulo={"Envio de emails"}
                    txtboton1={"Enviar email"}
                    txtboton2={"Cancelar"}
                    subtitle={"Seleccione los emails a los que desea enviar la OS"}
                    contenflex={listadoEmails}
                    setlistadoEmails={setlistadoEmails}
                    idOrdenServicio={idOrdenServicio}
                />

                <BannerTicket
                    {...props}
                    navigation={navigation}
                />
            </View>) :
            <VisualizadorPDF
                url={pdfurl}
                setPdfview={setPdfview}
                setPdfurl={setPdfurl}
            />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "#FFF",
        alignItems: "center",
    },
    body: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    body1: {
        flex: 5,
        justifyContent: "flex-start",
        alignItems: "center",
        width: "100%",
        // paddingTop: 20,
    },
    body2: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    body3: {
        flex: 2,
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
    },
    text4: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#FFF",
    },
    opacity: {
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        padding: 20,
        backgroundColor: "#FF6B00",
        borderRadius: 30,
        marginBottom: 10,
        elevation: 5,
    },
    text: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Roboto',
        marginLeft: 10
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'Roboto',
        margin: 10
    },
    boxOptions: {
        width: 'auto',
        height: 'auto',
        backgroundColor: '#ffffff',
        backgroundColor: '#ffffff',
        position: 'absolute',
        right: 50,
        top: 'auto',
        padding: 10,
        zIndex: 15,

        shadowColor: '#171717',
        shadowOffset: {
            width: 4,
            height: 4
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 5,
    },
    boxOptionsText: {
        fontsize: 18,
        padding: 5,
        zIndex: 10
    },
    modalInfo: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        minWidth: '40%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 11,
    },
    titleModalInfo: {
        fontWeight: '700',
        color: '#000000',
        fontSize: 16,
        paddingBottom: 5
    },
    textModalInfo: {
        fontSize: 16,
        color: '#666666'
    }
});