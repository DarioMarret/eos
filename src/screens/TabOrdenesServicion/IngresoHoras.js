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
import { useCallback, useState, useEffect } from "react";
import Moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import BannerOrderServi from "../../components/BannerOrdenServ";
import { ticketID, timpo } from "../../utils/constantes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import LoadingActi from "../../components/LoadingActi";
import { time } from "../../service/CargaUtil";



export default function IngresoHoras(props) {
  const { navigation } = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [loading, setLoading] = useState(false)

  const [fini, setFini] = useState(false);

  const [tiempoOS, setTiempoOS] = useState("")

  const showDatePicker = (name) => {
    setTiempoOS(name);
    setDatePickerVisibility(true);
  };

  //parala fecha
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  }

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

  const showTimePicker = (name) => {
    setTiempoOS(name);
    setTimePickerVisibility(true);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };
  const alert = (message, name, time) => {
    Alert.alert("Alerta", message, [
      {
        text: "OK",
        onPress: () => {
          setFechas({ ...fechas, [name]: "" })
        },
        style: { color: "#FF6B00" },
      }
    ])
  }
  const compareHours = async (time, name) => {
    console.log("compareHours", { time, name })
    var os = await AsyncStorage.getItem("OS_Tiempos")
    var OS_Tiempos = JSON.parse(os)
    if (name == "HoraLlegadaCliente") {
      let diff = Moment(time, "YYYY-MM-DD HH:mm:ss").diff(Moment(fecha.HoraSalidaOrigen, "YYYY-MM-DD HH:mm:ss"), 'minutes')
      console.log("diff", diff)
      if (diff <= 0) {
        alert("La hora de llegada no puede ser menor a la salida de origen.", name, time)
      }else{
        OS_Tiempos[0].TiempoViaje = diff
        await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
      }

    } else if (name == "HoraInicioTrabajo") {

      let diff = Moment(time, "YYYY-MM-DD HH:mm:ss").diff(Moment(fecha.HoraLlegadaCliente, "YYYY-MM-DD HH:mm:ss"), 'minutes')
      console.log("diff", diff)
      if (diff <= 0) {
        alert("La hora de inicio no puede ser menor a la llegada al cliente.", name, time)
      }

    } else if (name == "HoraFinTrabajo") {
      let diff = Moment(time, "YYYY-MM-DD HH:mm:ss").diff(Moment(fecha.HoraInicioTrabajo, "YYYY-MM-DD HH:mm:ss"), 'minutes')
      console.log("diff", diff)
      if (diff <= 0) {
        alert("La hora final no puede ser menor a la hora inicial de trabajo.", name, time)
      }else{
        OS_Tiempos[0].TiempoTrabajo = diff
        await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
      }

    } else if (name == "HoraSalidaCliente") {

      let diff = Moment(time, "YYYY-MM-DD HH:mm:ss").diff(Moment(fecha.HoraFinTrabajo, "YYYY-MM-DD HH:mm:ss"), 'minutes')
      console.log("diff", diff)
      if (diff <= 0) {
        alert("La hora de salida no puede ser menor a la hora final de trabajo.", name, time)
      }

    } else if (name == "HoraLlegadaSgteDestino") {
      let diff = Moment(time, "YYYY-MM-DD HH:mm:ss").diff(Moment(fecha.HoraSalidaCliente, "YYYY-MM-DD HH:mm:ss"), 'minutes')
      console.log("diff", diff)
      if (diff <= 0) {
        alert("La hora de llegada no puede ser menor a la salida.", name, time)
      }

    }
  }
  const handleConfirmTime = async (time) => {
    var os = await AsyncStorage.getItem("OS_Tiempos")
    let OS_Tiempos = JSON.parse(os)

    if (OS_Tiempos.length > 0) {
      OS_Tiempos[0][tiempoOS] = Moment(time).format("HH:mm:ss")
      await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
      setFechas({ ...fechas, [tiempoOS]: Moment(time).format("HH:mm:ss") })
      setFecha({ ...fecha, [tiempoOS]: Moment(time).format("YYYY-MM-DD HH:mm:ss") })
      setMinTime(Moment(time).format("HH:mm:ss"))
      compareHours(time, tiempoOS)
      // console.log("TRUE", OS_Tiempos)
      hideTimePicker()
    } else {
      OS_Tiempos = [timpo]
      OS_Tiempos[0][tiempoOS] = Moment(time).format("HH:mm:ss")
      await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
      setFechas({ ...fechas, [tiempoOS]: Moment(time).format("HH:mm:ss") })
      setFecha({ ...fecha, [tiempoOS]: Moment(time).format("YYYY-MM-DD HH:mm:ss") })
      setMinTime(Moment(time).format("HH:mm:ss"))
      compareHours(time, tiempoOS)
      // console.log("FALSE", OS_Tiempos)
      hideTimePicker()
    }

    console.log("tiempoOS", OS_Tiempos.length)
    // console.log("tiempoOS", JSON.parse(await AsyncStorage.getItem("OS")))
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
      // onsole.log("OrdenSinTicket-->", JSON.parse(await AsyncStorage.getItem("OS")))
    }
  }

  const [minTime, setMinTime] = useState(Moment().format("HH:mm:ss"))

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
  })
  const [fecha, setFecha] = useState({
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
  })

  function LimpiarImput() {
    setFechas({
      ...fechas,
      Fecha: "",
      HoraSalidaOrigen: "",
      HoraLlegadaCliente: "",
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
    setFecha({
      ...fecha,
      HoraSalidaOrigen: "",
      HoraLlegadaCliente: "",
      HoraInicioTrabajo: "",
      HoraFinTrabajo: "",
      HoraSalidaCliente: "",
      TiempoEspera: 0,
      TiempoTrabajo: 0,
      TiempoViaje: 0,
      FechaMostrar: "",
      HoraLlegadaSgteDestino: "",
      TiempoViajeSalida: 0,
    })
    setMinTime(Moment().format("HH:mm:ss"))
  }


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
          if (Accion == "OrdenSinTicket") {

            console.log("OrdenSinTicket")
            // console.log("OrdenSinTicket-->", JSON.parse(await AsyncStorage.getItem("OS")))
            // await AsyncStorage.setItem("OS_Tiempos", JSON.stringify([]))
            LimpiarImput()
            setFini(false)

          } else if (Accion == "clonar") {

            LimpiarImput()
            OS_Tiempos[0].Fecha == null ? `${Moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z` : OS_Tiempos[0].Fecha
            OS_Tiempos[0].OrdenServicioID = 0
            OS_Tiempos[0].IdTiempo = 0
            console.log("OS_Tiempo", OS_Tiempos)
            await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
            setFechas({
              ...fechas,
              ...OS_Tiempos[0],
              FechaMostrar: Moment().format('DD/MM/YYYY'),
            })
            setFini(false)

          } else if (Accion == "FINALIZADO") {

            console.log("FINALIZADO")
            LimpiarImput()
            setFini(true)
            setFechas({
              ...fechas,
              ...OS_Tiempos[0],
              FechaMostrar: Moment().format('DD/MM/YYYY'),
            })

          } else if (Accion == "PENDIENTE") {

            console.log("PENDIENTE")
            LimpiarImput()
            OS_Tiempos[0].Fecha == null ? `${Moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z` : OS_Tiempos[0].Fecha
            await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
            setFechas({
              ...fechas,
              ...OS_Tiempos[0],
              FechaMostrar: Moment().format('DD/MM/YYYY'),
            })
            setFini(false)

          } else if (Accion == "NUEVO OS TICKET") {
            console.log("NUEVO OS TICKET")
            LimpiarImput()
            OS_Tiempos[0].Fecha == null ? `${Moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z` : OS_Tiempos[0].Fecha
            OS_Tiempos[0].OrdenServicioID = 0
            OS_Tiempos[0].IdTiempo = 0
            await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
            console.log("OS_Tiempo", OS_Tiempos)
            setFechas({
              ...fechas,
              ...OS_Tiempos[0],
              FechaMostrar: Moment().format('DD/MM/YYYY'),
            })
            setFini(false)

          } else if (Accion == "PROCESO") {
            console.log("PROCESO")
            console.log("p", await AsyncStorage.getItem("OS_Anexos"))
            LimpiarImput()
            OS_Tiempos[0].Fecha == null ? `${Moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z` : OS_Tiempos[0].Fecha
            await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
            setFechas({
              ...fechas,
              ...OS_Tiempos[0],
              FechaMostrar: Moment().format('DD/MM/YYYY'),
            })
            setFini(false)
          }
        }
        await time(300)
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
              disabled={fini}
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
              disabled={fini}
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
              disabled={fini}
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
              disabled={fini}
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
              disabled={fini}
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
              disabled={fini}
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
              disabled={fini}
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
              mode='time'
              minTime={minTime}
              onConfirm={handleConfirmTime}
              onCancel={hideTimePicker}
              is24Hour={true}
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
  )

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
