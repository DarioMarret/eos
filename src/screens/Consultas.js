import { StyleSheet, Text, View } from "react-native";


export default function Consultas() {
    return (
        <View style={styles.container}>
            <Text>Consultas Screen</Text>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});