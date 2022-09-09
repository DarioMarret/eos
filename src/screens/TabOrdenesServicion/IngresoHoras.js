import { StyleSheet, Text, View } from "react-native";
import BannerOrderServi from "../../components/BannerOrdenServ";


export default function IngresoHoras(props) {
    const { navigation } = props

    return (
        <View style={styles.container}>
            <Text>IngresoHoras Screen</Text>
            <BannerOrderServi
                {...props}
                navigation={navigation}
                screen={"6-INGRESO HORAS"}
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