import { StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, View, Alert } from "react-native";
import Signature from 'react-native-signature-canvas';
import { AntDesign } from '@expo/vector-icons';
import { getToken } from "../service/usuario";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { os_firma } from "../utils/constantes";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ActualizarOrdenServicioFirmas, ListarFirmas, SelectOSOrdenServicioID, UpdateOSOrdenServicioID } from "../service/OS_OrdenServicio";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux"
import { useIsConnected } from 'react-native-offline';
import LoadingActi from "./LoadingActi";
import { loadingCargando } from "../redux/sincronizacion";


export default function Firmador({ onOK, datauser, setModalSignature, setUserData }) {
    const ref = useRef()
    const [listF, setListF] = useState([])
    const [OrdenServicioID, setOrdenServicioID] = useState(0)
    const [obs, setObs] = useState(false)
    const isConnected = useIsConnected()
    const [f_actual, setF_actual] = useState(0)

    const Events = useSelector(s => s.sincronizacion)
    const dispatch = useDispatch()

    const handleOK = async (signature) => {
        console.log("signature", signature)
        setUserData({
            ...datauser,
            archivo: signature,
        })
    };

    useFocusEffect(
        useCallback(() => {
            (async () => {
                let os = JSON.parse(await AsyncStorage.getItem("OS"))
                console.log("OrdenServicioID--> para firmar", os.OrdenServicioID)
                setOrdenServicioID(os.OrdenServicioID)
                let firmas = JSON.parse(await ListarFirmas(os.OrdenServicioID))
                await AsyncStorage.setItem("OS_Firmas", JSON.stringify(firmas))
                let firm = firmas.filter((item) => item.Estado == "ACTI")
                console.log("f", firm)
                setListF(firm)
                setF_actual(firm.length)
                console.log("firmas-->", firm)
            })()
        }, [])
    )

    const Grabar = async () => {
        if (datauser.Nombre == "" || datauser.Cargo == "" || datauser.Correo == "" || datauser.archivo == "") {
            console.log("Falta datos", datauser.Nombre)
            console.log("Falta datos", datauser.Cargo)
            console.log("Falta datos", datauser.Correo)
            Alert.alert("Error", "Debe llenar todos los campos")
        } else {
            const { userId } = await getToken()
            const OS_Firm = JSON.parse(await AsyncStorage.getItem("OS_Firmas"))
            os_firma.FechaCreacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}`
            os_firma.FechaModificacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}`
            os_firma.UsuarioCreacion = userId
            os_firma.UsuarioModificacion = userId
            os_firma.OrdenServicioID = OrdenServicioID
            os_firma.Correo = datauser.Correo
            os_firma.Cargo = datauser.Cargo
            os_firma.Nombre = datauser.Nombre
            os_firma.OS_OrdenServicio = null
            os_firma.Cedula = ""
            os_firma.Estado = "ACTI"
            os_firma.Ruta = null
            os_firma.Longitud = null
            os_firma.Latitud = null
            os_firma.archivo = datauser.archivo.split(",")[1]
            // os_firma.Observacion = datauser.Observacion
            OS_Firm.push(os_firma)
            console.log("OS_Firmas", OS_Firm)
            await AsyncStorage.setItem("OS_Firmas", JSON.stringify(OS_Firm))
            await ActualizarOrdenServicioFirmas(OS_Firm, OrdenServicioID)
            handleClear()
            setUserData({
                ...datauser,
                archivo: "",
                Nombre: "",
                Cargo: "",
                Correo: "",
                Observacion: "",
                FechaCreacion: "",
                FechaModificacion: "",
                UsuarioCreacion: "",
                UsuarioModificacion: "",
            })
            setListF(OS_Firm)
            setObs(OS_Firm.length > 0 ? true : false)
        }
    }

    const EliminarFirma = (item) => {
        Alert.alert("Eliminar Firma", "¿Desea eliminar la firma?", [
            {
                text: "Cancelar",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            {
                text: "OK", onPress: async () => {
                    var f = listF.map((firmas) => {
                        if (firmas.FechaCreacion == item.FechaCreacion) {
                            return {
                                ...firmas,
                                Estado: "INAC"
                            }
                        } else {
                            return firmas
                        }
                    })
                    await AsyncStorage.setItem("OS_Firmas", JSON.stringify(f))
                    let firm = f.filter((item) => item.Estado == "ACTI")
                    console.log("f", f)
                    setListF(firm)
                    setObs(firm.length > 0 ? true : false)
                    await ActualizarOrdenServicioFirmas(f, OrdenServicioID)
                }
            }
        ]);
    }

    // Called after ref.current.readSignature() reads an empty string
    const handleEmpty = () => {
        console.log("Empty");
    };

    // Called after ref.current.clearSignature()
    const handleClear = () => {
        try {
            ref.current.clearSignature();
            console.log("clear success!");
        } catch (error) {
            console.log(error);
        }
    }
    const CerrarAndActualizar = async () => {
        const OS_Firmas = JSON.parse(await AsyncStorage.getItem("OS_Firmas"))
        if (f_actual == OS_Firmas.length) {
            setModalSignature(false)
        } else {
            dispatch(loadingCargando(true))
            const rest = await SelectOSOrdenServicioID(OrdenServicioID)
            const OS_PartesRepuestos = JSON.parse(rest[0].OS_PartesRepuestos)
            const OS_CheckList = JSON.parse(rest[0].OS_CheckList)
            const OS_Tiempos = JSON.parse(rest[0].OS_Tiempos)
            const OS_Anexos = JSON.parse(rest[0].OS_Anexos)
            delete rest[0].OS_Firmas
            delete rest[0].OS_Colaboradores
            delete rest[0].OS_Encuesta
            rest[0].OS_PartesRepuestos = OS_PartesRepuestos
            rest[0].OS_CheckList = OS_CheckList
            rest[0].OS_Tiempos = OS_Tiempos
            rest[0].OS_Firmas = OS_Firmas
            rest[0].OS_FINALIZADA = ""
            rest[0].OS_ASUNTO = ""
            rest[0].OS_Anexos = OS_Anexos
            if (isConnected) {
                try {
                    const { token } = await getToken()
                    const { status } = await axios.put(
                        `https://technical.eos.med.ec/MSOrdenServicio/api/OS_OrdenServicio/${OrdenServicioID}`,
                        rest[0], {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    })
                    await UpdateOSOrdenServicioID([OrdenServicioID])
                    await AsyncStorage.setItem("OS_Firmas", JSON.stringify([]))
                    dispatch(loadingCargando(false))
                    Alert.alert("Informacion",
                        "Se ha guardado la firma exitosamente", [
                        {
                            text: "OK", onPress: () => {
                                setModalSignature(false)
                            }
                        }
                    ]);

                } catch (error) {
                    console.log("PutOS", error)
                    return false
                }
            } else {
                await ActualizarFirmaLocal(OrdenServicioID, OS_Firmas)
                dispatch(loadingCargando(false))
                await AsyncStorage.setItem("OS_Firmas", JSON.stringify([]))
                setModalSignature(false)
                Alert.alert("Informacion",
                    "Se ha guardado la firma localmente",
                    [
                        {
                            text: "OK", onPress: () => {
                                setModalSignature(false)
                            }
                        }
                    ]);
            }
        }
    }

    // Called after end of stroke
    const handleEnd = () => {
        console.log("End");
        ref.current.readSignature();
    };

    // Called after ref.current.getData()
    const handleData = (data) => {
        console.log(data);
    };

    const handleConfirm = () => {
        console.log(ref.current.getData());
        console.log("end");
        ref.current.readSignature();
    };

    const style = `
    .m-signature-pad--footer 
    .button {
        background-color: #FF6B00;
        color: white;
        border-radius: 15px;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 16px;
        width: 100%;
    }
    .save {
        display: none;
    }
    .clear {
        display: block;
        margin: 0 auto;
        width: 100%;
        text-align: center;
        margin-right: 25px;
    }
    .description {
        display: none;
    }
    body,html {
        background-color: #FFFFFF;
        margin: auto;
        width: 340px; 
        height:150px;
    }
    .m-signature-pad--body {
        border: 2px solid #FF6B00;
        background-color: #fff;
        border-radius: 8px;
        border-style: dashed;
    }
    `;

    return (
        <View style={styles.centeredView}>
            <View style={styles.circlePrimary}>
                <LoadingActi
                    loading={Events.loading}
                    size={50}
                    top={110}
                />
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={{ width: "100%", height: 100 }}>
                    <View style={styles.header}>
                        <Text style={{ fontWeight: 'bold', paddingBottom: 10 }}>Agregar firma</Text>
                        <View style={styles.headerTitle}>
                            <Text style={{ color: "#B2B2AF" }}>nombre</Text>
                            <Text style={{ color: "#B2B2AF" }}>cargo</Text>
                            <Text style={{ color: "#B2B2AF" }}>acción</Text>
                        </View>
                        <View style={styles.headreProject}>
                            <ScrollView
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                style={{ width: "100%", height: 80 }}
                            >
                                {
                                    listF.map((item, index) => {
                                        return (
                                            <View key={index} style={styles.headerTitle}>
                                                <Text>{item.Nombre}</Text>
                                                <Text>{item.Cargo}</Text>
                                                <TouchableOpacity onPress={() => { EliminarFirma(item) }}>
                                                    <AntDesign name="delete" size={24} color="red" />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })
                                }
                            </ScrollView>
                            {/* <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{`${datauser.Nombre || ''} ${datauser.Cargo || ''}`}</Text>
                            <AntDesign name="delete" size={20} color="red" onPress={handleClear} /> */}
                        </View>
                    </View>
                    <View style={{ width: "100%", height: 190 }}>
                        <Signature
                            ref={ref}
                            onEnd={handleEnd}
                            onOK={handleOK}
                            onEmpty={handleEmpty}
                            // onClear={handleClear}
                            descriptionText="Firma"
                            clearText="LIMPIAR"
                            confirmText="AGREGAR"
                            webStyle={style}
                        />
                    </View>

                    <View style={styles.Inputs}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre"
                            value={datauser.Nombre}
                            onChangeText={(text) => setUserData({ ...datauser, Nombre: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Cargo"
                            value={datauser.Cargo}
                            onChangeText={(text) => setUserData({ ...datauser, Cargo: text })}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Correo"
                            value={datauser.Correo}
                            onChangeText={(text) => setUserData({ ...datauser, Correo: text })}
                        />
                        {
                            !obs ? (
                                <TextInput
                                    style={styles.input}
                                    value={datauser.Observacion}
                                    placeholder="Observacion del Cliente"
                                    onChangeText={(text) => setUserData({ ...datauser, Observacion: text })}
                                />) : null
                        }

                    </View>
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: 'flex-end', padding: 15 }}>
                        <TouchableOpacity onPress={() => Grabar()}>
                            <Text style={{
                                color: "#FF6B00",
                                fontWeight: 'bold',
                                fontSize: 16,
                                marginLeft: 15,
                                borderWidth: 1,
                                borderColor: '#FF6B00',
                                borderRadius: 20,
                                padding: 8,
                            }}>AGREGAR FIRMA</Text>
                        </TouchableOpacity>
                        <View style={{ paddingHorizontal: 20 }} />
                        <TouchableOpacity

                            onPress={() => CerrarAndActualizar()}>
                            <Text style={{
                                color: '#B2B2AF',
                                fontWeight: 'bold',
                                fontSize: 16,
                                marginRight: 15,
                                borderWidth: 1,
                                borderColor: '#B2B2AF',
                                borderRadius: 20,
                                padding: 8,
                            }}>CERRAR</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    circlePrimary: {
        width: "90%",
        height: "95%",
        borderRadius: 5,
        backgroundColor: "#FFF",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4,
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 5,
    },
    header: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        marginBottom: 10,
        padding: 10
    },
    headerTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingBottom: 10
    },
    headreProject: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: 100,
    },
    Inputs: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: 10
    },
    input: {
        borderWidth: 0.5,
        borderColor: '#B2B2AF',
        borderRadius: 5,
        width: "100%",
        paddingHorizontal: '5%',
        padding: 10,
        marginBottom: '5%',
    },
    CargosCorreo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },
    text: {
        fontSize: 12,
        color: '#B2B2AF',
    },
    centeredView: {
        flex: 1,
        height: "auto",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        paddingVertical: 20,
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "90%",
        height: "auto",
        // maxHeight: "90%",
        overflow: "scroll"
    },
})