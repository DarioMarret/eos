import NetInfo from '@react-native-community/netinfo';
import Firmador from './src/components/Firmador'
import DrawerNavigation from './src/navigation/Navigation'
import Login from './src/screens/Login'
import userContext from "./src/context/userContext"
import jwtDecode from "jwt-decode"
import { useEffect, useMemo, useState } from 'react'
import { desLogeo, getToken, GuardarToken, RefresLogin } from './src/service/usuario'
import './src/service/Database/model'

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
    if (state.isConnected === true && Token) {
        RefresLogin().then(() => {
        console.log("Refrescado")
      })
    }
    console.log('Connection type', state.type);
    console.log('Is connected?', state.isConnected);
  });

  const login = async (data) => {
    await GuardarToken(data)
    setToken(jwtDecode(data.token))
  }

  const logout = async () => {
    setToken(null)
    await desLogeo();
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
      {Token ? (
        <DrawerNavigation />
      ) : (
        <Login />
      )}
    </userContext.Provider>
  )

}

