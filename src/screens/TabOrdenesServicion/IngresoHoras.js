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
import { useDispatch, useSelector } from "react-redux";
import { loadingCargando } from "../../redux/sincronizacion";
import { actualizarTiempoTool } from "../../redux/formulario";
import isEmpty from "just-is-empty";
import moment from "moment";



export default function IngresoHoras(props) {
  const { navigation } = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [fini, setFini] = useState(false)
  const [OrdenServicioID, setOrdenServicioID] = useState(0)

  const [tiempoOS, setTiempoOS] = useState("")

  const Events = useSelector(s => s.sincronizacion)
  const TiempoStor = useSelector(s => s.formulario)
  const dispatch = useDispatch()




  const showDatePicker = (name) => {
    setTiempoOS('Fecha');
    setDatePickerVisibility(true);
  };

  //para la fecha
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  }



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

    if (name == "HoraLlegadaCliente") {
      let diff = Moment(time, "YYYY-MM-DD HH:mm:ss").diff(Moment(fechas.HoraSalidaOrigen, "YYYY-MM-DD HH:mm:ss"), 'minutes')
      console.log("diff", diff)
      if (diff <= 0) {
        alert("La hora de llegada no puede ser menor a la salida de origen.", name, time)
      } else {
        dispatch(actualizarTiempoTool({
          name: 'TiempoViaje',
          value: 0
        }))
      }
    } else if (name == "HoraInicioTrabajo") {

      let diff = Moment(time, "YYYY-MM-DD HH:mm:ss").diff(Moment(fechas.HoraLlegadaCliente, "YYYY-MM-DD HH:mm:ss"), 'minutes')
      console.log("diff", diff)
      if (diff <= 0) {
        alert("La hora de inicio no puede ser menor a la llegada al cliente.", name, time)
      }

    } else if (name == "HoraFinTrabajo") {
      let diff = Moment(time, "YYYY-MM-DD HH:mm:ss").diff(Moment(fechas.HoraInicioTrabajo, "YYYY-MM-DD HH:mm:ss"), 'minutes')
      console.log("diff", diff)
      if (diff <= 0) {
        alert("La hora final no puede ser menor a la hora inicial de trabajo.", name, time)
      } else {
        dispatch(actualizarTiempoTool({
          name: 'TiempoTrabajo',
          value: 0
        }))
      }

    } else if (name == "HoraSalidaCliente") {

      let diff = Moment(time, "YYYY-MM-DD HH:mm:ss").diff(Moment(fechas.HoraFinTrabajo, "YYYY-MM-DD HH:mm:ss"), 'minutes')
      console.log("diff", diff)
      if (diff <= 0) {
        alert("La hora de salida no puede ser menor a la hora final de trabajo.", name, time)
      }

    } else if (name == "HoraLlegadaSgteDestino") {
      let diff = Moment(time, "YYYY-MM-DD HH:mm:ss").diff(Moment(fechas.HoraSalidaCliente, "YYYY-MM-DD HH:mm:ss"), 'minutes')
      console.log("diff", diff)
      if (diff <= 0) {
        alert("La hora de llegada no puede ser menor a la salida.", name, time)
      }

    }
  }

  const handleConfirmTime = async (time) => {
    let OS_Tiempos = TiempoStor.tiempos
    if (OS_Tiempos.length > 0) {
      dispatch(actualizarTiempoTool({
        name: [tiempoOS],
        value: Moment(time).format("HH:mm:ss")
      }))
      setFechas({ ...fechas, [tiempoOS]: Moment(time).format("HH:mm:ss") })
      compareHours(time, tiempoOS)
      hideTimePicker()
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

  const handleConfirm = async (date) => {
    console.log("Fecha: ", date);
    let fec = new Date(date)
    dispatch(actualizarTiempoTool({
      name: 'Fecha',
      value: `${moment(fec).format("YYYY-MM-DDTHH:mm:ss.SSS")}`
    }))
    setFechas({
      ...fechas,
      Fecha: `${moment(fec).format("YYYY-MM-DDTHH:mm:ss.SSS")}`,
    })
    hideDatePicker();
  }

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
    setMinTime(Moment().format("HH:mm:ss"))
  }

  useFocusEffect(
    useCallback(() => {
      if (typeof TiempoStor.tiempos != "undefined") {
        if (TiempoStor.tiempos.length > 0) {
          LimpiarImput()
          setFechas(TiempoStor.tiempos[0])
        }
      }
    }, [TiempoStor.tiempos])
  )

  useFocusEffect(
    useCallback(() => {
      (async () => {
        dispatch(loadingCargando(true))
        const itenSelect = await AsyncStorage.getItem(ticketID)
        if (itenSelect != null) {
          const item = JSON.parse(itenSelect)
          const { Accion, OrdenServicioID } = item
          setOrdenServicioID(OrdenServicioID)
          console.log("TiempoStor", TiempoStor.tiempos[0])
          if (Accion == "OrdenSinTicket") {

            console.log("OrdenSinTicket")
           
            setFini(false)

          } else if (Accion == "clonar") {

            setFini(false)

          } else if (Accion == "FINALIZADO") {

            console.log("FINALIZADO")
            setFini(true)

          } else if (Accion == "PENDIENTE") {

            console.log("PENDIENTE")
            // LimpiarImput()
            setFini(false)

          } else if (Accion == "NUEVO OS TICKET") {
            console.log("NUEVO OS TICKET")
            setFini(false)

          } else if (Accion == "PROCESO") {
            console.log("PROCESO")
            setFini(false)
          }
        }
        dispatch(loadingCargando(false))
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
          <LoadingActi loading={Events.loading} top={250} />
            <Text>Fecha</Text>
            <TouchableOpacity
              disabled={fini}
              onPress={() => showDatePicker('dateInit')}
              style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%", color: '#000000' }}
                placeholder='Fecha de Ingreso'
                value={
                  !isEmpty(fechas.Fecha) ? fechas.Fecha.split('T')[0]
                    : ''
                }
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
