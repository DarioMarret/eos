import { Button, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Banner from "../../components/Banner";
import moment from "moment";
import { GetEventos, GetEventosDelDia } from "../../service/OSevento";
import { useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getToken } from "../../service/usuario";
import db from "../../service/Database/model";



export default function Hoy(props) {

    const { navigation } = props
    useFocusEffect(
        useCallback(() => {
            (async () => {
                var date = moment().utcOffset('+03:00').format('YYYY-MM-DD');
                console.log(date)
                const respuesta = await GetEventos("2022-09-01T00:00:00")
                console.log(respuesta)
                db.transaction((tx) => {
                    tx.executeSql(
                        'SELECT * FROM OrdenesServicio',
                        [],
                        (tx, results) => {
                            var len = results.rows.length;
                            console.log('len', len);
                            if (len > 0) {
                                var row = results.rows.item(0);
                                console.log('row', row);
                            } else {
                                console.log('No user found');
                            }
                        }
                    );
                })

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