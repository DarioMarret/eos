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
import { useCallback, useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import BannerOrderServi from "../../components/BannerOrdenServ";
import * as ImageManipulator from 'expo-image-manipulator';
import { anexos, ticketID } from '../../utils/constantes';
import moment from 'moment/moment';
import { getToken } from '../../service/usuario';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setAdjuntosTool } from '../../redux/formulario';
import isEmpty from 'just-is-empty';

export default function Adjuntos(props) {
  const { navigation } = props;
  const [isEnabled, setIsEnabled] = useState(false)

  const [listAdjuntos, setListAdjuntos] = useState([])
  const [OrdenServicioID, setOrdenServicioID] = useState(0)


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

  const AdjuntoStor = useSelector(s => s.formulario)
  const dispatch = useDispatch()

  // useEffect(() => {
  //   setAdjuntos(AdjuntoStor.adjuntos)
  // }, [AdjuntoStor.adjuntos])

  const limpia = () => {
    setAdjuntos({
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
    })
  }

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({})
    const file = await ImageManipulator.manipulateAsync(result.uri, [
      { resize: { width: 800, height: 800 } },
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
      limpia()
      if (typeof AdjuntoStor.adjuntos !== "undefined") {
        if (AdjuntoStor.adjuntos.length > 0) {
          let filter = AdjuntoStor.adjuntos.filter((item) => item.Estado == "ACTI")
          setListAdjuntos(filter)
        }
      }
    }, [AdjuntoStor.adjuntos])
  )

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          const itenSelect = await AsyncStorage.getItem(ticketID)
          if (itenSelect != null) {
            const item = JSON.parse(itenSelect)
            const { Accion, OrdenServicioID } = item
            setOrdenServicioID(OrdenServicioID)
            if (Accion == "FINALIZADO") {

              setFini(false)

            } else if (Accion == "PENDIENTE") {

              setListAdjuntos([])

            } else if (Accion == "OrdenSinTicket") {

              setListAdjuntos([])

            } else if (Accion == "NUEVO OS TICKET") {

              setListAdjuntos([])

            } else if (Accion == "PROCESO") {


            } else if (Accion == "clonar") {

              setListAdjuntos([])

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
      var adjuntostore = AdjuntoStor.adjuntos
      anexos.archivo = adjuntos.archivo
      anexos.Ruta = adjuntos.Ruta
      anexos.Descripcion = adjuntos.Descripcion
      anexos.Estado = "ACTI"
      anexos.FechaCreacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
      anexos.FechaModificacion = `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
      anexos.IdAnexo = 0
      anexos.OS_OrdenServicio = null
      anexos.OrdenServicioID = OrdenServicioID
      anexos.UsuarioCreacion = userId
      anexos.UsuarioModificacion = userId
      adjuntostore = [...adjuntostore, anexos]
      let filter = adjuntostore.filter((item) => item.Estado == "ACTI")
      dispatch(setAdjuntosTool(filter))
      setListAdjuntos(filter)
      limpia()
    } else {
      Alert.alert("Error", "Debe ingresar todos los campos")
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
    var os_anexos = AdjuntoStor.adjuntos
    var p = os_anexos.map((part) => {
      if (part.FechaCreacion == item.FechaCreacion) {
        return {
          ...part,
          Estado: "INAC"
        }
      } else {
        return part
      }
    })
    let filter = p.filter((item) => item.Estado == "ACTI")
    dispatch(setAdjuntosTool(filter))
    setListAdjuntos(filter)
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
              <Text>{!isEmpty(adjuntos) ? adjuntos.name : ''}</Text>
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
        screen={"5-ADJUNTOS"}
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
