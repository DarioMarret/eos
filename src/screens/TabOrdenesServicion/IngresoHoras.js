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
import { ticketID } from "../../utils/constantes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { TiempoOSOrdenServicioID } from "../../service/OS_OrdenServicio";


export default function IngresoHoras(props) {
  const { navigation } = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const [tiempoOS, setTiempoOS] = useState("")

  const showDatePicker = (name) => {
    setTiempoOS(name);
    setDatePickerVisibility(true);
  };

  //parala fecha
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    setFechas({ ...fechas, Fecha: Moment(date).format('YYYY-MM-DD') })
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

  const handleConfirmTime = (time) => {
    setFechas({ ...fechas, [tiempoOS]: Moment(time).format('HH:mm:ss') })
    hideTimePicker();
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
    Fecha: "",
    HoraLlegadaSgteDestino: "",
    TiempoViajeSalida: 0,
    switch: false,
  })


  useFocusEffect(
    useCallback(() => {
      (async () => {
        const itenSelect = await AsyncStorage.getItem(ticketID)
        if (itenSelect != null) {
          const item = JSON.parse(itenSelect)
          const { equipo, OrdenServicioID, ticket_id, Accion } = item
          const OS_Tiempo = await AsyncStorage.getItem("OS_Tiempos")
          let os_tiempos = JSON.parse(OS_Tiempo)
          if (Accion == "OrdenSinTicket") {
            setFechas({
              ...fechas,
              ...os_tiempos[0]
            })
            return
          } else if (Accion == "clonar") {
            setFechas({
              ...fechas,
              ...os_tiempos[0]
            })
            return
          } else if (Accion == "FINALIZADO") {
            setFechas({
              ...fechas,
              ...os_tiempos[0]
            })
          } else if (Accion == "PROCESO") {
            setFechas({
              ...fechas,
              ...os_tiempos[0]
            })
          }
        }
      })()
    }, [])
  )
  const SwitchGuardar = async () => {
    setFechas({
      ...fechas,
      switch: !fechas.switch
    })
    await AsyncStorage.setItem("OS_Tiempos", JSON.stringify([fechas]))
    console.log("fechas", fechas)
  }

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
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%" }}
                placeholder='Fecha de Ingreso'
                value={fechas.Fecha}
                enable={true}
              />
              <AntDesign
                onPress={() => showDatePicker('dateInit')}
                name='calendar'
                size={24}
                color='#000000'
              />
            </View>
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%" }}
                placeholder='Salida origen'
                value={fechas.HoraSalidaOrigen}
                enable={true}
              />
              <AntDesign
                onPress={() => showTimePicker('HoraSalidaOrigen')}
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </View>
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%" }}
                placeholder='Arribo cliente'
                value={fechas.HoraLlegadaCliente}
                enable={true}
              />
              <AntDesign
                onPress={() => showTimePicker('HoraLlegadaCliente')}
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </View>
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%" }}
                placeholder='Inicio trabajo'
                value={fechas.HoraInicioTrabajo}
                enable={true}
              />
              <AntDesign
                onPress={() => showTimePicker('HoraInicioTrabajo')}
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </View>
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%" }}
                placeholder='Fin trabajo'
                value={fechas.HoraFinTrabajo}
                enable={true}
              />
              <AntDesign
                onPress={() => showTimePicker('HoraFinTrabajo')}
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </View>
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%" }}
                placeholder='Salida cliente'
                value={fechas.HoraSalidaCliente}
                enable={true}
              />
              <AntDesign
                onPress={() => showTimePicker('HoraSalidaCliente')}
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </View>
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%" }}
                placeholder='Hora llegada siguiente destino'
                value={fechas.HoraLlegadaSgteDestino}
                enable={true}
              />
              <AntDesign
                onPress={() => showTimePicker('HoraLlegadaSgteDestino')}
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </View>
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
              onConfirm={handleConfirmTime}
              onCancel={hideTimePicker}
              style={{ color: "#FF6B00" }}
            />

          </View>

        </ScrollView>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            {
              fechas.switch ?
                <Text style={{ fontSize: 16, marginRight: 4 }}>Guardado:</Text>
                : <Text style={{ fontSize: 16, marginRight: 4 }}>Editable:</Text>
            }
            <Switch
              trackColor={{ false: "#FFAF75", true: "#FFAF75" }}
              thumbColor={fechas.switch ? "#FF6B00" : "#ffffff"}
              ios_backgroundColor="#FFAF75"
              onValueChange={() => SwitchGuardar()}
              value={fechas.switch}
            />
          </View>
        </View>
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
  },
});
