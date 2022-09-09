import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default function BannerOrderServi(props) {
    const { navigation, route, screen } = props
    const { name, params } = route
    const tab = ["1-EQUIPO", "2-CLIENTE", "3-DATOS", "4-COMPONENTES", "5-ADJUNTOS", "6-INGRESO HORAS"]

    function changeScreenSiguiente() {
        tab.includes(name) ? navigation.navigate(tab[tab.indexOf(name) + 1]) : navigation.navigate("1-EQUIPO")

    }
    function changeScreenAnterior() {
        tab.includes(name) ? navigation.navigate(tab[tab.indexOf(name) - 1]) : navigation.navigate("1-EQUIPO")
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
                                <Text style={{ color: "#FFF", fontSize: 12 }}>
                                    VOLVER
                                </Text>
                            </TouchableOpacity>
                            : null
                    }

                    <TouchableOpacity style={styles.volver} onPress={changeScreenSiguiente}>
                        <Text style={{ color: "#FFF", fontSize: 12 }}>
                            SIGUIENTE
                        </Text>
                        <AntDesign name="arrowright" size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
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
    }
})