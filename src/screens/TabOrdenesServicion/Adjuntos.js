import {
  ScrollView,
  StyleSheet,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
  Button,
} from "react-native";
import { useState } from "react";
import Banner from "../../components/Banner";
import { AntDesign } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

export default function Adjuntos(props) {
  const { navigation } = props;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    console.log(result.uri);
    console.log(result);
  };

  return (
    <View style={styles.container}>
      <View style={styles.ContenedorCliente}>
        <View style={styles.formContent}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#FF6B00",
              marginTop: "5%",
              marginLeft: 10,
              marginBottom: 10,
            }}
          >
            Agregar Adjuntos
          </Text>
          <View style={styles.btnDoc}>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                padding: 15,
                width: "100%",
              }}
              onPress={pickDocument}
            >
              <AntDesign name='paperclip' size={24} color='#EA0029' />
              <Text style={{ ...styles.textInfo, color: "#EA0029" }}>
                Seleccionar archivo
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput style={styles.input} placeholder='Descripción' />
          <View
            style={{
              ...styles.wFull,
              height: 60,
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              // paddingLeft: '5%'
            }}
          >
            <Text style={{ fontSize: 16, marginRight: 4 }}>
              Orden de servicio física firmada
            </Text>
            <Switch
              trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
              thumbColor={isEnabled ? "#FF6B00" : "#ffffff"}
              ios_backgroundColor='#FFAF75'
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => console.log("Crear componente")}
          >
            <Text
              style={{
                fontSize: 18,
                color: "#FFF",
                fontFamily: "Roboto",
                marginLeft: 10,
              }}
            >
              Aceptar
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.listContainer}>
          <View style={styles.fileinfo}>
            <View>
              <Text style={styles.textInfo}>OS física : off</Text>
              <Text style={{ ...styles.textInfo, color: "#000000" }}>
                nombre del archivo.jpg
              </Text>
              <Text style={styles.textInfo}>descripcion del archivo</Text>
            </View>
            <AntDesign
              style={{ marginRight: 10 }}
              name='delete'
              size={24}
              color='#EA0029'
            />
          </View>
        </ScrollView>
      </View>
      <Banner navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  ContenedorCliente: {
    marginTop: 30,
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
  },
  listContainer: {
    width: "100%",
    height: "100%",
    paddingTop: 10,
  },
  fileinfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: "#CECECA",
    width: "100%",
  },
  textInfo: {
    fontSize: 16,
    color: "#666666",
    fontFamily: "Roboto",
    marginLeft: 10,
    textTransform: "uppercase",
  },
  btnDoc: {
    width: "100%",
    borderWidth: 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 100,
    borderStyle: "dotted",
    borderColor: "#EA0029",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
    marginTop: 10,
    marginBottom: 30,
  },
  formContent: {
    width: "100%",
    height: "auto",
    padding: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 5,
  },
  ContainerInputs: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
    height: "20%",
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CECECA",
    width: "100%",
    height: 60,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  wFull: {
    width: "100%",
  },
  btn: {
    width: "100%",
    flexDirection: "row",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B00",
    marginTop: 10,
    padding: 15,
  },
});
