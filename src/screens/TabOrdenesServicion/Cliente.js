import { StyleSheet, Text, TextInput, View } from "react-native";
import Banner from "../../components/Banner";
import BannerOrderServi from "../../components/BannerOrdenServ";


export default function Cliente(props) {
    const { navigation } = props
    return (
        <View style={styles.container}>
            <View style={styles.ContenedorCliente}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#FF6B00",
                    marginTop: "5%",
                    marginLeft: "5%",
                }}>Datos del Cliente</Text>
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
            <BannerOrderServi />
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
        flex: 1,
        top: "5%",
        width: "100%",
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#E5E5E5',
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