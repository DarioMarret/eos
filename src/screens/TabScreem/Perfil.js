import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { getInfoUserLocal } from "../../service/usuario";
import { Picker } from '@react-native-picker/picker';
import BannerFooter from "../../components/BannerFooter";
import Firmador from "../../components/Firmador";

export default function Perfil() {
    const [datauser, setDatauser] = useState(null)
    const [signt, setsignt] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState();

    useFocusEffect(
        useCallback(() => {
            (async () => {
                console.log("console", await getInfoUserLocal())
                setDatauser(await getInfoUserLocal())
            })();
        }, [])
    );
    const handleCloseFirma = () => {
        setsignt(!signt)
    }
    return (

        !signt ?
            <View style={styles.container}>
                <ScrollView style={{ width: "100%", paddingHorizontal: 10 }}>
                    {datauser ?
                        <View style={styles.form}>
                            <View style={styles.formItem}>
                                <Text>Nombre:</Text>
                                <TextInput
                                    value={datauser.NombreUsuario}
                                    onChangeText={(text) => setDatauser({ ...datauser, NombreUsuario: text })}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.formItem}>
                                <Text>Apellido:</Text>
                                <TextInput
                                    value={datauser.ApellidoUsuario}
                                    onChangeText={(text) => setDatauser({ ...datauser, ApellidoUsuario: text })}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.formItem}>
                                <Text>Correo:</Text>
                                <TextInput
                                    value={datauser.Mail}
                                    onChangeText={(text) => setDatauser({ ...datauser, Mail: text })}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.formItem}>
                                <Text>Estado:</Text>
                                <Picker
                                    style={{ ...styles.input, borderWidth: 1, borderColor: '#CECECA' }}
                                    selectedValue={selectedLanguage}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setDatauser({ ...datauser, Estado: itemValue })
                                    }>
                                    {
                                        datauser.Estado === true ? (
                                            <Picker.Item label="Activo" value={true} />
                                        ) : (
                                            <Picker.Item label="Desabilitado" value={false} />
                                        )
                                    }
                                </Picker>
                            </View>
                            <View style={styles.formItem}>
                                <Text>Auxiliar:</Text>
                                <TextInput
                                    value={datauser.Auxiliar_1}
                                    onChangeText={(text) => setDatauser({ ...datauser, Auxiliar_1: text })}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.formItem}>
                                <Text>Auxiliar:</Text>
                                <TextInput
                                    value={datauser.Auxiliar_1}
                                    onChangeText={(text) => setDatauser({ ...datauser, Auxiliar_1: text })}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.formItem}>
                                <Text>Usuario:</Text>
                                <TextInput
                                    value={datauser.username}
                                    onChangeText={(text) => setDatauser({ ...datauser, username: text })}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.formItem}>
                                <Text>Contraseña:</Text>
                                <TextInput
                                    value={datauser.password}
                                    onChangeText={(text) => setDatauser({ ...datauser, password: text })}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.formItem}>
                                <Text>Auxiliar:</Text>
                                <TextInput
                                    value={datauser.cedula}
                                    onChangeText={(text) => setDatauser({ ...datauser, cedula: text })}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.formItem}>
                                <Text>Firma:</Text>
                                {
                                    datauser.firma === null ? (
                                        <TouchableOpacity style={styles.firma} onPress={handleCloseFirma}>
                                            <Text>AGREDAR FIRMA</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={styles.firma} onPress={handleCloseFirma}>
                                            <Text>CAMBIAR FIRMA</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                            {/* <Separador/> */}
                        </View>
                        : null
                    }

                </ScrollView>
                <BannerFooter
                    datauser={datauser}
                />
            </View>
            :
            <>
                <Firmador
                    handleCloseFirma={handleCloseFirma}
                    datauser={datauser}
                />
                <BannerFooter
                    datauser={datauser}
                />
            </>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    flexlist: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        width: '99%',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    formItem: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    firma: {
        width: '100%',
        height: 40,
        backgroundColor: '#FF6B00',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});