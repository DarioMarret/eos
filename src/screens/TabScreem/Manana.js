import { StyleSheet, Text, View } from "react-native";
import Banner from "../../components/Banner";

export default function Manana() {
    return (
        <View style={styles.container}>
        <Text>Manana Screen</Text>
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