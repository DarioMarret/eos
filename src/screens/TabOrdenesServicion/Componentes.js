import { StyleSheet, Text, TextInput, View, Switch, ScrollView, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from "react";
import Banner from "../../components/Banner";


export default function Componentes(props) {
    const [selectComponent, setSelectedLanguage] = useState();
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const { navigation } = props
    return (
        <View style={styles.container}>
            <View style={styles.ContenedorCliente}>
                <Text style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "#FF6B00",
                    marginTop: "5%",
                }}>Agregar componentes</Text>
                <View style={{
                    width: "100%",
                    height:60,
                    marginTop:'3%',
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
                        selectedValue={selectComponent}
                        onValueChange={(itemValue, itemIndex) =>
                            console.log(itemValue)
                        }>
                        <Picker.Item label="Tipo de Incidente" value={true} />
                    </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Descripción:"
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
                    <TextInput
                        style={{...styles.input, marginBottom: 0, width:'40%'}}
                        placeholder="Cantidad:"
                    />
                    <View style={{
                        ...styles.wFull,
                        height: 60,
                        width:'50%',
                        flexDirection:'row',
                        alignItems: 'center',
                    }}>
                        <Text style={{fontSize:16, marginRight: 4}}>Garantía</Text>
                        <Switch
                            trackColor={{ false: "#FFAF75", true: "#FFAF75"}}
                            thumbColor={isEnabled ? "#FF6B00" : "#ffffff"}
                            ios_backgroundColor="#FFAF75"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
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
                        width:'50%',
                        flexDirection:'row',
                        alignItems: 'center',
                        paddingLeft: '5%'
                    }}>
                        <Text style={{fontSize:16, marginRight: 4}}>DOA:</Text>
                        <Switch
                            trackColor={{ false: "#FFAF75", true: "#FFAF75"}}
                            thumbColor={isEnabled ? "#FF6B00" : "#ffffff"}
                            ios_backgroundColor="#FFAF75"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                    <View style={{
                        ...styles.wFull,
                        height: 60,
                        width:'50%',
                        flexDirection:'row',
                        alignItems: 'center',
                    }}>
                        <Text style={{fontSize:16, marginRight: 4}}>Exchange</Text>
                        <Switch
                            trackColor={{ false: "#FFAF75", true: "#FFAF75"}}
                            thumbColor={isEnabled ? "#FF6B00" : "#ffffff"}
                            ios_backgroundColor="#FFAF75"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Numero de parte:"
                />
                <View style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    height: "15%",
                    width: "100%",
                    backgroundColor: "#FFFFFF"
                }}>
                    <TouchableOpacity style={styles.btn} onPress={() => console.log("Crear componente")}>
                        <AntDesign name="plus" size={24} color="#FFF" />
                        <Text style={{
                            fontSize: 18,
                            color: '#FFF',
                            fontFamily: 'Roboto',
                            marginLeft: 10
                        }}>AGREGAR COMPONENTE</Text>
                    </TouchableOpacity>
                </View>
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
    ContenedorCliente: {
        marginTop:30,
        flex: 1,
        width: "100%",
        backgroundColor: '#FFFFFF',
        padding: 20,
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
    btn: {
        width: '100%',
        flexDirection: 'row',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF6B00',
        padding: 15,
    },
});