import {
  DeleteEventesDiaHoy,
  GetEventosByTicket,
  GetEventosByTicketHoy,
  GetEventosDelDia,
  GetEventosDelDiaHoy,
} from "../service/OSevento";
import {
  DeleteAnidada,
  ExisteAnidacion,
  OrdenServicioAnidadas,
} from "../service/OrdenServicioAnidadas";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  deleteEquipoIDTicketArray,
  EquipoTicket,
} from "../service/equipoTicketID";
import { AntDesign, Fontisto } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import moment from "moment";
import { ExisteHistorialEquipoClienteNombre, HistorialEquipoPorCliente } from "../service/historiaEquipo";

import { PostOS, PutOS } from "../service/OS";
import { BuscarOrdenServicioLocales } from "../service/ServicioLoca";
import { useSelector, useDispatch } from "react-redux";
import {
  getEventosByDate,
  listarEventoAyer,
  listarEventoHoy,
  listarEventoMnn,
  loadingCargando,
  loadingProcesando,
} from "../redux/sincronizacion";
import { useFocusEffect } from "@react-navigation/native";
import { DeleteOrdenServicioID, OSOrdenServicioID, SacarAnexo, SacarCheckList, SacarFirmas, SacarParte, SacarTiempos } from "../service/OS_OrdenServicio";
import isEmpty from "is-empty";
import { GetClienteClienteName } from "../service/clientes";
import axios from "axios";
import { getToken } from "../service/usuario";
import { time } from "../service/CargaUtil";

const isConnection = axios.create({
  baseURL: "https://technical.eos.med.ec/MSOrdenServicio/getVerificaLlegada",
  timeout: 30,
})

export default function Banner() {

  const [update, setupdate] = useState(false);
  const [message, setMessage] = useState("Actualizando...");

  const [modal, setModal] = useState(false);


  const dispatch = useDispatch();

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

  async function ActualizarEventos() {
    try {
      const { data } = await isConnection.get();
      if (data) {
        Alert.alert(
          "Recomendación",
          "Debe estar conectado a una red de internet o datos estable.",
          [
            {
              text: "OK",
              onPress: () => UP(),
              style: { color: "#FF6B00" },
            },
            {
              text: "Cancelar",
              onPress: () => console.log("hola Mundo"),
              style: { color: "#FF6B00" },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Se excedió el tiempo de espera de la conexión.");
    }
  }

  async function UP() {
    dispatch(loadingCargando(true));
    setupdate(true);
    const respuesta = await UpdateLocal();
    await AsyncAwait();
    await Dispatcher();
    if (respuesta) {
      dispatch(loadingCargando(false));
      setupdate(false);
    } else {
      dispatch(loadingCargando(false));
      setupdate(false);
    }
  }
  const Events = useSelector((s) => s.sincronizacion);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (Events.sincronizador) {
          dispatch(loadingProcesando(false));
        }
      })();
    }, [Events.sincronizador])
  );

  async function AsyncAwait() {
    //eliminda los eventos del dia hoy
    await GetEventosDelDia();
    var ayer = moment().add(-1, "days").format("YYYY-MM-DD");
    var hoy = moment().format("YYYY-MM-DD");
    var manana = moment().add(1, "days").format("YYYY-MM-DD");
    const ticket_id = await GetEventosByTicket(ayer, hoy, manana);
    console.log("ticket_id", ticket_id);
    let id_ticket = [];
    let evento_id = [];
    let OrdenServicioID = [];
    let tck_cliente = [];
    for (let index = 0; index < ticket_id.length; index++) {
      let item = ticket_id[index];
      id_ticket.push(item.ticket_id);
      evento_id.push(item.evento_id);
      OrdenServicioID.push(item.OrdenServicioID);
      tck_cliente.push(item.tck_cliente);
    }
    // await DeleteOrdenServicioID(OrdenServicioID);

    console.log("id_ticket", id_ticket);
    console.log("evento_id", evento_id);
    console.log("OrdenServicioID", OrdenServicioID);

    await deleteEquipoIDTicketArray(id_ticket);
    //para guardar los equipos por ticket
    console.log("guardar equipos por ticket", id_ticket.length);
    for (let index = 0; index < id_ticket.length; index++) {
      let item = id_ticket[index];
      console.log("item", item);
      console.log("index", index);
      console.log("\n");
      await EquipoTicket(item);
    }
    
    //Para buscar eventos anidadas a la orden
    await DeleteAnidada(evento_id)
    for (let index = 0; index < evento_id.length; index++) {
      let item = evento_id[index];
      let respOs = await OrdenServicioAnidadas(item);
      console.log("respOs", respOs);
      if (typeof respOs === "object") {
        // await DeleteOrdenServicioID(respOs);
        for (let index = 0; index < respOs.length; index++) {
          let item = respOs[index];
          console.log("item", item);

          await OSOrdenServicioID(item);
        }
      }
    }

    //para guardar lo que venga con OS
    for (let index = 0; index < OrdenServicioID.length; index++) {
      let item = OrdenServicioID[index];
      await OSOrdenServicioID(item);
    }

    var arrayRuc = "";
    //para verificar si hay evetos con cliente no registrado 247
    for (let index = 0; index < tck_cliente.length; index++) {
      let item = tck_cliente[index];
      const existe = await ExisteHistorialEquipoClienteNombre(item);
      if (existe) {
        console.log("existe", existe);
      } else {
        console.log("existe", existe);
        const sacarRuc = await GetClienteClienteName(item);
        // const sacarRuc = await GetClienteClienteName("COMPAÑIA ANONIMA CLINICA GUAYAQUIL SERVICIOS MEDICOS S.A.")
        console.log("sacarRuc", sacarRuc[0].CustomerID);
        arrayRuc += sacarRuc[0].CustomerID + "|";
      }
    }

    if (!isEmpty(arrayRuc)) {
      console.log("arrayRuc", arrayRuc);
      await HistorialEquipoPorCliente(arrayRuc);
    }
    
  }

  const UpdateLocal = async () => {
    try {
      const res = await BuscarOrdenServicioLocales();
      if (res) {
        for (let index = 0; index < res.length; index++) {
          let el = res[index];
          var idorden = el.OrdenServicioID;
          var evento_id = el.evento_id;
          if (el.OrdenServicioID.toString().length == 4) {
            var OS_PartesRepuestos = JSON.parse(el.OS_PartesRepuestos);
            for (let index = 0; index < OS_PartesRepuestos.length; index++) {
              OS_PartesRepuestos[index].OrdenServicioID = 0;
            }
            var OS_Tiempos = JSON.parse(el.OS_Tiempos);
            for (let index = 0; index < OS_Tiempos.length; index++) {
              OS_Tiempos[index].OrdenServicioID = 0;
            }
            var OS_Firmas = JSON.parse(el.OS_Firmas);
            for (let index = 0; index < OS_Firmas.length; index++) {
              OS_Firmas[index].OrdenServicioID = 0;
            }
            var OS_CheckList = JSON.parse(el.OS_CheckList);
            for (let index = 0; index < OS_CheckList.length; index++) {
              OS_CheckList[index].OrdenServicioID = 0;
            }
            el.OrdenServicioID = 0;
            delete el.OS_Anexos;
            delete el.OS_Colaboradores;
            delete el.OS_Encuesta;
  
            el.OS_PartesRepuestos = await SacarParte(idorden);;
            el.OS_Tiempos = await SacarTiempos(idorden);
            el.OS_Firmas = await SacarFirmas(idorden);
            el.OS_CheckList = await SacarCheckList(idorden);
            await time(100)
            let P = await PostOS(el, el.id, idorden, evento_id, el.es);
            if(el.Estado == "FINA"){
              const { token } = await getToken()
              const { status } = await axios.put(`https://technical.eos.med.ec/MSOrdenServicio/finalizar?idOrdenServicio=${P}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
              })
              console.log("status", status);
            }
          } else {
            console.log("id-------------------->",el.id)
            var OS_PartesRepuestos = await SacarParte(idorden);
            var OS_Tiempos = await SacarTiempos(idorden);
            var OS_Firmas = await SacarFirmas(idorden);
            console.log("OS_Firmas", OS_Firmas);
            var OS_CheckList = await SacarCheckList(idorden);
            var OS_Anexos =  await SacarAnexo(idorden);
            delete el.OS_Colaboradores;
            delete el.OS_Encuesta;
            el.OS_PartesRepuestos = OS_PartesRepuestos;
            el.OS_Tiempos = OS_Tiempos;
            el.OS_Firmas = OS_Firmas;
            el.OS_CheckList = OS_CheckList;
            el.OS_Anexos = OS_Anexos;
            await time(100)
            let P = await PutOS(el, el.OrdenServicioID);
            if(el.Estado == "FINA"){
              const { token } = await getToken()
              const { status } = await axios.put(`https://technical.eos.med.ec/MSOrdenServicio/finalizar?idOrdenServicio=${P}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
              })
              console.log("status", status);
            }
          }
        }
  
        return true;
      } else {
        return true;
      }
    } catch (error) {
      console.log("error", error);
      return false;      
    }
  };

  return (
    <>
      {/* <View style={styles.circlePrimary}>
        <View style={styles.circleSecond}>
          <TouchableOpacity
            style={{
              ...styles.circleTercer,
              opacity: 1,
            }}
            onPress={() => CrearNuevoOrdenServicioSinTiket()}
          >
            <Text style={{ color: "#FFF", fontSize: 30 }}>+</Text>
          </TouchableOpacity>
        </View>
      </View> */}

      <View style={{ ...styles.banner, paddingLeft: 20 }}>
        <TouchableOpacity onPress={ActualizarEventos}>
          <Fontisto
            name="cloud-refresh"
            size={25}
            color={!update ? "#FFF" : "#099E15"}
          />
          {update ? (
            <Text
              style={{
                color: !update ? "#FFF" : "#099E15",
                fontSize: 10,
              }}
            >
              {message}
            </Text>
          ) : null}
        </TouchableOpacity>
        {/* MODAL PARA SINCRONIZACION INICAL CUANDO SEABRE LA APLICACION */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            setModal(false);
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                width: "80%",
                height: "35%",
                backgroundColor: "#FFF",
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  padding: 10,
                  paddingHorizontal: 20,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  shadowColor: "#000",
                }}
              >
                <View
                  style={{
                    // flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    width: "100%",
                    padding: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "bold",
                      marginBottom: 10,
                    }}
                  >
                    Información
                  </Text>
                  <Text
                    style={{
                      marginBottom: 10,
                    }}
                  >
                    <AntDesign
                      name="infocirlceo"
                      size={40}
                      color="black"
                      style={{
                        marginRight: 10,
                      }}
                    />
                  </Text>
                </View>

                <Text style={{ fontSize: 15, fontWeight: "normal" }}>
                  Por favor espere mientras se sincronizan los datos.
                </Text>

                <Text style={{ fontSize: 15, fontWeight: "normal" }}>
                  Estado consultado si hay datos nuevos para descargar.
                </Text>

                <Text style={{ fontSize: 15, fontWeight: "normal" }}>
                  Se encontraron #{5} OS locales para sincronizar.
                </Text>
                {/* <LoadingActi loading={reloadInt} /> */}
              </View>
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
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
  },
  circlePrimary: {
    width: "100%",
    height: "10%",
    // backgroundColor: '#E0E16C',
    justifyContent: "center",
    alignItems: "flex-end",
    position: "absolute",
    bottom: "10%",
    left: -10,
    zIndex: 1,
  },
  circleSecond: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF",
    marginEnd: 20,
    zIndex: 2,
    top: 8,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    // bottom: 0,
  },
  circleTercer: {
    width: 90,
    height: 90,
    borderRadius: 50,
    backgroundColor: "#000",
    marginEnd: 20,
    zIndex: 3,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
});
