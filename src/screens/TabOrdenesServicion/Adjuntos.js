import { StyleSheet, Text, View } from "react-native";
import BannerOrderServi from "../../components/BannerOrdenServ";


export default function Adjuntos(props) {
    const { navigation } = props
    return (
        <View style={styles.container}>
            <Text>Abjuntos Screen</Text>
            <BannerOrderServi
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