import { StyleSheet, Text, View } from "react-native";

export default function Ayer() {
    return (
        <View style={styles.container}>
        <Text>Ayer Screen</Text>
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
