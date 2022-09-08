import { Button, FlatList,Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GetEventos, GetEventosDelDia } from "../../service/OSevento";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import Banner from "../../components/Banner";
import moment from "moment";

import calreq from '../../../assets/icons/cal-req.png';
import calok from '../../../assets/icons/cal-ok.png';
import calsync from '../../../assets/icons/cal-sync.png';
import calwait from '../../../assets/icons/cal-wait.png';

export default function Hoy(props) {
    const [eventos, setEventos] = useState([]);
    const [typeCalentar, setTypeCalendar] = useState(1)
    const [bg, setBg] = useState("")
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

    const typeImage = () => {
        if(typeCalentar === 0){
            setBg("#FFECDE")
            return calreq
        }else if(typeCalentar === 1){
            setBg("#E2FAE0")
            return calok
        }else if(typeCalentar === 2){
            setBg("#EFDEE1")
            return calsync
        }else{
            setBg("#FFFFFF")
            return calwait
        }
    }


    function _renderItem({ item, index }) {
        return [
            <View>
                <TouchableOpacity>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: bg,
                        width: '100%',
                        minHeight: 100,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderBottomWidth: 0.5,
                        borderColor: '#858583'
                    }}>
                        <View>
                            <Text># ID FUTURO - DEMO / CONGRESOS</Text>
                            <Text>A & A NORDIKA S:A</Text>
                            <Text>Este evento se crear y finalizara cuando tenga conexion.</Text>
                        </View>
                        {/* <View>
                            <Text>Icono Calendario</Text>
                        </View> */}
                        <View style={styles.calendar}>
                            <Image source={typeImage()} style={{ width: 30, height: 30 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>,
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
    consult:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFECDE',
        width: '100%',
        minHeight: 100,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderColor: '#858583',
    },
    calendar:{

    },
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