import { Button, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GetEventos, GetEventosDelDia } from "../../service/OSevento";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Banner from "../../components/Banner";
import moment from "moment";


export default function Hoy(props) {
    const [eventos, setEventos] = useState([]);

    const { navigation } = props
    useFocusEffect(
        useCallback(() => {
            (async () => {
                var date = moment().format('YYYY-MM-DD');
                console.log(date)
                const respuesta = await GetEventos(`${date}T00:00:00`)
                setEventos(respuesta)
            })()
        }, [])
    )


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
            <View style={{...styles.flexlist, marginTop: "15%"}}>
                <SafeAreaView>
                    <FlatList
                        data={eventos}
                        renderItem={_renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </SafeAreaView>
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