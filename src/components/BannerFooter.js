import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Fontisto } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

export default function BannerFooter({ datauser }) {

    const hanbleInfoUser = () => {
        console.log(datauser)
    }

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
                <TouchableOpacity style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#FF6B00",
                    borderRadius: 15,
                    padding: 5,
                    paddingHorizontal: 20,
                }}
                onPress={hanbleInfoUser}>
                    <Text style={{ marginEnd: 10, color: "#FFF", fontSize: 16 }}>
                        GUARDAR
                    </Text>
                    <FontAwesome5 name="save" size={24} color="#FFF" />
                </TouchableOpacity>
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