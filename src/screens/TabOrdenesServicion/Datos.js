import { StyleSheet, Text, TextInput, View, Switch, ScrollView } from "react-native";
import { Picker } from '@react-native-picker/picker';
import BannerOrderServi from "../../components/BannerOrdenServ";
import { useState } from "react";


export default function Datos(props) {
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
        <View style={styles.container}>
            <ScrollView>
            <View style={styles.ContenedorCliente}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#FF6B00",
                    marginTop: "5%",
                    marginLeft: "3%",
                }}>Ingreso de datos</Text>
                <View style={styles.ContainerInputs}>
                    <View style={styles.ContainerTipoModelo}>
                        <View style={{
                            width: "49%",
                            height:60,
                            marginBottom:'6%',
                            borderWidth: 1,
                            borderColor: '#CECECA',
                            borderRadius: 10,
                        }}>
                            <Picker
                                style={styles.wFull}
                                selectedValue={selectedLanguage}
                                onValueChange={(itemValue, itemIndex) =>
                                    console.log(itemValue)
                            }>
                                <Picker.Item label="Tipo" value={true} />
                            </Picker>
                        </View>
                        <TextInput
                            style={{
                                ...styles.input,
                                width:'49%',
                            }}
                            placeholder="Cliente"
                        />
                    </View>
                    <View style={{ paddingHorizontal: 20 }} />
                    <View style={{
                        width: "100%",
                        height:60,
                        marginBottom:'6%',
                        borderWidth: 1,
                        borderColor: '#CECECA',
                        borderRadius: 10,
                    }}>
                        <Picker
                            style={{ 
                                width:'100%', 
                                height: 60,
                                borderWidth: 1, 
                                borderColor: '#CECECA',
                                padding:10,
                                
                            }}
                            selectedValue={selectedLanguage}
                            onValueChange={(itemValue, itemIndex) =>
                                console.log(itemValue)
                            }>
                            <Picker.Item label="Tipo de Incidente" value={true} />
                        </Picker>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Problema reportado:"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Sintomas:"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Diagnóstico/Resultado visita*:"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Acción inmediata"
                    />
                    <View style={{
                        width: "100%",
                        height:60,
                        marginBottom:'6%',
                        borderWidth: 1,
                        borderColor: '#CECECA',
                        borderRadius: 10,
                    }}>
                        <Picker
                            style={{ 
                                width:'100%', 
                                height: 60,
                                borderWidth: 1, 
                                borderColor: '#CECECA',
                                padding:10,
                                
                            }}
                            selectedValue={selectedLanguage}
                            onValueChange={(itemValue, itemIndex) =>
                                console.log(itemValue)
                            }>
                            <Picker.Item label="Estado de Equipo" value={true} />
                        </Picker>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="Acción inmediata"
                    />
                    <View style={{
                        ...styles.wFull,
                        width: '100%',
                        height: 'auto',
                        flexDirection:'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6%'
                    }}>
                        <View style={{
                            ...styles.wFull,
                            height: 60,
                            width:'45%',
                            flexDirection:'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{fontSize:16, marginRight: 4}}>Recordatorio</Text>
                            <Switch
                                trackColor={{ false: "#FFAF75", true: "#FFAF75"}}
                                thumbColor={isEnabled ? "#FF6B00" : "#ffffff"}
                                ios_backgroundColor="#FFAF75"
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                        </View>
                        <TextInput
                            style={{...styles.input, marginBottom: 0, width:'55%'}}
                            placeholder="Inf. adicional"
                        />
                    </View>
                    <View style={{
                        ...styles.wFull,
                        width: '100%',
                        height: 'auto',
                        flexDirection:'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6%'
                    }}>
                        <View style={{
                            ...styles.wFull,
                            height: 60,
                            width:'45%',
                            flexDirection:'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{fontSize:16, marginRight: 4}}>Incluye Upgrade:</Text>
                            <Switch
                                trackColor={{ false: "#FFAF75", true: "#FFAF75"}}
                                thumbColor={isEnabled ? "#FF6B00" : "#ffffff"}
                                ios_backgroundColor="#FFAF75"
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                        </View>
                        <TextInput
                            style={{...styles.input, marginBottom: 0, width:'55%'}}
                            placeholder="Inf. adicional"
                        />
                    </View>
                    <TextInput
                        style={{...styles.input, width:'100%'}}
                        placeholder="Inf. adicional"
                    />
                   
                    <View style={{
                        ...styles.wFull,
                        height: 60,
                        width:'100%',
                        flexDirection:'row',
                        alignItems: 'center',
                        marginBottom:'4%'
                    }}>
                        <Text style={{fontSize:16, marginRight: '5%'}}>Requiere nueva visita</Text>
                        <Switch
                            trackColor={{ false: "#FFAF75", true: "#FFAF75"}}
                            thumbColor={isEnabled ? "#FF6B00" : "#ffffff"}
                            ios_backgroundColor="#FFAF75"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                    <TextInput
                        style={{...styles.input, width:'100%'}}
                        placeholder="Release"
                    />
                    <TextInput
                        style={{...styles.input, width:'100%'}}
                        placeholder="Observación Ingeniero"
                    />
                </View>

            </View>
            </ScrollView>
            <BannerOrderServi />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    ContenedorCliente: {
        marginTop:30,
        flex: 1,
        width: "100%",
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    ContainerInputs: {
        flexDirection: "column",
        padding: 10,
        height: "auto",
        width: "100%",
    },
    
    ContainetBuscador: {
        flexDirection: 'row',
        width: '100%',
        top: "7%",
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    ContainerTipoModelo: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection:'row'
    },
    wFull:{
        width: "100%",
    },
    input: {
        borderWidth: 1,
        borderColor: '#CECECA',
        width: "auto",
        height: 60,
        borderRadius: 10,
        padding: 10,
        marginBottom: "6%"
    },
});