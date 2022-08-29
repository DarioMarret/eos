import { datos_ingenieros, hostBase, token } from '../utils/constantes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const GuardarToken = async (data) => {
    try {
        await AsyncStorage.setItem(token, JSON.stringify(data));
        return true;
    } catch (error) {
        console.log(error);
        return null;
    }
}
export const InfoUser = async (data) => {
    try {
        console.log("getUserInfo", JSON.stringify(data))
        const response = await AsyncStorage.setItem(datos_ingenieros, data)
        console.log("\n")
        console.log("getUserInfo_2", response)
        return true;
    } catch (error) {
        console.log(error)
        return null;
    }
}
export const getInfoUserLocal = async () => {
    try {
        const response = await AsyncStorage.getItem(datos_ingenieros);
        if (JSON.parse(response) != null) {
            return JSON.parse(response);
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}
export const getToken = async () => {
    try {
        const result = await AsyncStorage.getItem(token);
        return result;
    } catch (error) {
        return null;
    }
}
export const desLogeo = async () => {
    try {
        await AsyncStorage.removeItem(token);
        return true;
    } catch (error) {
        return false;
    }
}





// Login Register 
export const LoginForm = async (formData) => {
    try {
        const { data, status } = await axios.post(`${hostBase}/login/authenticate`, formData)
        if (status === 200) {
            const { success } = await getUserInfo(data.userId, data.token)
            if (success) {
                return {
                    ...data,
                    success: true
                }
            } else {
                return {
                    success: false,
                    message: "Error No se pudo obtener los datos del usuario"
                }
            }
        } else {
            return {
                success: false,
                message: "Erros al obtener el usuario"
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error
        }
    }
}
export const getUserInfo = async (userId, token) => {
    try {
        const { data, status } = await axios.get(`${hostBase}/customers/customer/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        })
        if (status === 200) {
            await InfoUser(JSON.stringify(data))
            
            return {
                success: true
            }
        } else {
            return {
                success: false,
                message: "Erros al obtener informacion del usuario"
            }
        }
    } catch (error) {
        return {
            success: false,
            message: error
        }
    }
}