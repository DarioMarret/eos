import { StyleSheet, Text, View } from "react-native";
import Banner from "../components/Banner";


export default function OdernServicio(prop) {
    const { navigation  } = prop

    return (
        <View style={styles.container}>
            <Text>OdernServicio Screen</Text>
            <Banner
                navigation={navigation}
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