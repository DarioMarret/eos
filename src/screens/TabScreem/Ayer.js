import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { Asset } from "expo-asset";


export default function Ayer() {
    return (
        <View style={styles.container}>
            <Text>Ayer Screen</Text>

            <View style={styles.circlePrimary}>
                <View style={styles.circleSecond}>
                    <View style={styles.circleTercer}>
                        <Text style={{color: "red"}}>+</Text>
                    </View>
                </View>
            </View>
            <View style={styles.banner}>
                {/* <ImageBackground source={{ uri: Asset.fromModule(require("../../../assets/BANNER.png")).uri }} style={styles.image}> */}
                <Text>
                    Hola
                </Text>
                {/* </ImageBackground> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    image: {
        flex: 1,
        width: '100%',
        resizeMode: "contain",
    },
    banner: {
        width: "100%",
        height: "12%",
        backgroundColor: '#EA0029',
        position: 'relative',
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
        // bottom: 0,
    },
});
