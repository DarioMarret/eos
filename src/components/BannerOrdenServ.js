import { StyleSheet, Text, View } from "react-native";
import { Fontisto } from '@expo/vector-icons';

export default function BannerOrderServi() {


    return (
        <>
            <View style={styles.banner}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Fontisto name="cloud-refresh" size={25} color="#FFF" />
                    <Text style={{ marginStart: 10, color: "#FFF", fontSize: 12 }}>
                        SINCRONIZANDO...
                    </Text>
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
})