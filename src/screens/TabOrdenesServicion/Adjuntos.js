import * as FileSystem from 'expo-file-system';
import {
  ScrollView,
  StyleSheet,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
  Alert
} from "react-native";
import { useCallback, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import BannerOrderServi from "../../components/BannerOrdenServ";
import * as ImageManipulator from 'expo-image-manipulator';
import { anexos, ticketID } from '../../utils/constantes';
import moment from 'moment/moment';
import { getToken } from '../../service/usuario';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { ESTADO } from '../../service/OS';

export default function Adjuntos(props) {
  const { navigation } = props;
  const [isEnabled, setIsEnabled] = useState(false)

  const [listAdjuntos, setListAdjuntos] = useState([])

  const [fini, setFini] = useState(true)

  const [adjuntos, setAdjuntos] = useState({
    OS_OrdenServicio: null,
    IdAnexo: null,
    OrdenServicioID: null,
    Ruta: null,
    FechaCreacion: null,
    UsuarioCreacion: null,
    FechaModificacion: null,
    UsuarioModificacion: null,
    Estado: null,
    Descripcion: null,
    esOSFisica: false,
    archivo: null,
  });

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState)

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({})
    const file = await ImageManipulator.manipulateAsync(result.uri, [
      // { resize: { width: 1000, height: 800 } },
    ], { format: ImageManipulator.SaveFormat.JPEG });
    FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64
    }).then((res) => {
      setAdjuntos({
        ...adjuntos,
        archivo: res,
        Ruta: result.name,
      })
    })
  }

  useFocusEffect(
    useCallback(() => {
      (async () => {

        try {
          const itenSelect = await AsyncStorage.getItem(ticketID)
          if (itenSelect != null) {
            const item = JSON.parse(itenSelect)
            const { OSClone, Accion } = item
            // console.log("OSClone", OSClone)
            if (Accion == "FINALIZADO") {

              console.log("Accion", Accion)
              setFini(false)
              const OS_Anexos = JSON.parse(await AsyncStorage.getItem("OS_Anexos"))
              setListAdjuntos(OS_Anexos)


            } else if (Accion == "PENDIENTE") {

              console.log("PENDIENTE")
              const OS_Anexos = JSON.parse(await AsyncStorage.getItem("OS_Anexos"))
              setListAdjuntos(OS_Anexos)

            } else if (Accion == "OrdenSinTicket") {

              const OS_Anexos = JSON.parse(await AsyncStorage.getItem("OS_Anexos"))
              setListAdjuntos(OS_Anexos)

            } else if (Accion == "NUEVO OS TICKET") {

              const OS_Anexos = JSON.parse(await AsyncStorage.getItem("OS_Anexos"))
              setListAdjuntos(OS_Anexos)

            }
          }
        } catch (error) {
          console.log("error", error)
        }
      })()
    }, [])
  )

  const saveAdjunto = async () => {
    const { userId } = await getToken()
    if (adjuntos.Ruta != null && adjuntos.archivo != null && adjuntos.Descripcion != null) {
      const itenSelect = await AsyncStorage.getItem(ticketID)
      if (itenSelect != null) {
        const item = JSON.parse(itenSelect)
        const { Accion } = item

        const os = await AsyncStorage.getItem("OS_Anexos")
        var OS_Anexos = JSON.parse(os)

        anexos.archivo = adjuntos.archivo
        anexos.Ruta = adjuntos.Ruta
        anexos.Descripcion = adjuntos.Descripcion
        anexos.Estado = ESTADO(Accion)
        anexos.FechaCreacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
        anexos.FechaModificacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
        anexos.IdAnexo = 0
        anexos.OS_OrdenServicio = null
        anexos.OrdenServicioID = 0
        anexos.UsuarioCreacion = userId
        anexos.UsuarioModificacion = userId
        OS_Anexos.push(anexos)
        setListAdjuntos(OS_Anexos)
        await AsyncStorage.setItem("OS_Anexos", JSON.stringify(OS_Anexos))
      }
    }
  }

  const EliminadrComponenteAgregado = (item) => {
    Alert.alert(
      "Eliminar",
      "¿Está seguro de eliminar el adjunto?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => EliminAdjunto(item) }
      ],
      { cancelable: false }
    )
  }

  const EliminAdjunto = async (item) => {
    const os_anexos = await AsyncStorage.getItem("OS_Anexos")
    const anexosArray = JSON.parse(os_anexos)
    const index = anexosArray.indexOf(item)
    anexosArray.splice(index, 1)
    setListAdjuntos(anexosArray)
    await AsyncStorage.setItem("OS_Anexos", JSON.stringify(anexosArray))
  }
  function AlertFini() {
    Alert.alert(
      "Error",
      "No se puede agregar adjuntos, la orden de servicio ya fue finalizada",
    )
  }
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

          <TextInput
            style={styles.input}
            placeholder='Descripción'
            onChangeText={(text) => setAdjuntos({ ...adjuntos, Descripcion: text })}
          />
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
          {
            fini ?
              <TouchableOpacity
                style={styles.btn}
                onPress={saveAdjunto}
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
              :
              <TouchableOpacity
                style={styles.btn}
                onPress={AlertFini}
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
          }
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.listContainer}>
          {
            listAdjuntos.map((item, index) => {
              return (
                <View style={styles.fileinfo} key={index}>
                  <View style={{ width: "85%" }}>
                    <Text style={styles.textInfo}>OS física : off</Text>
                    <Text style={{ ...styles.textInfo, color: "#000000" }}>
                      {item.Ruta}
                    </Text>
                    <Text style={styles.textInfo}>{item.Descripcion}</Text>
                  </View>
                  <AntDesign
                    style={{ marginRight: 10 }}
                    name='delete'
                    size={24}
                    color='#EA0029'
                    onPress={() => EliminadrComponenteAgregado(item)}
                  />
                </View>
              )
            })
          }
        </ScrollView>
      </View>
      <BannerOrderServi
        {...props}
        navigation={navigation}
        screen={"|"}
      />
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
