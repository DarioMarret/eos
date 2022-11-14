import {
  ActivityIndicator,
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Fontisto } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import tabNavigation from "../hook/tabNavigation";
import { getHistorialEquiposStorageChecked,isCheckedCancelar } from "../service/historiaEquipo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import React, { useCallback, useState } from "react";
import { ticketID } from "../utils/constantes";
import { InsertOrdenServicioAnidadasLocal } from "../service/OrdenServicioAnidadas";
import { useFocusEffect } from "@react-navigation/native";
import { InserOSOrdenServicioIDLocal } from "../service/OS_OrdenServicio";
import {
  ActualizarOrdenServicioLocal,
  EditareventoLocal,
  registartEquipoTicket,
} from "../service/ServicioLoca";
import {
  PostLocalFormularioTool,
  PutaLocalctualizarFormularioTool,
  resetFormMessageTool,
  resetStatusTool,
} from "../redux/formulario";
import { useDispatch, useSelector } from "react-redux";
import {
  getEventosByDate,
  listarEventoAyer,
  listarEventoHoy,
  listarEventoMnn,
  loadingCargando,
} from "../redux/sincronizacion";

export default function BannerOrderServi(props) {
  const { navigation, route } = props;
  const { name } = route;

  const [modalVisible, setModalVisible] = useState(false);

  const { TabTitle } = tabNavigation();
  const [editar, seteditar] = useState(false);
  const [Estado, setEstado] = useState("");
  const form = useSelector((state) => state.formulario);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const itenSelect = await AsyncStorage.getItem(ticketID);
        if (itenSelect != null) {
          const item = JSON.parse(itenSelect);
          const { Accion } = item;
          console.log("BANNER ", Accion);
          setEstado(Accion);
          if (
            Accion != "clonar" &&
            Accion != "OrdenSinTicket" &&
            Accion != "NUEVO OS TICKET"
          ) {
            if (name == "6-INGRESO HORAS" && Accion != null) {
              seteditar(true);
            } else {
              seteditar(false);
            }
          }
        }
      })();
    }, [name])
  );
  const tab = [
    "1-EQUIPO",
    "2-CLIENTE",
    "3-DATOS",
    "4-COMPONENTES",
    "5-ADJUNTOS",
    "6-INGRESO HORAS",
  ];

  async function changeScreenSiguiente() {
    let index = tab.indexOf(name);
    const check = await PasarACliente();
    if (check) {
      if (index <= tab.length) {
        console.log("indexOf-->", index);
        if (index < tab.length - 1) {
          TabTitle(tab[index + 1]);
          navigation.navigate(tab[index + 1]);
        }
      }
    }
  }

  function changeScreenAnterior() {
    let index = tab.indexOf(name);
    if (index >= 0 && index <= tab.length) {
      if (index > 0) {
        TabTitle(tab[index - 1]);
        navigation.navigate(tab[index - 1]);
      }
    }
  }
  
  async function resetTab() {//limpiar tab y volver a la pantalla anterior
    TabTitle(tab[0]);
    const screen = await AsyncStorage.getItem("SCREMS");
    navigation.navigate(screen);
  }

  async function PasarACliente() {
    const respuesta = await getHistorialEquiposStorageChecked()//validamos si hay un equipo seleccionado para porder pasar a cliente
    if (respuesta.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async function Dispatcher() {
    var hoy = moment().format("YYYY-MM-DD");
    var ayer = moment().add(-1, "days").format("YYYY-MM-DD");
    var mnn = moment().add(1, "days").format("YYYY-MM-DD");
    const promisa_hoy = dispatch(getEventosByDate(`${hoy}T00:00:00`));
    promisa_hoy.then((res) => {
      if (res.payload.length > 0) {
        dispatch(listarEventoHoy(res.payload));
      }
    });
    const promisa_ayer = dispatch(getEventosByDate(`${ayer}T00:00:00`));
    promisa_ayer.then((res) => {
      if (res.payload.length > 0) {
        dispatch(listarEventoAyer(res.payload));
      }
    });
    const promisa_mnn = dispatch(getEventosByDate(`${mnn}T00:00:00`));
    promisa_mnn.then((res) => {
      if (res.payload.length > 0) {
        dispatch(listarEventoMnn(res.payload));
      }
    });
  }

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (form.status == 304) {
          //este se ejecuta cuando se actualiza una orden de servicio
          dispatch(resetStatusTool());
          await ActualizarOrdenLocal();
          await Dispatcher();
        }
        if (form.status == 300) {
          //este se ejecuta cuando se crea una orden de servicio
          dispatch(resetStatusTool());
          await CrearOrdenLocal();
          await Dispatcher();
        }
      })();
    }, [form.status == 304 || form.status == 300])
  )

  const CrearOrdenLocal = async () => {
    const { OrdenServicioID, equipo_id, contrato_id, evento_id } = form.ordenServicio;
    dispatch(loadingCargando(true));
    await isCheckedCancelar()//Cancela los equipos que estan en el historial con check
    await InserOSOrdenServicioIDLocal(form.ordenServicio, OrdenServicioID) //Inserta la orden de servicio en la base de datos local
    await EditareventoLocal("PROCESO", OrdenServicioID, evento_id)//actualiza el evento del dia a proceso en elcual se esta trabajando
    await registartEquipoTicket(equipo_id, contrato_id, OrdenServicioID)//registra el equipo en el historial de equipos
    await resetTab()//resetea el formulario
    dispatch(resetFormMessageTool());
    dispatch(loadingCargando(false));
    Alerta(
      "Información",
      "Orden de servicio creado localmente cuando sincronize se subir al servidor"
    );
  };

  const ActualizarOrdenLocal = async () => {
    const { OrdenServicioID, evento_id } = form.ordenServicio;
    dispatch(loadingCargando(true));
    await isCheckedCancelar()//Cancela los equipos que estan en el historial con check
    await EditareventoLocal("PROCESO", OrdenServicioID, evento_id)//actualiza el evento del dia a proceso en elcual se esta trabajando
    await ActualizarOrdenServicioLocal(form.ordenServicio)//actualiza la orden de servicio en la base de datos local
    await resetTab()//resetea el formulario
    dispatch(resetFormMessageTool());
    dispatch(loadingCargando(false));
    Alerta("Información", "Orden de servicio actualizada localmente");
  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const GuadarLocalmente = async () => {
    if (form.OrdenServicioID == 0) {
      const itenSelect = await AsyncStorage.getItem(ticketID);
      const item = JSON.parse(itenSelect);
      const { Accion, ticket_id, evento_id, tck_tipoTicket } = item;
      var rando = getRandomInt(1000000000);
      rando = `${rando.toString().substring(0, 4)}`;
        //Genrear todo el objeto OS para guardar localmente
        dispatch(
          PostLocalFormularioTool({
            ticket_id: ticket_id,
            OrdenServicioID: parseInt(rando),
            evento_id: evento_id,
            es: Accion != "clonar" && Accion != "NUEVO OS TICKET" ? "LOCAL" : "ANI"
          })
        );

      //se ejecutara solo si es una clonacion o un nuevo tike que se va a anidar al OS 01 09
      if (Accion == "clonar" || Accion == "NUEVO OS TICKET") {
        // dispatch(PostEnviarFormularioTool());
        let evento = {
          evento_id: evento_id,
          ticket_id: ticket_id,
          codOS: `OSO${parseInt(rando)}`,
          codeTicket: `TK`,
          tck_cliente: form.cliente.ClienteNombre,
          tck_tipoTicket: tck_tipoTicket,
          tck_tipoTicketDesc: null,
          tck_descripcionProblema: "NUEVO OS TICKET",
          ev_fechaAsignadaDesde: `${moment().format("YYYY-MM-DD")}T00:00:00`,
          ev_fechaAsignadaHasta: `${moment().format("YYYY-MM-DD")}T00:00:00`,
          ev_horaAsignadaDesde: `${moment().format("HH:mm:ss")}T00:00:00`,
          ev_horaAsignadaHasta: `${moment().format("HH:mm:ss")}T00:00:00`,
          ev_estado: "PROCESO",
          tck_direccion: "",
          tck_canton: "",
          tck_provincia: "",
          tck_reporta: "LOCAL",
          tck_telefonoReporta: ".",
          tck_usuario_creacion: 53,
          tck_estadoTicket: "NUEVO",
          ev_descripcion: "NUEVO OS TICKET",
          id_contrato: null,
          ingenieroId: 0,
          ingeniero: null,
          tipoIncidencia: form.datos.tipoIncidencia,
          OrdenServicioID: parseInt(rando),
          tck_tipoTicketCod: form.datos.TipoVisita,
        };
        console.log("evento", evento)
        //crear un evento cuando se crea un os ticket
        await InsertOrdenServicioAnidadasLocal(evento);
      }
    } else {
      dispatch(PutaLocalctualizarFormularioTool());
    }
  };

  function Alerta(title, message) {
    Alert.alert(
      title,
      message,
      [
        {
          text: "OK",
          onPress: () => {
            setModalVisible(false);
          },
        },
      ],
      { cancelable: false }
    );
  }

  const GUARDADOLOCAL = async () => {//Validamos si se va a guardar localmente o si ya fue finalizado
    const itenSelect = await AsyncStorage.getItem(ticketID);
    if (itenSelect != null) {
      const item = JSON.parse(itenSelect);
      const { Accion } = item;
      if (Accion == "FINALIZADO" || Accion == "PENDIENTE DE APROBAR") {
        Alert.alert("Información", "la orden ya fue finalizada");
      } else {
        await GuadarLocalmente();
      }
    }
  }

  return (
    <>
      <View style={styles.banner}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <Fontisto name="cloud-refresh" size={25} color="#FFF" />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: name !== "1-EQUIPO" ? "space-between" : "flex-end",
            alignItems: "center",
            width: "70%",
          }}
        >
          {name !== "1-EQUIPO" ? (
            <TouchableOpacity
              style={styles.volver}
              onPress={changeScreenAnterior}
            >
              <AntDesign name="arrowleft" size={20} color="#FFFFFF" />
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 12,
                  paddingLeft: 5,
                  fontWeight: "bold",
                }}
              >
                VOLVER
              </Text>
            </TouchableOpacity>
          ) : null}
          {name !== "6-INGRESO HORAS" ? (
            <TouchableOpacity
              style={styles.volver}
              onPress={changeScreenSiguiente}
            >
              <Text style={{ color: "#FFF", fontSize: 12, fontWeight: "bold" }}>
                SIGUIENTE
              </Text>
              <AntDesign name="arrowright" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{
                ...styles.volver,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onPress={() => GUARDADOLOCAL()}
            >
              {Estado !== "FINALIZADO" &&
              Estado !== "PENDIENTE DE APROBACION" ? (
                editar ? (
                  <Text
                    style={{ color: "#FFF", fontSize: 12, paddingRight: 5 }}
                  >
                    EDITAR
                  </Text>
                ) : (
                  <Text
                    style={{ color: "#FFF", fontSize: 12, paddingRight: 5 }}
                  >
                    GUARDAR
                  </Text>
                )
              ) : (
                ""
              )}
              <AntDesign name="save" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ActivityIndicator size={70} color="#FF6B00" />
              <Text style={{ marginTop: 16, marginBottom: 32 }}>
                Guardando...
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  banner: {
    width: "100%",
    height: "12%",
    backgroundColor: "#EA0029",
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  volver: {
    flexDirection: "row",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF6B00",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    width: "80%",
    height: "20%",
    backgroundColor: "white",
    borderRadius: 3,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
})
