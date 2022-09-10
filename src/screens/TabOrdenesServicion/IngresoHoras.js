import { FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal } from "react-native";
import Banner from "../../components/Banner";


export default function IngresoHoras(props) {
    const { navigation } = props
    
    return (
        <View style={styles.container}>
            <View style={styles.ContenedorCliente}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#FF6B00",
                    marginTop: "5%",
                    marginLeft: 10,
                }}>Ingreso de tiempos</Text>
                <View style={styles.ContainerInputs}>
                    <TextInput
                        style={styles.input}
                        placeholder="Cliente"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Código equipo cliente"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Dirección"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Ciudad"
                    />
                </View>

            </View>
            <Banner
            navigation={navigation}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    ContenedorCliente: {
        marginTop:30,
        flex: 1,
        width: "100%",
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    ContainerInputs: {
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: 10,   
        height: "20%",
        width: "100%",
    },
    input: {
        borderWidth: 1,
        borderColor: '#CECECA',
        width: "100%",
        height: 60,
        borderRadius: 10,
        padding: 10,
        marginBottom: "5%"
    },
});