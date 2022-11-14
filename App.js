import DrawerNavigation from "./src/navigation/Navigation";
import Login from "./src/screens/Login";
import userContext from "./src/context/userContext";
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { useEffect, useMemo, useState } from "react";

import {
  desLogeo,
  getToken,
  GuardarToken,
  RefresLogin,
} from "./src/service/usuario";
import {
  CardaUtil,
  time,
  TrucateTable,
  TrucateUpdate,
} from "./src/service/CargaUtil";
import { StatusBar } from "expo-status-bar";
import { MenuProvider } from "react-native-popup-menu";
import { NetworkProvider } from "react-native-offline";
import { Provider as StoreProvider } from "react-redux";
import store from "./src/redux/store";
import {
  ExisteHistorialEquipoClienteNombre,
  HistorialEquipoIngeniero,
  HistorialEquipoPorCliente,
} from "./src/service/historiaEquipo";
import { GetEventosByTicket, GetEventosDelDia } from "./src/service/OSevento";
import moment from "moment";
import { deleteEquipoIDTicketArray, EquipoTicket } from "./src/service/equipoTicketID";
import {  OrdenServicioAnidadas } from "./src/service/OrdenServicioAnidadas";
import { DeleteOrdenServicioID, OSOrdenServicioID } from "./src/service/OS_OrdenServicio";
import { GetClienteClienteName } from "./src/service/clientes";
import axios from "axios";
import isEmpty from "is-empty";

const isConnection = axios.create({
  baseURL:
    "https://technical.eos.med.ec/MSOrdenServicio/getVerificaLlegada",
  timeout: 60,
});

const theme = {
  ...DefaultTheme,
  myOwnProperty: true,
  colors: {
    myOwnColor: "#FF6B00",
    primary: "#FF6B00",
  },
  animation: {
    scale: 0.3,
  },
  font: {
    family: "Roboto",
    size: 16,
  },
};

export default function App() {
  const [Token, setToken] = useState(undefined);
  const [reloadInt, setreloadInt] = useState(false);


  useEffect(() => {
    (async () => {
      const jwt = await getToken();
      if (jwt) {
        await SincronizarInit()
        setToken(jwt);
      } else {
        setToken(null);
      }
    })();
  }, []);

  async function SincronizarInit() {
    try {
      const { data } = await isConnection.get();
      // console.log(data)
      if (data) {
        const { token } = await getToken();
        console.log("token SincronizarInit", token);
        if (token != null) {
          await RefresLogin();
          // await TrucateUpdate();
          // await HistorialEquipoIngeniero()
          await GetEventosDelDia();//
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
          await DeleteOrdenServicioID(OrdenServicioID);

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
          // await DeleteAnidada(evento_id)
          for (let index = 0; index < evento_id.length; index++) {
            let item = evento_id[index];
            let respOs = await OrdenServicioAnidadas(item);
            console.log("respOs", respOs);
            if (typeof respOs === "object") {
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
          // Alert.alert("Sincronización exitosa");
          return true;
        } else {
          return true;
        }
      }
    } catch (error) {
      console.log(error);
      setToken(null);
      return true;
    }
  }

  const login = async (data) => {
    return new Promise((resolve, reject) => {
      CardaUtil().then(() => {
        GuardarToken(data).then(() => {
          setToken(data);
          resolve(true);
        });
      });
    });
  };

  const logout = async () => {
    return new Promise((resolve, reject) => {
      TrucateTable().then(() => {
        desLogeo().then(() => {
          setToken(null);
          resolve(true);
        });
      });
    });
  };

  const UserData = useMemo(
    () => ({
      setreloadInt,
      reloadInt,
      Token,
      login,
      logout,
    }),
    []
  );

  if (Token === undefined) return null;

  return (
    <StoreProvider store={store}>
      <NetworkProvider>
        <userContext.Provider value={UserData}>
          <PaperProvider theme={theme}>
            <MenuProvider>
              <StatusBar style="auto" />
              {Token ? <DrawerNavigation /> : <Login />}
            </MenuProvider>
          </PaperProvider>
        </userContext.Provider>
      </NetworkProvider>
    </StoreProvider>
  );
}
