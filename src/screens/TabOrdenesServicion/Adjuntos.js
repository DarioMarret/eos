import { StyleSheet, Text, View } from "react-native";
import Banner from "../../components/Banner";


export default function Adjuntos(props) {
    const { navigation } = props
    return (
        <View style={styles.container}>
            <Text>Abjuntos Screen</Text>
            <Banner
                {...props}
                navigation={navigation}
                screen={"5-ADJUNTOS"}
            />
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