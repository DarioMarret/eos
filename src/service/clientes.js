import { clientes, host } from "../utils/constantes";
import { getToken } from "./usuario";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";


export const getClientes = async () => {
    const url = `${host}MSCatalogo/ClienteByNombre`;
    try {
        const { token, userId } = await getToken()
        const { data, status } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (status === 200) {
            await setClientesStorage(JSON.stringify(data.Response))
        }
    } catch (error) {
        console.log(error);
    }
}





export const setClientesStorage = async (data) => {
    try {
        await AsyncStorage.setItem(clientes, data);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
export const getClientesStorage = async () => {
    try {
        const result = await AsyncStorage.getItem(clientes);
        return result ? JSON.parse(result) : null;
    } catch (error) {
        return null;
    }
}