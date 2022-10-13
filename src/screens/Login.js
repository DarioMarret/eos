import { useCallback, useState } from 'react';
import Checkbox from 'expo-checkbox';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Asset } from "expo-asset";
import logo from '../../assets/logo_eos.png';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import useUser from '../hook/useUser';
import { LoginForm } from '../service/usuario';
import { useIsConnected } from 'react-native-offline';

export default function Login() {
  const [isChecked, setChecked] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    password: ""
  });

  const [errorLog, setErrorLog] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sinconexion, setSinConexion] = useState(false);
  const toggleAlert = useCallback(() => {
    setVisible(!visible);
  }, [visible])


  const { login } = useUser()
  const isConnected = useIsConnected()

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  }
  const handleChange = (name, value) => {
    setUserData({ ...userData, [name]: value });
  }

  const handleLogin = async () => {
    if (isConnected) {
      setVisible(!visible);
      const data = await LoginForm(userData)
      console.log("LoginForm-->", data)
      if (data.success == false) {
        setUserData({
          username: "",
          password: ""
        });
        setVisible(false);
        setErrorLog(true)
        return;
      } else {
        const r = await login(data)
        if (r == false) {
          setVisible(!visible);
          setUserData({
            username: "",
            password: ""
          });
          return;
        } else {
          setVisible(!visible);
        }
      }
    } else {
      setSinConexion(true)
      setTimeout(() => {
        setSinConexion(false)
      }, 2000);
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={{ uri: Asset.fromModule(require("../../assets/bg_logo.png")).uri }} style={styles.image}>
        <StatusBar style="auto" />
        <ScrollView>

          <Modal
            animationType="slide"
            visible={visible}
            transparent={true}
            style={{ backgroundColor: 'white' }}
          >
            <View style={styles.centeredView}>
              <View style={{
                ...styles.modalView,
                width: '80%',
              }}>
                <ActivityIndicator size={100} color="#FF6B00" />
                <Text style={{ marginTop: 16, marginBottom: 32 }}>Cargando...</Text>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            visible={sinconexion}
            transparent={true}
            style={{ backgroundColor: 'white' }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Ionicons name="cloud-offline" size={30} color="#FF6B00" />
                <Text style={{ marginTop: 16, marginBottom: 32 }}>Sin conexion a internet</Text>
              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            visible={errorLog}
            transparent={true}
            style={{
              backgroundColor: 'white'
            }}
          >
            <View style={styles.centeredView}>
              <View style={{ ...styles.modalView, height: 'auto' }}>
                <Text style={{ fontSize: 20, color: '#FF6B00', fontWeight: 'bold' }}>Usuario o contraseña incorrectos.</Text>
                <Text style={{ marginTop: 20 }} onPress={() => setErrorLog(false)} >
                  <AntDesign name="closecircle" size={30} color="#FF6B00" />
                </Text>
              </View>

            </View>
          </Modal>

          <View style={styles.contentLogin}>
            <View style={styles.logo}>
              <Image source={logo} style={{ width: 200, height: 100 }} />
            </View>
            <View style={styles.logoInpust}>
              <View style={{ paddingBottom: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Bienvenido.</Text>
                <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>Para continuar, ingrese su credenciales.</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Usuario"
                value={userData.username}
                onChangeText={(value) => handleChange("username", value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                value={userData.password}
                secureTextEntry={true}
                onChangeText={(value) => handleChange("password", value)}
              />
            </View>
            <View style={styles.section}>
              <TouchableOpacity
                onPress={handleLogin}
                style={{ backgroundColor: "#FF6B00", padding: 15, borderRadius: 15, paddingHorizontal: 50 }}>
                <Text style={{ fontSize: 16, color: '#FFF', fontFamily: 'Roboto', letterSpacing: 0.5 }}>INICIAR SESION
                  <AntDesign name="arrowright" size={16} color="#FFF" />
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <TouchableOpacity
              onPress={() => console.log('Hello, world!')}
              style={styles.btnOlvidastePass}>
              <Text style={{ fontSize: 16, color: '#FF6B00', fontFamily: 'Roboto', }}>¿Olvidaste la contraseña?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: "contain",
  },
  contentLogin: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: 550,
    margin: 20,
    marginTop: '30%',
    // marginBottom: '10%',
    borderRadius: 25,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4
  },
  btnOlvidastePass: {
    borderWidth: 0.5,
    borderColor: '#FF6B00',
    borderRadius: 10,
    paddingHorizontal: '5%',
    padding: 7,
    marginBottom: '20%',
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#FF6B00',
    borderRadius: 10,
    width: 250,
    paddingHorizontal: '5%',
    padding: 10,
    marginBottom: '5%',
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '10%',
  },
  logoInpust: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  paragraph: {
    fontSize: 12,
  },
  checkbox: {
    margin: 8,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '30%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 9,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});