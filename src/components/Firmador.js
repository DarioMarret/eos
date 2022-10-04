import { StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, View, Alert } from "react-native";
import Signature from 'react-native-signature-canvas';
import { AntDesign } from '@expo/vector-icons';
import { getToken } from "../service/usuario";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { os_firma } from "../utils/constantes";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ActualizarOrdenServicioFirmas, ListarFirmas, SelectOSOrdenServicioID } from "../service/OS_OrdenServicio";
import axios from "axios";


export default function Firmador({ onOK, datauser, setModalSignature, setUserData }) {
    const ref = useRef()
    const [listF, setListF] = useState([])
    const [OrdenServicioID, setOrdenServicioID] = useState(0)
    const [obs, setObs] = useState(false)

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
            //os_firma.archivo = datauser.archivo.split("data:image/png;base64,")[1]
            os_firma.archivo = "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"
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
        const rest = await SelectOSOrdenServicioID(OrdenServicioID)
        const OS_PartesRepuestos = JSON.parse(rest[0].OS_PartesRepuestos)
        const OS_CheckList = JSON.parse(rest[0].OS_CheckList)
        const OS_Tiempos = JSON.parse(rest[0].OS_Tiempos)
        const OS_Anexos = JSON.parse(rest[0].OS_Anexos)
        const OS_Firmas = JSON.parse(await AsyncStorage.getItem("OS_Firmas"))
        rest[0].OS_Firmas = OS_Firmas
        rest[0].OS_PartesRepuestos = OS_PartesRepuestos
        rest[0].OS_CheckList = OS_CheckList
        rest[0].OS_Tiempos = OS_Tiempos
        delete rest[0].OS_Anexos //= OS_Anexos
        rest[0].OS_ASUNTO = ""
        rest[0].OS_FINALIZADA = ""
        console.log("rest", rest)
        try {
            const { token } = await getToken()
            const { data, status } = await axios.put(
                `https://technical.eos.med.ec/MSOrdenServicio/api/OS_OrdenServicio/${OrdenServicioID}`,
                rest[0], {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log("PutOS", data)
            console.log("PutOS Status", status)
            await AsyncStorage.setItem("OS_Firmas", JSON.stringify([]))
            setModalSignature(false)
            return status
        } catch (error) {
            console.log("PutOS", error)
            return false
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
                            <Text style={{ color: "#FF6B00" }}>AGREGAR FIRMA</Text>
                        </TouchableOpacity>
                        <View style={{ paddingHorizontal: 20 }} />
                        <TouchableOpacity onPress={() => CerrarAndActualizar()}>
                            <Text style={{ color: "#B2B2AF" }}>CERRAR</Text>
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