import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Fontisto } from '@expo/vector-icons';

export default function Banner(props) {
    const { navigation } = props
    console.log("navigation", props)
    return (
        <>
            <View style={styles.circlePrimary}>
                <View style={styles.circleSecond}>
                    <View style={styles.circleTercer}>
                        <TouchableOpacity onPress={() => navigation.navigate("Ordenes")}>
                            <Text style={{ color: "#FFF", fontSize: 30 }}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.banner}>
                <Fontisto name="cloud-refresh" size={25} color="#FFF" />
                <Text style={{ marginStart: 10, color: "#FFF", fontSize: 12}}>
                    SINCRONIZANDO...
                </Text>
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
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 10,
    },
    circlePrimary: {
        width: "100%",
        height: "10%",
        // backgroundColor: '#E0E16C',
        justifyContent: 'center',
        alignItems: 'flex-end',
        position: 'absolute',
        bottom: "10%",
        left: -10,
        zIndex: 1,
    },
    circleSecond: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFF',
        marginEnd: 20,
        zIndex: 2,
        top: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        // bottom: 0,
    },
    circleTercer: {
        width: 90,
        height: 90,
        borderRadius: 50,
        backgroundColor: '#000',
        marginEnd: 20,
        zIndex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
})