import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
} from "react-native";
import Banner from "../../components/Banner";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import Moment from 'moment';
import DateTimePickerModal from "react-native-modal-datetime-picker";

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
    setDateForms({...dateForms, [infoPicker]: Moment(date).format('DD/MM/YYYY')})
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
    setDateForms({...dateForms, [infoPicker]: Moment(time).format('LT')})
    hideTimePicker();
  };

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
        <View style={styles.ContainerInputs}>
          <View style={styles.input}>
            <TextInput
              style={{ width: "90%", height: "100%" }}
              placeholder='Fecha de Ingreso'
              onChangeText={(e) => changeTime(e)}
              value={dateForms.dateInit}
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
              value={dateForms.timeOriginOut}
            />
            <AntDesign
              onPress={()=>showTimePicker('timeOriginOut')}
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
              value={dateForms.timeArrivedClient}
            />
            <AntDesign
              onPress={()=>showTimePicker('timeArrivedClient')}
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
              value={dateForms.timeInitWork}
            />
            <AntDesign
              onPress={()=>showTimePicker('timeInitWork')}
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
              value={dateForms.timeFinishWork}
            />
            <AntDesign
              onPress={()=>showTimePicker('timeFinishWork')}
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
              value={dateForms.timeOutClient}
            />
            <AntDesign
              onPress={()=>showTimePicker('timeOutClient')}
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
              value={dateForms.timeNextDestine}
            />
            <AntDesign
              onPress={()=>showTimePicker('timeNextDestine')}
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
