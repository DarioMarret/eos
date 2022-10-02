import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
  Switch,
  Alert,
} from "react-native";
import Banner from "../../components/Banner";
import { AntDesign } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import Moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import BannerOrderServi from "../../components/BannerOrdenServ";
import { ticketID, timpo } from "../../utils/constantes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { TiempoOSOrdenServicioID } from "../../service/OS_OrdenServicio";
import LoadingActi from "../../components/LoadingActi";



export default function IngresoHoras(props) {
  const { navigation } = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [loading, setLoading] = useState(false)

  const [fini, setFini] = useState(true);

  const [tiempoOS, setTiempoOS] = useState("")

  const showDatePicker = (name) => {
    setTiempoOS(name);
    setDatePickerVisibility(true);
  };

  //parala fecha
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = async (date) => {
    let fec = new Date()
    setFechas({
      ...fechas,
      Fecha: fec,
      FechaMostrar: Moment(date).format("DD/MM/YYYY"),
    })
    var os = await AsyncStorage.getItem("OS_Tiempos")
    let OS_Tiempos = JSON.parse(os)
    if (OS_Tiempos.length > 0) {
      OS_Tiempos[0].Fecha = `${Moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
      await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
    } else {
      OS_Tiempos = [timpo]
      OS_Tiempos[0].Fecha = `${Moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`
      await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
    }
    hideDatePicker();
  };
  //fin

  const showTimePicker = (name) => {
    setTiempoOS(name);
    setTimePickerVisibility(true);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirmTime = async (time) => {
    var os = await AsyncStorage.getItem("OS_Tiempos")
    let OS_Tiempos = JSON.parse(os)
    if (OS_Tiempos.length > 0) {
      OS_Tiempos[0][tiempoOS] = Moment(time).format("HH:mm")
      await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
      setFechas({ ...fechas, [tiempoOS]: Moment(time).format("HH:mm DD/MM/YYYY") })
      console.log("s", OS_Tiempos)
      hideTimePicker()
    } else {
      OS_Tiempos = [timpo]
      OS_Tiempos[0][tiempoOS] = Moment(time).format("HH:mm")
      await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
      setFechas({ ...fechas, [tiempoOS]: Moment(time).format("HH:mm DD/MM/YYYY") })
      console.log("e", OS_Tiempos)
      hideTimePicker()
    }
    console.log("tiempoOS", OS_Tiempos.length)
    console.log("tiempoOS", JSON.parse(await AsyncStorage.getItem("OS")))
  }

  const handeldeffTime = async () => {
    var os = await AsyncStorage.getItem("OS_Tiempos")
    let OS_Tiempos = JSON.parse(os)
    if (OS_Tiempos.length > 0) {
      OS_Tiempos[0][tiempoOS] = ""
      await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
      setFechas({ ...fechas, [tiempoOS]: "" })
      hideTimePicker()
    } else {
      OS_Tiempos = [timpo]
      OS_Tiempos[0][tiempoOS] = ""
      await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
      setFechas({ ...fechas, [tiempoOS]: "" })
      hideTimePicker()
      onsole.log("OrdenSinTicket-->", JSON.parse(await AsyncStorage.getItem("OS")))
    }
  }

  const [fechas, setFechas] = useState({
    Fecha: "", //fecha de ingreso
    HoraSalidaOrigen: "",//salida origen
    HoraLlegadaCliente: "",//arribo cliente
    HoraInicioTrabajo: "",
    HoraFinTrabajo: "",
    HoraSalidaCliente: "",
    TiempoEspera: 0,
    TiempoTrabajo: 0,
    TiempoViaje: 0,
    FechaMostrar: "",
    HoraLlegadaSgteDestino: "",
    TiempoViajeSalida: 0,
    switch: false,
  })


  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true)
        const itenSelect = await AsyncStorage.getItem(ticketID)
        if (itenSelect != null) {
          const item = JSON.parse(itenSelect)
          const { Accion } = item
          const OS_Tiempos = JSON.parse(await AsyncStorage.getItem("OS_Tiempos"))
          if (OS_Tiempos.length == 0) OS_Tiempos.push(timpo)
          console.log("OS_Tiempo", OS_Tiempos)
          if (Accion == "OrdenSinTicket") {

            console.log("OrdenSinTicket")
            console.log("OrdenSinTicket-->", JSON.parse(await AsyncStorage.getItem("OS")))

          } else if (Accion == "clonar") {

            OS_Tiempos[0].Fecha == null ? `${Moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z` : OS_Tiempos[0].Fecha
            await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
            setFechas({
              ...fechas,
              ...OS_Tiempos[0],
              FechaMostrar: Moment().format('DD/MM/YYYY'),
            })

          } else if (Accion == "FINALIZADO") {

            console.log("FINALIZADO")
            setFini(false)
            setFechas({
              ...fechas,
              ...OS_Tiempos[0],
              FechaMostrar: Moment().format('DD/MM/YYYY'),
            })

          } else if (Accion == "PENDIENTE") {

            console.log("PENDIENTE")

            OS_Tiempos[0].Fecha == null ? `${Moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z` : OS_Tiempos[0].Fecha
            await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
            setFechas({
              ...fechas,
              ...OS_Tiempos[0],
              FechaMostrar: Moment().format('DD/MM/YYYY'),
            })


          } else if (Accion == "NUEVO OS TICKET") {
            console.log("NUEVO OS TICKET")
            OS_Tiempos[0].Fecha == null ? `${Moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z` : OS_Tiempos[0].Fecha
            await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
            setFechas({
              ...fechas,
              ...OS_Tiempos[0],
              FechaMostrar: Moment().format('DD/MM/YYYY'),
            })

          }else if (Accion == "PROCESO") {
            console.log("PROCESO")
            OS_Tiempos[0].Fecha == null ? `${Moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z` : OS_Tiempos[0].Fecha
            await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
            setFechas({
              ...fechas,
              ...OS_Tiempos[0],
              FechaMostrar: Moment().format('DD/MM/YYYY'),
            })

            // console.log("FIRMADOR--->",await AsyncStorage.getItem("FIRMADOR"))
          }
        }
        setLoading(false)
      })()
    }, [])
  )

  return (
    <View style={styles.container}>
      <View style={styles.ContenedorCliente}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#FF6B00",
            marginTop: "5%",
            marginLeft: 10,
          }}
        >
          Ingreso de tiempos
        </Text>
        <ScrollView showsVerticalScrollIndicator={false} >
          <View style={styles.ContainerInputs}>
            <LoadingActi loading={loading} />
            <Text>Fecha</Text>
            <TouchableOpacity
              onPress={() => showDatePicker('dateInit')}
              style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%", color: '#000000' }}
                placeholder='Fecha de Ingreso'
                value={fechas.FechaMostrar}
                editable={false}
              />
              <AntDesign
                name='calendar'
                size={24}
                color='#000000'
              />
            </TouchableOpacity>
            <Text>Salida Origen</Text>
            <TouchableOpacity
              onPress={() => showTimePicker('HoraSalidaOrigen')}
              style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%", color: '#000000' }}
                placeholder='Salida origen'
                value={fechas.HoraSalidaOrigen}
                editable={false}
              />
              <AntDesign
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </TouchableOpacity>
            <Text>Arribo Cliente</Text>
            <TouchableOpacity
              onPress={() => showTimePicker('HoraLlegadaCliente')}
              style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%", color: '#000000' }}
                placeholder='Arribo cliente'
                value={fechas.HoraLlegadaCliente}
                editable={false}
              />
              <AntDesign
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </TouchableOpacity>
            <Text>Inicio trabajo</Text>
            <TouchableOpacity
              onPress={() => showTimePicker('HoraInicioTrabajo')}
              style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%", color: '#000000' }}
                placeholder='Inicio trabajo'
                value={fechas.HoraInicioTrabajo}
                editable={false}
              />
              <AntDesign
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </TouchableOpacity>
            <Text>Fin trabajo</Text>
            <TouchableOpacity
              onPress={() => showTimePicker('HoraFinTrabajo')}
              style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%", color: '#000000' }}
                placeholder='Fin trabajo'
                value={fechas.HoraFinTrabajo}
                editable={false}
              />
              <AntDesign
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </TouchableOpacity>
            <Text>Salida cliente</Text>
            <TouchableOpacity
              onPress={() => showTimePicker('HoraSalidaCliente')}
              style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%", color: '#000000' }}
                placeholder='Salida cliente'
                value={fechas.HoraSalidaCliente}
                editable={false}
              />
              <AntDesign
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </TouchableOpacity>
            <Text>Hora llegada siguiente destino</Text>
            <TouchableOpacity
              onPress={() => showTimePicker('HoraLlegadaSgteDestino')}
              style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%", color: '#000000' }}
                placeholder='Hora llegada siguiente destino'
                value={fechas.HoraLlegadaSgteDestino}
                editable={false}
              />
              <AntDesign
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode='date'
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              style={{ color: "#FF6B00" }}
            />
            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode='datetime'
              onConfirm={handleConfirmTime}
              onCancel={hideTimePicker}
              style={{ color: "#FF6B00" }}
            />

          </View>

        </ScrollView>

        {/* <View style={{ padding: 50 }} ></View> */}
      </View >
      <BannerOrderServi
        {...props}
        navigation={navigation}
        screen={"6-INGRESO HORAS"}
      />
    </View >
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
    backgroundColor: "#FFFFFF",
    padding: 10,
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
    color: "#000000",
  },
});
