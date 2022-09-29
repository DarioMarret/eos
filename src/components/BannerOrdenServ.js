import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import tabNavigation from "../hook/tabNavigation";
import { getHistorialEquiposStorageChecked, HistorialEquipoIngeniero } from "../service/historiaEquipo";
import { PostOS, PutOS } from "../service/OS";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { useState } from "react"
import NetInfo from '@react-native-community/netinfo';
import { OS, OS_Anexos, OS_CheckList, OS_Firmas, OS_PartesRepuestos, OS_Tiempos, ticketID } from "../utils/constantes";
import { GetEventosByTicket, GetEventosDelDia } from "../service/OSevento";
import { time, TrucateUpdate } from "../service/CargaUtil";
import { EquipoTicket } from "../service/equipoTicketID";
import { OrdenServicioAnidadas } from "../service/OrdenServicioAnidadas";

export default function BannerOrderServi(props) {
    const { navigation, route, screen } = props
    const { name, params } = route

    const [modalVisible, setModalVisible] = useState(false);

    const { TabTitle } = tabNavigation()


    const tab = ["1-EQUIPO", "2-CLIENTE", "3-DATOS", "4-COMPONENTES", "5-ADJUNTOS", "6-INGRESO HORAS",]


    async function changeScreenSiguiente() {
        console.log("screen", name)
        console.log("existe tab", tab.indexOf(name))
        console.log("tabs", tab.length)
        let index = tab.indexOf(name)
        const check = await PasarACliente()
        console.log("check", check)
        if (check) {
            if (index <= tab.length) {
                console.log("indexOf-->", index)
                if (index < tab.length - 1) {
                    TabTitle(tab[index + 1])
                    navigation.navigate(tab[index + 1])
                }
            }
        }
    }

    function changeScreenAnterior() {
        let index = tab.indexOf(name)
        if (index >= 0 && index <= tab.length) {
            if (index > 0) {
                TabTitle(tab[index - 1])
                navigation.navigate(tab[index - 1])
            }
        }
    }

    async function PasarACliente() {
        const respuesta = await getHistorialEquiposStorageChecked()
        console.log("respuesta", respuesta)
        if (respuesta.length > 0) {
            return true
        } else {
            return false
        }
    }

    async function GUARDAR_OS() {
        setModalVisible(true)
        const os = await AsyncStorage.getItem("OS")
        var OS = JSON.parse(os)
        const itenSelect = await AsyncStorage.getItem(ticketID)
        if (itenSelect != null) {
            const item = JSON.parse(itenSelect)
            const { Accion } = item
            if (Accion == "clonar" || Accion == "OrdenSinTicket" || Accion == "NUEVO OS TICKET") {

                try {
                    OS.Fecha = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
                    OS.FechaCreacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
                    OS.FechaModificacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`

                    let P = await PostOS(OS)
                    if (P == "200") {
                        await LimpiandoDatos()
                        setModalVisible(false)
                    } else {
                        setModalVisible(false)
                        Alert.alert("Error", "No se pudo crear la orden de servicio")
                    }
                } catch (error) {
                    setModalVisible(false)
                    console.log("error", error)
                    Alert.alert("Error", "Error al crear la orden de servicio")
                }

            } else if (Accion == "PENDIENTE") {

                try {

                    OS.Fecha = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
                    OS.FechaCreacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
                    OS.FechaModificacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
                    let P = await PutOS(OS)
                    if (P == 204) {
                        await LimpiandoDatos()
                        setModalVisible(false)
                    } else {
                        setModalVisible(false)
                        Alert.alert("Error", "No se pudo actualizar la orden de servicio")
                    }
                } catch (error) {
                    setModalVisible(false)
                    console.log("error", error)
                    Alert.alert("Error", "Error al actualizar la orden de servicio")
                }

            }
   
        }
    }

    async function LimpiandoDatos() {
        await Sincronizar()
        await AsyncStorage.removeItem("OS_PartesRepuestos")
        await AsyncStorage.removeItem("OS_CheckList")
        await AsyncStorage.removeItem("OS_Tiempos")
        await AsyncStorage.removeItem("OS_Firmas")
        await AsyncStorage.removeItem("OS_Anexos")
        await AsyncStorage.removeItem("OS")
        await AsyncStorage.setItem("OS_PartesRepuestos", JSON.stringify(OS_PartesRepuestos))
        await AsyncStorage.setItem("OS_CheckList", JSON.stringify(OS_CheckList))
        await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
        await AsyncStorage.setItem("OS_Firmas", JSON.stringify(OS_Firmas))
        await AsyncStorage.setItem("OS_Anexos", JSON.stringify(OS_Anexos))
        await AsyncStorage.setItem("OS", JSON.stringify(OS))
        navigation.navigate("Consultas")
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
        <>
            <View style={styles.banner}>

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingLeft: 10,
                }}>
                    <Fontisto name="cloud-refresh" size={25} color="#FFF" />
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: name !== "1-EQUIPO" ? 'space-between' : 'flex-end',
                    alignItems: 'center',
                    width: '70%',
                }}>
                    {
                        name !== "1-EQUIPO" ?
                            <TouchableOpacity style={styles.volver} onPress={changeScreenAnterior}>
                                <AntDesign name="arrowleft" size={20} color="#FFFFFF" />
                                <Text style={{ color: "#FFF", fontSize: 12, paddingLeft: 5 }}>
                                    VOLVER
                                </Text>
                            </TouchableOpacity>
                            : null
                    }
                    {
                        name !== "6-INGRESO HORAS" ?
                            <TouchableOpacity style={styles.volver} onPress={changeScreenSiguiente}>
                                <Text style={{ color: "#FFF", fontSize: 12 }}>
                                    SIGUIENTE
                                </Text>
                                <AntDesign name="arrowright" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={{
                                ...styles.volver,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }} onPress={GUARDAR_OS}>
                                <Text style={{ color: "#FFF", fontSize: 12, paddingRight: 5 }}>
                                    GUARDAR
                                </Text>
                                <AntDesign name="save" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                    }
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => { setModalVisible(!modalVisible) }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <ActivityIndicator size={70} color="#FF6B00" />
                            <Text style={{ marginTop: 16, marginBottom: 32 }}>Guardando...</Text>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    banner: {
        width: "100%",
        height: "12%",
        backgroundColor: '#EA0029',
        position: 'relative',
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
    },
    volver: {
        flexDirection: 'row',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B00',
        padding: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 10,
        width: "80%",
        height: "20%",
        backgroundColor: "white",
        borderRadius: 3,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
})