import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
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
  const [infoPicker, setInfoPicker] = useState("");
  const [dateForms, setDateForms] = useState({
    dateInit: null,
    timeOriginOut: null,
    timeArrivedClient: null,
    timeInitWork: null,
    timeFinishWork: null,
    timeOutClient: null,
    timeNextDestine: null,
  });
  const changeTime = () => {
    setDatePickerVisibility(true);
  };
  const showDatePicker = (name) => {
    setInfoPicker(name);
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    setDateForms({ ...dateForms, [infoPicker]: Moment(date).format('DD/MM/YYYY') })
    console.log(dateForms)
    hideDatePicker();
  };
  const showTimePicker = (name) => {
    setInfoPicker(name);
    setTimePickerVisibility(true);
  };
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };
  const handleConfirmTime = (time) => {
    setDateForms({ ...dateForms, [infoPicker]: Moment(time).format('LT') })
    hideTimePicker();
  }

  const [fechas, setFechas] = useState({
    fechaIngreso: "",
    salidaOrigen: "",
    arriboCliente: "",
    inicioTrabajo: "",
    finTrabajo: "",
    salidaCliente: "",
    siguienteDestino: "",
  })


  useFocusEffect(
    useCallback(() => {
      (async () => {

        const itenSelect = await AsyncStorage.getItem(ticketID)
        if (itenSelect != null) {
          const item = JSON.parse(itenSelect)
          const { equipo, OrdenServicioID, ticket_id } = item
          if (OrdenServicioID != null) {
            const tiempo = await TiempoOSOrdenServicioID(OrdenServicioID)
            const tiempos = JSON.parse(tiempo[0].OS_Tiempos)
            tiempos.map((item) => {
              setFechas({
                ...fechas,
                fechaIngreso: item.Fecha.split('T')[0],
                salidaOrigen: item.HoraSalidaOrigen,
                arriboCliente: item.HoraLlegadaCliente,
                inicioTrabajo: item.HoraInicioTrabajo,
                finTrabajo: item.HoraFinTrabajo,
                salidaCliente: item.HoraSalidaCliente,
                siguienteDestino: item.HoraLlegadaSgteDestino
              })
            })
            console.log(tiempos)

            return
          }
        }
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
        <ScrollView>
          <View style={styles.ContainerInputs}>
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%" }}
                placeholder='Fecha de Ingreso'
                onChangeText={(e) => changeTime(e)}
                value={fechas.fechaIngreso}
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
                onChangeText={(e) => changeTime(e)}
                value={fechas.salidaOrigen}
              />
              <AntDesign
                onPress={() => showTimePicker('timeOriginOut')}
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </View>
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%" }}
                placeholder='Arribo cliente'
                onChangeText={(e) => changeTime(e)}
                value={fechas.arriboCliente}
              />
              <AntDesign
                onPress={() => showTimePicker('timeArrivedClient')}
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </View>
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%" }}
                placeholder='Inicio trabajo'
                onChangeText={(e) => changeTime(e)}
                value={fechas.inicioTrabajo}
              />
              <AntDesign
                onPress={() => showTimePicker('timeInitWork')}
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </View>
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%" }}
                placeholder='Fin trabajo'
                onChangeText={(e) => changeTime(e)}
                value={fechas.finTrabajo}
              />
              <AntDesign
                onPress={() => showTimePicker('timeFinishWork')}
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </View>
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%" }}
                placeholder='Salida cliente'
                onChangeText={(e) => changeTime(e)}
                value={fechas.salidaCliente}
              />
              <AntDesign
                onPress={() => showTimePicker('timeOutClient')}
                name='clockcircleo'
                size={24}
                color='#000000'
              />
            </View>
            <View style={styles.input}>
              <TextInput
                style={{ width: "90%", height: "100%" }}
                placeholder='Hora llegada siguiente destino'
                onChangeText={(e) => changeTime(e)}
                value={fechas.siguienteDestino}
              />
              <AntDesign
                onPress={() => showTimePicker('timeNextDestine')}
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
      </View>
      <BannerOrderServi
        {...props}
        navigation={navigation}
        screen={"6-INGRESO HORAS"}
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
