import { useCallback, useState } from 'react';
import Checkbox from 'expo-checkbox';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Image, ImageBackground, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Asset } from "expo-asset";
import logo from '../../assets/logo_eos.png';
import { AntDesign } from '@expo/vector-icons';
import useUser from '../hook/useUser';
import { LoginForm } from '../service/usuario';

export default function Login() {
  const [isChecked, setChecked] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    password: ""
  });

  const [visible, setVisible] = useState(false);
  const toggleAlert = useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  const { login } = useUser();

  const handleCheckboxChange = () => {
    setChecked(!isChecked);
  }
  const handleChange = (name, value) => {
    setUserData({ ...userData, [name]: value });
  }

  const handleLogin = async () => {
    setVisible(!visible);
    const data = await LoginForm(userData)
    if (data == false) {
      setVisible(!visible);
      setUserData({
        username: "",
        password: ""
      });
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
      }else{
        setVisible(!visible);
      }
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
              <View style={styles.modalView}>
                <ActivityIndicator size={100} color="#FF6B00" />
                <Text style={{ marginTop: 16, marginBottom: 32 }}>Cargando...</Text>
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
                onChangeText={(value) => handleChange("username", value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                secureTextEntry={true}
                onChangeText={(value) => handleChange("password", value)}
              />
            </View>

            {/* <View style={{
              width: '80%',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}>
              <View style={styles.section}>
                <Checkbox style={styles.checkbox} disabled value={isChecked} onValueChange={handleCheckboxChange} />
                <Text style={styles.paragraph}>Recordarme</Text>
              </View>
            </View> */}

            <View style={styles.section}>
              <TouchableOpacity
                onPress={handleLogin}
                style={{ backgroundColor: "#FF6B00", padding: 15, borderRadius: 15, paddingHorizontal: 50 }}>
                <Text style={{ fontSize: 16, color: '#FFF', fontFamily: 'Roboto', letterSpacing: 0.5 }}>INICIA SESIÓN
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
