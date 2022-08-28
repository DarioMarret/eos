import { StyleSheet, Text, View } from "react-native";

export default function Manana() {
    return (
        <View style={styles.container}>
        <Text>Manana Screen</Text>
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