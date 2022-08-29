import { useRef } from "react";
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Signature from 'react-native-signature-canvas';
import { AntDesign } from '@expo/vector-icons';


export default function Firmador({ onOK, datauser, handleCloseFirma }) {
    const ref = useRef();

    const handleOK = (signature) => {
        console.log("signature")
        console.log(signature);
        datauser.firma = signature
    };

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

    const style = `.m-signature-pad--footer 
    .button {
        background-color: #FF6B00;
        color: white;
        border-radius: 15px;
        margin-top: 10px;
        margin-bottom: 20px;
        margin-top: 20px;
        margin-left: 10px;
        margin-right: 10px;
        padding-left: 20px;
        padding-right: 20px;
        text-transform: uppercase;
    }
    .save {
        display: block;
    }
    .clear {
        display: block;
    }
    .description {
        display: none;
    }
    `;

    return (
        <View style={styles.container}>
            <View style={styles.circlePrimary}>
                <View style={styles.header}>
                    <Text style={{ fontWeight: 'bold', paddingBottom: 10 }}>Agregar firma</Text>
                    <View style={styles.headerTitle}>
                        <Text style={{ color: "#B2B2AF" }}>nombre</Text>
                        <Text style={{ color: "#B2B2AF" }}>cargo</Text>
                        <Text style={{ color: "#B2B2AF" }}>acción</Text>
                    </View>
                    <View style={styles.headreProject}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{`${datauser.NombreUsuario} ${datauser.ApellidoUsuario}`}</Text>
                        <AntDesign name="delete" size={20} color="red" onPress={handleClear} />
                    </View>
                </View>
                <Signature
                    ref={ref}
                    onEnd={handleEnd}
                    onOK={handleOK}
                    onEmpty={handleEmpty}
                    onClear={handleClear}
                    descriptionText="Firma"
                    clearText="LIMPIAR"
                    confirmText="AGREGAR"
                    webStyle={style}
                />
                <View style={styles.Inputs}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                    />
                    <View style={styles.CargosCorreo}>
                        <TextInput
                            style={{ ...styles.input, width: '47%', marginRight: 3 }}
                            placeholder="Cargo"
                        />
                        <TextInput
                            style={{ ...styles.input, width: '47%', marginLeft: 3 }}
                            placeholder="Correo"
                        />
                    </View>
                    <View style={{ ...styles.CargosCorreo, justifyContent: 'flex-end', margin: 10 }}>
                        <TouchableOpacity onPress={handleConfirm}>
                            <Text style={{ color: "#FF6B00" }}>AGREDAR FIRMA</Text>
                        </TouchableOpacity>
                        <View style={{ paddingHorizontal: 20 }} />
                        <TouchableOpacity onPress={handleCloseFirma}>
                            <Text style={{ color: "#B2B2AF" }}>CERRAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
        borderRadius: 20,
        backgroundColor: "#FFF",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4
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
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
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
        borderRadius: 10,
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
})