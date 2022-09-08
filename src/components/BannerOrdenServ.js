import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Fontisto } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

export default function BannerOrderServi(props) {
    const { navigation, route } = props
    const { name, params } = route


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
                            <TouchableOpacity style={styles.volver}>
                                <AntDesign name="arrowleft" size={20} color="#FFFFFF" />
                                <Text style={{ color: "#FFF", fontSize: 12 }}>
                                    VOLVER
                                </Text>
                            </TouchableOpacity>
                            : null
                    }

                    <TouchableOpacity style={styles.volver}>
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