import DrawerNavigation from './src/navigation/Navigation'
import Login from './src/screens/Login'
import userContext from "./src/context/userContext"
import { MD3LightTheme as DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { useEffect, useMemo, useState } from 'react'
import { desLogeo, getToken, GuardarToken } from './src/service/usuario'
import { CardaUtil, TrucateTable } from './src/service/CargaUtil';
import { StatusBar } from 'expo-status-bar';
import { MenuProvider } from 'react-native-popup-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OS, OS_Anexos, OS_CheckList, OS_Firmas, OS_PartesRepuestos, OS_Tiempos } from './src/utils/constantes';

const theme = {
  ...DefaultTheme,
  myOwnProperty: true,
  colors: {
    myOwnColor: '#FF6B00',
    primary: '#FF6B00',
  },
  animation: {
    scale: 0.3
  },
  font: {
    family: 'Roboto',
    size: 16,
  }
};
export default function App() {


  const [Token, setToken] = useState(undefined);

  useEffect(() => {
    (async () => {
      const jwt = await getToken();
      if (jwt) {
        setToken(jwt)
      } else {
        await AsyncStorage.setItem("OS_PartesRepuestos", JSON.stringify(OS_PartesRepuestos))
        await AsyncStorage.setItem("OS_CheckList", JSON.stringify(OS_CheckList))
        await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
        await AsyncStorage.setItem("OS_Firmas", JSON.stringify(OS_Firmas))
        await AsyncStorage.setItem("OS_Anexos", JSON.stringify(OS_Anexos))
        await AsyncStorage.setItem("OS", JSON.stringify(OS))
        setToken(null)
      }
    })()
  }, [])

  const login = async (data) => {
    return new Promise((resolve, reject) => {
      CardaUtil().then(() => {
        GuardarToken(data).then(() => {
          setToken(data)
          resolve(true)
        })
      })
    })
  }

  const logout = async () => {
    return new Promise((resolve, reject) => {
      TrucateTable().then(() => {
        desLogeo().then(() => {
          setToken(null)
          resolve(true)
        })
      })
    })
  }

  const UserData = useMemo(
    () => ({
      Token,
      login,
      logout
    }), []
  )

  if (Token === undefined) return null;

  return (
    // <Firmador/>
    <userContext.Provider value={UserData}>
      <PaperProvider theme={theme}>
        <MenuProvider>
          <StatusBar style="auto" />
          {Token ? (
            <DrawerNavigation />
          ) : (
            <Login />
          )}
        </MenuProvider>
      </PaperProvider>
    </userContext.Provider>
  )

}

