import { datos_ingenieros, hostBase, token, USER } from '../utils/constantes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import { CardaUtil } from './CargaUtil';

export const GuardarToken = async (data) => {
    try {
        await AsyncStorage.setItem(token, JSON.stringify(data));
        return true;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const setdataUser = async (data) => {
    try {
        await AsyncStorage.setItem(USER, JSON.stringify(data));
        return true;
    } catch (error) {
        return null;
    }
}
export const getdataUser = async () => {
    try {
        const result = await AsyncStorage.getItem(USER);
        return result ? JSON.parse(result) : null;
    } catch (error) {
        return null;
    }
}

export const InfoUser = async (data) => {
    try {
        await AsyncStorage.setItem(datos_ingenieros, data)
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

/**
 * 
 * @returns {
 * token: string,
 * userId: string,
 * cedula: string,
 * IdUsuario: number
 * }
 */
export const getToken = async () => {
    try {
        const result = await AsyncStorage.getItem(token);
        return result ? JSON.parse(result) : null;
    } catch (error) {
        console.log("getToken-->", error)
        return null;
    }
}
/**
 * 
 * @returns true
 */
export const desLogeo = async () => {
    try {
        await AsyncStorage.removeItem(token);
        await AsyncStorage.removeItem(USER);
        return true;
    } catch (error) {
        return false;
    }
}

export const Byingeniero = async (userId, token) => {
    try {
        var config = {
            method: 'get',
            url: 'https://technical.eos.med.ec/webApiSegura/api/customers/ingeniero',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        const { data: { Response } } = await axios(config)
        return new Promise((resolve, reject) => {
            Response.map(async (r, i) => {
                if (r.adicional == userId) {
                    resolve(r.IdUsuario)
                }
            })
        })
    } catch (error) {
        console.log("Byingeniero errores", error)
        return null;
    }
}

// Login Register 
export const LoginForm = async (formData) => {
    try {
        console.log(formData)
        const response = await fetch('https://technical.eos.med.ec/webApiSegura/api/login/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        const resultado = await response.json();
        if ("Message" in resultado) {
            return {
                success: false,
                message: "Erros al obtener el usuario"
            }
        }
        console.log("Message-->", resultado.Message)
        const { token, userId } = resultado;
        if (token) {
            console.log("Token obtenido-->", token)
            console.log("\n")
            const IdUsuario = await Byingeniero(userId, token)
            const { success } = await getUserInfo(userId, token)
            if (success) {
                console.log("IdUsuario-->", IdUsuario)
                console.log("\n")
                let info = { ...resultado, IdUsuario }
                if (await GuardarToken(info)) {
                    await setdataUser(formData)
                    return {
                        ...resultado,
                        success: true
                    }
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

export const RefresLogin = async () => {
    const refres = await getdataUser()
    const { data, status } = await axios.post(`${hostBase}/login/authenticate`, refres)
    if (status === 200) {
        const { IdUsuario } = await getToken()
        await GuardarToken({ ...data, IdUsuario })
    }
}