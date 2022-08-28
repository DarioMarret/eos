import { useRef } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import SignatureScreen from "react-native-signature-canvas";
import { AntDesign } from '@expo/vector-icons';


export default function Firmador({ text, onOK }) {
    const ref = useRef();

    const handleOK = (signature) => {
        console.log(signature);
        onOK(signature); // Callback from Component props
    };

    // Called after ref.current.readSignature() reads an empty string
    const handleEmpty = () => {
        console.log("Empty");
    };

    // Called after ref.current.clearSignature()
    const handleClear = () => {
        console.log("clear success!");
    };

    // Called after end of stroke
    const handleEnd = () => {
        ref.current.readSignature();
    };

    // Called after ref.current.getData()
    const handleData = (data) => {
        console.log(data);
    };

    const handleConfirm = () => {
        console.log("end");
        ref.current.readSignature();
    };

    const style = `.m-signature-pad--footer {display: none; margin: 0px; border-radius: 10px; padding:15px;}`;

    return (
        <View style={styles.container}>
            <View style={styles.circlePrimary}>
                <View style={styles.header}>
                    <Text style={{ fontWeight: 'bold', paddingBottom: 10 }}>Agregar firma</Text>
                    <View style={styles.headerTitle}>
                        <Text>nombre</Text>
                        <Text>cargo</Text>
                        <Text>acción</Text>
                    </View>
                    <View style={styles.headreProject}>
                        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>LUIS GUZMAN - PROJECT MANAGER</Text>
                        <AntDesign name="delete" size={20} color="red" />
                    </View>
                </View>
                <SignatureScreen
                    ref={ref} onOK={handleOK} webStyle={style}
                    style={{
                        borderRadius: 10,
                    }}
                />
                <View style={styles.Inputs}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                    />
                    <View style={styles.CargosCorreo}>
                        <TextInput
                           style={{...styles.input, width: '47%', marginRight: 3}}
                           placeholder="Cargo"
                        />
                        <TextInput
                            style={{...styles.input, width: '47%', marginLeft: 3}}
                            placeholder="Correo"
                        />
                    </View>
                </View>
            </View>
            {/* <View style={styles.row}>
                <Button title="Clear" onPress={handleClear} />
                <Button title="Confirm" onPress={handleConfirm} />
            </View> */}
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
        height: "70%",
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: "#FFF",
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
        borderColor: '#C4C4BF',
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
})