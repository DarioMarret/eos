import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { Asset } from "expo-asset";
import Banner from "../../components/Banner";


export default function Ayer() {
    return (
        <View style={styles.container}>
            <Text>Ayer Screen</Text>

            <Banner/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});
