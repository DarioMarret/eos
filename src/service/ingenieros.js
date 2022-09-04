import { ingenieros, host } from "../utils/constantes";
import { getToken } from "./usuario";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";


export const getIngenieros = async () => {
    const url = `${host}MSCatalogo/api/ClienteByNombre`;
    try {
        const { token, userId } = await getToken()
        const { data, status } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (status === 200) {
            console.log(data);
            await setIngenierosStorage(JSON.stringify(data.Response))
        }
    } catch (error) {
        console.log(error);
    }
}





export const setIngenierosStorage = async (data) => {
    try {
        await AsyncStorage.setItem(ingenieros, data);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
export const getIngenierosStorage = async () => {
    try {
        const result = await AsyncStorage.getItem(ingenieros);
        return result ? JSON.parse(result) : null;
    } catch (error) {
        return null;
    }
}