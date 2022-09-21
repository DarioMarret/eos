import NetInfo from '@react-native-community/netinfo';
import DrawerNavigation from './src/navigation/Navigation'
import Login from './src/screens/Login'
import userContext from "./src/context/userContext"
import jwtDecode from "jwt-decode"
import { useEffect, useMemo, useState } from 'react'
import { desLogeo, getToken, GuardarToken, RefresLogin } from './src/service/usuario'
import { CardaUtil, TrucateTable } from './src/service/CargaUtil';
import { StatusBar } from 'expo-status-bar';
import { MenuProvider } from 'react-native-popup-menu';


export default function App() {


  const [Token, setToken] = useState(undefined);

  useEffect(() => {
    (async () => {
      const jwt = await getToken();
      if (jwt) {
        setToken(jwt)
      } else {
        setToken(null)
      }
    })()
  }, [])

  NetInfo.fetch().then(state => {
    // if (state.isConnected === true && Token) {
    //     RefresLogin().then(() => {
    //     console.log("Refrescado")
    //   })
    // }
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
  });

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
      <MenuProvider>
        <StatusBar style="auto" />
        {Token ? (
          <DrawerNavigation />
        ) : (
          <Login />
        )}
      </MenuProvider>
    </userContext.Provider>
  )

}

