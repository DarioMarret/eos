import { useFocusEffect } from "@react-navigation/native";

import { useCallback, useState } from "react";
import NetInfo from '@react-native-community/netinfo';
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ticketID } from "../../utils/constantes";
import BannerTicket from "../../components/BannerTicket";
import { getOrdenServicioAnidadasTicket_id, OrdenServicioAnidadas } from "../../service/OrdenServicioAnidadas";
import db from "../../service/Database/model";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import VisualizadorPDF from "../../components/VisualizadorPDF";
import { DeleteOrdenServicioID, getRucCliente, PDFVisializar, SelectOSOrdenServicioID } from "../../service/OS_OrdenServicio";
import ModalGenerico from "../../components/ModalGenerico";
import axios from "axios";
import { getToken } from "../../service/usuario";
import { AntDesign } from "@expo/vector-icons";
import { HistorialEquipoIngeniero, isChecked, isCheckedCancelaReturn } from "../../service/historiaEquipo";
import { FinalizarOS } from "../../service/OS";
import moment from "moment";
import { GetEventosByTicket, GetEventosDelDia } from "../../service/OSevento";
import { EquipoTicket } from "../../service/equipoTicketID";
import { time, TrucateUpdate } from "../../service/CargaUtil";
import LoadingActi from "../../components/LoadingActi";


export default function TicketsOS(props) {
    const { navigation } = props
    const [eventosAnidados, seteventosAnidados] = useState([])

    const [Fini, setFini] = useState(false)

    const [loading, setLoading] = useState(false)

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
                seteventosAnidados(response.map((item) => { return { ...item, check: false } }))
            })()
        }, [])
    )

    const functionColor = (type) => {
        if (type == "PENDIENTE") {
            return "#FFFFFF"
            // return "#FFECDE"rosado
        } else if (type == "NUEVO") {
            return "#FFFFFF"
        } else if (type == "FINALIZADO") {
            return "#E2FAE0"
        } else {
            return "#FFFFFF"
        }
    }

    async function Ordene(ticket_id, OrdenServicioID, estado) {
        console.log("ticket_id", ticket_id)
        console.log("estado", estado)
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
        OSClone[0]['codOS'] = null
        await AsyncStorage.setItem("OS", JSON.stringify(OSClone[0]))
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
    }

    async function Rutes(equipo, ticket_id, OrdenServicioID, OSClone, accion) {
        setLoading(true)
        equipo[0]['isChecked'] = 'true'
        var clon;
        if (accion == "PENDIENTE" || accion == "FINALIZADO") {
            clon = await SelectOSOrdenServicioID(OrdenServicioID)
            await AsyncStorage.setItem("OS", JSON.stringify(clon[0]))
            console.log(accion, clon)
        }
        await AsyncStorage.removeItem(ticketID)
        await AsyncStorage.setItem(ticketID, JSON.stringify({
            ticket_id,
            equipo,
            OrdenServicioID: OrdenServicioID == null || OrdenServicioID == "" ? null : OrdenServicioID,
            OSClone: OSClone == null ? clon : OSClone,
            Accion: accion
        }))
        await isChecked(equipo[0].equipo_id)
        setLoading(false)
        navigation.navigate("Ordenes")
    }

    async function IngresarNuevoOsTicket() {
        setLoading(true)
        var equipo = []
        db.transaction(tx => {
            tx.executeSql(`SELECT * FROM equipoTicket where ticket_id = ?`, [eventosAnidados[0].ticket_id], (_, { rows }) => {
                db.transaction(tx => {
                    tx.executeSql(`SELECT * FROM historialEquipo where equipo_id = ?`, [rows._array[0].id_equipo], (_, { rows }) => {
                        equipo = rows._array
                    })
                })
            })
        })
        var clon = await SelectOSOrdenServicioID(eventosAnidados[0].OrdenServicioID)
        clon.OS_Anexos = []
        clon.OS_CheckList = []
        clon.OS_Colaboradores = []
        clon.OS_Encuesta = []
        clon.OS_Firmas = []
        clon.OS_PartesRepuestos = []
        clon.OrdenServicioID = 0
        clon.OS_Firmas = []
        delete clon.codOS
        await AsyncStorage.setItem("OS", JSON.stringify(clon[0]))
        await AsyncStorage.removeItem(ticketID)
        await AsyncStorage.setItem(ticketID, JSON.stringify({
            ticket_id: eventosAnidados[0].ticket_id,
            equipo,
            OrdenServicioID: eventosAnidados[0].OrdenServicioID,
            OSClone: clon,
            Accion: "NUEVO OS TICKET"
        }))
        setLoading(false)
        navigation.navigate("Ordenes")

    }
    async function ColorCheckt(itemIndex) {
        seteventosAnidados(eventosAnidados.map((item, index) => {
            if (itemIndex.OrdenServicioID == item.OrdenServicioID) {
                return {
                    ...item,
                    check: !item.check
                }
            } else {
                return {
                    ...item,
                    check: false
                }
            }
        }))
        CeckFini()
    }
    function CeckFini() {
        eventosAnidados.filter((item) => item.check == true).length > 0 ? setFini(false) : setFini(true)
    }

    async function Finalizar() {
        setLoading(true)
        var OrdenServicioID = []
        eventosAnidados.map((item, index) => {
            if (item.check == true) {
                OrdenServicioID.push(item.OrdenServicioID)
            }
        })
        const respuesta = await FinalizarOS(OrdenServicioID)
        if (respuesta == 200) {
            const re = await Sincronizar()
            if (re) {
                setFini(false)
                setLoading(false)
                navigation.navigate("Consultas")
            }
        }
    }

    async function Sincronizar() {
        return new Promise((resolve, reject) => {
            NetInfo.fetch().then(state => {
                if (state.isConnected === true) {
                    (async () => {
                        await TrucateUpdate()
                        time(1500)
                        await HistorialEquipoIngeniero()
                        await time(1000)
                        await GetEventosDelDia()
                        var ayer = moment().add(-1, 'days').format('YYYY-MM-DD');
                        var hoy = moment().format('YYYY-MM-DD');
                        var manana = moment().add(1, 'days').format('YYYY-MM-DD');
                        const ticket_id = await GetEventosByTicket(ayer, hoy, manana)
                        ticket_id.map(async (r) => {
                            await EquipoTicket(r.ticket_id)
                            await OrdenServicioAnidadas(r.evento_id)
                        })
                        resolve(true)
                    })()
                } else {
                    resolve(false)
                }
            })
        })
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
                                <LoadingActi loading={loading} />
                                <ScrollView showsVerticalScrollIndicator={false} >
                                    {
                                        eventosAnidados.map((item, index) => {
                                            console.log("item", item)
                                            return (
                                                <View key={index}
                                                    style={{ width: '100%', alignSelf: 'center', marginBottom: 10, }}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-around',
                                                            alignItems: 'center',
                                                            backgroundColor: functionColor(item.ev_estado),
                                                            width: '100%',
                                                            minHeight: 80,
                                                            paddingHorizontal: 20,
                                                            borderBottomWidth: 0.5,
                                                            borderColor: '#858583'
                                                        }}>
                                                        {
                                                            item.ev_estado == "PENDIENTE" ?
                                                                <TouchableOpacity
                                                                    onPress={() => ColorCheckt(item)}
                                                                    style={{
                                                                        flexDirection: 'column',
                                                                        justifyContent: 'center',
                                                                        alignItems: 'center',
                                                                        width: 30,
                                                                        height: 30,
                                                                        borderWidth: 2,
                                                                        borderColor: item.check ? '#188C03' : '#858583',
                                                                        borderRadius: 50,
                                                                    }}>
                                                                    <AntDesign name="check" size={24} color={item.check ? '#188C03' : '#858583'} />
                                                                </TouchableOpacity>
                                                                : null
                                                        }
                                                        <TouchableOpacity
                                                            onPress={() => Ordene(String(item.ticket_id), item.OrdenServicioID, item.ev_estado)}>
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
                                                        </TouchableOpacity>
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
                                                                {
                                                                    item.ev_estado !== "PENDIENTE" ?
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
                                                                            }} /> : null
                                                                }
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
                                                                {
                                                                    item.ev_estado !== "PENDIENTE" ?
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
                                                                            }} /> : null
                                                                }
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

                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>
                                {/* </Pressable> */}
                            </View>


                            <TouchableOpacity
                                onPress={async () => await IngresarNuevoOsTicket()}
                                style={styles.opacity}>
                                <Text style={styles.text4}>INGRESAR NUEVO OS AL TICKET</Text>
                            </TouchableOpacity>
                            {

                                Fini ?
                                    <TouchableOpacity
                                        onPress={async () => await Finalizar()}
                                        style={{ ...styles.opacity, backgroundColor: '#FFFFFF', }}>
                                        <Text style={{ ...styles.text4, color: '#FF6B00' }}>FINALIZAR OS SELECCIONADO</Text>
                                    </TouchableOpacity>
                                    : null
                            }
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
        // flex: ,
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
        minWidth: "90%",
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