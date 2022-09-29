import { useRef, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Signature from 'react-native-signature-canvas';
import { AntDesign } from '@expo/vector-icons';
import { SelectOSOrdenServicioID } from "../service/OS_OrdenServicio";
import { getToken } from "../service/usuario";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Firmador({ onOK, datauser, setModalSignature, setUserData }) {
    const ref = useRef()
    const [listF, setListF] = useState([])

    const handleOK = async (signature) => {
        console.log("signature")
        setUserData({
            ...datauser,
            archivo: signature,
        })
    };


    const Grabar = async () => {
        const { userId } = await getToken()
        const OS = await AsyncStorage.getItem("OS")
        let OS_OrdenServicioID = JSON.parse(OS)
        datauser.FechaCreacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
        datauser.FechaModificacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
        datauser.UsuarioCreacion = userId
        datauser.UsuarioModificacion = userId
        console.log("datauser", datauser)
        OS_OrdenServicioID.OS_Firmas.push(datauser)
        await AsyncStorage.setItem("OS", JSON.stringify(OS_OrdenServicioID))
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
        setListF(OS_OrdenServicioID.OS_Firmas)
        console.log("datauser", OS_OrdenServicioID.OS_Firmas.length)
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
    };

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
                                style={{ width: "100%", height: 100 }}
                            >
                                {
                                    listF.map((item, index) => {
                                        return (
                                            <View key={index} style={styles.headerTitle}>
                                                <Text>{item.Nombre}</Text>
                                                <Text>{item.Cargo}</Text>
                                                <TouchableOpacity onPress={() => { }}>
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
                        <TextInput
                            style={styles.input}
                            value={datauser.Observacion}
                            placeholder="Observacion del Cliente"
                            onChangeText={(text) => setUserData({ ...datauser, Observacion: text })}
                        />

                    </View>
                    <View style={{ width: "100%", flexDirection: "row", justifyContent: 'flex-end', padding: 15 }}>
                        <TouchableOpacity onPress={() => Grabar()}>
                            <Text style={{ color: "#FF6B00" }}>AGREDAR FIRMA</Text>
                        </TouchableOpacity>
                        <View style={{ paddingHorizontal: 20 }} />
                        <TouchableOpacity onPress={() => handleClear()}>
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
        height: "90%",
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