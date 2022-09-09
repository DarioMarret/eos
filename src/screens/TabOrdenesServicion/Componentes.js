import { StyleSheet, Text, View } from "react-native";
import Banner from "../../components/Banner";


export default function Componentes(props) {
    const { navigation } = props
    return (
        <View style={styles.container}>
            <Text>Componentes Screen</Text>
            <Banner
                {...props}
                navigation={navigation}
                screen={"4-COMPONENTES"}
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