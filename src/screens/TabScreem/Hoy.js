import { Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Banner from "../../components/Banner";


const Orden = [
    {
        "nombre": "Dario",
        "ciudad": "Salinas",
        "estado": "pendiente"
    }
]
export default function Hoy(props) {

    const { navigation } = props


    function _renderItem({ item, index }) {
        return [
            <View>
                <TouchableOpacity>
                    <View>
                        <View>
                            <Text># ID FUTURO - DEMO / CONGRESOS</Text>
                            <Text>A & A NORDIKA S:A</Text>
                            <Text>Este evento se crear y finalizara cuando tenga conexion.</Text>
                        </View>
                        <View>
                            <Text>Icono Calendario</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        ]
    }
    return (
        <View style={styles.container}>
            <View style={styles.flexlist}>
                {/* <ScrollView>
                    <FlatList
                        data={Orden}
                        renderItem={_renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </ScrollView> */}
            </View>
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
    flexlist: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});