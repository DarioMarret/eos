import { StyleSheet, Text, TextInput, TouchableOpacity, ScrollView, View, Alert } from "react-native";
import Signature from 'react-native-signature-canvas';
import { AntDesign } from '@expo/vector-icons';
import { getToken } from "../service/usuario";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ActualizarOrdenServicioFirmas, ConsultaOSOrdenServicioID, getRucCliente, ListarFirmas, SelectObservacionClienteID, UpdateOSOrdenServicioID } from "../service/OS_OrdenServicio";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux"
import { useIsConnected } from 'react-native-offline';
import LoadingActi from "./LoadingActi";
import { loadingCargando } from "../redux/sincronizacion";
import { actualizarDatosTool, PuTFirmaFormularioTool, resetFormMessageTool, setFirmasTool } from "../redux/formulario";
import isEmpty from "just-is-empty";
import { GetCorreos } from "../service/getCorreos";
import { ticketID } from "../utils/constantes";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Firmador({ onOK, datauser, setModalSignature, setUserData }) {
    const ref = useRef()
    const [listF, setListF] = useState([])
    const [OrdenServicioID, setOrdenServicioID] = useState(0)
    const [obs, setObs] = useState(false)
    const [correos, setCorreos] = useState([])

    const isConnected = useIsConnected()

    const Events = useSelector(s => s.sincronizacion)
    const formulario = useSelector(s => s.formulario)
    const dispatch = useDispatch()

    const handleOK = async (signature) => {
        setUserData({
            ...datauser,
            archivo: signature,
        })
    }
    const handleObservacionCliente = (value) => {
        dispatch(actualizarDatosTool({
            name: "ObservacionCliente",
            value: value
        }))
        setUserData({ ...datauser, Observacion: value })
    }
    useEffect(() => {
        (async () => {
            const itenSelect = await AsyncStorage.getItem(ticketID)
            if (itenSelect != null) {
                const item = JSON.parse(itenSelect)
                const { ClienteID } = item
                const listCorreos = await GetCorreos(ClienteID, formulario.OrdenServicioID)
                setCorreos(listCorreos)
                console.log("listCorreos-->", listCorreos)
            }else{
                const listCorreos = await GetCorreos(formulario.datos.ClienteID, formulario.OrdenServicioID)
                setCorreos(listCorreos)
                console.log("listCorreos-->", listCorreos) 
            }

            const ObservacioCliente = await SelectObservacionClienteID(formulario.OrdenServicioID)
            if (isEmpty(ObservacioCliente)) {
                setObs(false)
            } else {
                dispatch(actualizarDatosTool({
                    name: "ObservacionCliente",
                    value: ObservacioCliente
                }))
                setObs(true)
            }
            console.log("ObservacioCliente-->", ObservacioCliente)
        })()
        return () => {
            setCorreos([])
        };
    }, []);

    useFocusEffect(
        useCallback(() => {
            (async () => {
                if (typeof formulario.firmas !== "undefined") {
                    if (formulario.firmas.length > 0) {
                        setOrdenServicioID(formulario.OrdenServicioID)
                        let firmas = JSON.parse(await ListarFirmas(formulario.OrdenServicioID))
                        if (firmas.length > 0) {
                            let firm = firmas.filter((item) => item.Estado == "ACTI")
                            setListF(firm)

                        } else {
                            let firmfil = formulario.firmas.filter((item) => item.Estado == "ACTI")
                            setListF(firmfil)
                        }
                    }
                }
            })()
        }, [formulario.firmas || formulario.OrdenServicioID])
    )



    const Grabar = async () => {
        if (isEmpty(datauser.Nombre) || isEmpty(datauser.Cargo) || isEmpty(datauser.Correo) || isEmpty(datauser.archivo)) {
            console.log("Falta datos", datauser.Nombre)
            console.log("Falta datos", datauser.Cargo)
            console.log("Falta datos", datauser.Correo)
            console.log("Falta datos", datauser.archivo)
            Alert.alert("Error", "Debe llenar todos los campos")
        } else {
            const { userId } = await getToken()
            var OS_Firm = formulario.firmas
            let firmas = {
                OS_OrdenServicio: null,
                IdFirma: 0,
                OrdenServicioID: formulario.OrdenServicioID,
                Ruta: null,
                FechaCreacion: `${moment().format("YYYY-MM-DD")}T00:00:00`,
                FechaModificacion: `${moment().format("YYYY-MM-DD")}T00:00:00`,
                UsuarioCreacion: userId,
                UsuarioModificacion: userId,
                Estado: "ACTI",
                Cargo: datauser.Cargo,
                Nombre: datauser.Nombre,
                Cedula: null,
                Longitud: null,
                Latitud: null,
                Correo: datauser.Correo,
                archivo: datauser.archivo.split(",")[1]
            }
            OS_Firm = [...OS_Firm, firmas]
            setListF(OS_Firm)
            dispatch(setFirmasTool(OS_Firm))
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
                    var f = formulario.firmas.map((firmas) => {
                        if (firmas.FechaCreacion == item.FechaCreacion) {
                            return {
                                ...firmas,
                                Estado: "INAC"
                            }
                        } else {
                            return firmas
                        }
                    })
                    let firm = f.filter((item) => item.Estado == "ACTI")
                    setListF(firm)
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

    useFocusEffect(
        useCallback(() => {
            (async () => {
                if (formulario.status == 400) {
                    dispatch(resetFormMessageTool())
                    await CerrarAndActualizar()
                }
            })()
        }, [formulario.status])
    )

    const CerrarAndActualizar = async () => {
        dispatch(loadingCargando(true))
        if (isConnected) {
            try {
                const { token } = await getToken()
                console.log("rest[0] OrdenServicioID", formulario.OrdenServicioID)
                const { status } = await axios.put(
                    `https://technical.eos.med.ec/MSOrdenServicio/api/OS_OrdenServicio/${formulario.OrdenServicioID}`,
                    formulario.ordenServicio, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
                console.log("status firmas-->", status)
                await UpdateOSOrdenServicioID([OrdenServicioID])
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
                Alert.alert("Informacion",
                    "No se ha podido guardar la firma",
                    [
                        {
                            text: "OK", onPress: () => {
                                setModalSignature(false)
                                dispatch(loadingCargando(false))
                            }
                        }
                    ]);
            }
        } else {
            await ActualizarOrdenServicioFirmas(OS_Firmas, OrdenServicioID)
            // await ActualizarFirmaLocal(OrdenServicioID, OS_Firmas)
            dispatch(loadingCargando(false))
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
    const handleBuscarCorreo = () => {
        const text = datauser.Correo
        if(!isEmpty(text)){
            var cor = correos.filter(listC => listC.Correo != "" && listC.Correo != null)
            let texto = text.toLowerCase()
            let temp = cor.filter((items) => items.Correo.includes(texto))
            if(temp.length > 0){
                setUserData({
                    ...datauser,
                    Nombre: temp[0].nombre,
                    Cargo: temp[0].cargo,
                    Correo: temp[0].Correo,
                })
            }else{
                Alert.alert("Informacion", "No se ha encontrado el correo")
            }
        }else{
            Alert.alert("Informacion", "Ingrese un correo para la busqueda")
        }
        console.log("temp", datauser.Correo)
    }


    // Called after end of stroke
    const handleEnd = () => {
        console.log("End");
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
                    style={{ width: "100%" }}>
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
                                style={{ width: "100%", height: 60 }}
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
                        </View>
                    </View>
                    <View style={{ width: "100%", height: 190 }}>
                        <Signature
                            ref={ref}
                            onEnd={handleEnd}
                            onOK={handleOK}
                            onEmpty={handleEmpty}
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
                        <View style={{
                            ...styles.input,
                            borderWidth: 1,
                            borderColor: "#CECECA",
                            width: "100%",
                            height: 50,
                            borderRadius: 5,
                            padding: 5,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 20,
                        }}>
                            <TextInput
                                style={{ width: "90%", height: "100%" }}
                                placeholder="Escriba el correo"
                                value={datauser.Correo}
                                onChangeText={(text) => setUserData({ ...datauser, Correo: text })}
                            // editable={false}
                            />
                            <AntDesign
                                onPress={() => handleBuscarCorreo()}
                                name='search1'
                                size={24}
                                color='#000000'
                                style={{ 
                                    display: "flex",
                                    position: "absolute",
                                    right: 0,
                                    borderTopRightRadius: 5,
                                    borderBottomRightRadius: 5,
                                    backgroundColor: "#FF6B00",
                                    height: 50,
                                    padding: 10,
                                    borderTopEndRadius: 15,
                                }}
                            />
                        </View>
                        {/* <TextInput
                            style={styles.input}
                            placeholder="Correo"
                            value={datauser.Correo}
                            onChangeText={(text) => setUserData({ ...datauser, Correo: text })}
                        /> */}
                        {
                            !obs ? (
                                <TextInput
                                    style={styles.input}
                                    value={datauser.Observacion}
                                    placeholder="Observacion del Cliente"
                                    onChangeText={(text) => handleObservacionCliente(text)}
                                />) : null
                        }

                    </View>
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: 'space-between', padding: 15 }}>
                        <TouchableOpacity onPress={() => Grabar()}>
                            <Text style={{
                                color: "#FF6B00",
                                fontWeight: 'bold',
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: '#FF6B00',
                                borderRadius: 20,
                                padding: 8,
                            }}>AGREGAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => {
                                // CerrarAndActualizar()
                                dispatch(PuTFirmaFormularioTool())
                            }}
                        >
                            <Text style={{
                                color: '#FF6B00',
                                fontWeight: 'bold',
                                fontSize: 16,
                                borderWidth: 1,
                                borderColor: '#FF6B00',
                                borderRadius: 20,
                                padding: 8,
                            }}>GUARDAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity

                            onPress={() => setModalSignature(false)}>
                            <Text style={{
                                color: '#B2B2AF',
                                fontWeight: 'bold',
                                fontSize: 16,
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