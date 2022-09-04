import axios from "axios";
import { modelo, host } from "../utils/constantes";
import { getToken } from "./usuario";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const getModeloEquipos = async () => {
    const url = `${host}MSCatalogo/api/ModelosEquipos`;
    try {
        const { token, userId } = await getToken()
        const { data, status } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (status === 200) {
            await setModeloEquiposStorage(JSON.stringify(data.Response))
        }
    } catch (error) {
        console.log(error);
    }
}




export const setModeloEquiposStorage = async (data) => {
    try {
        await AsyncStorage.setItem(modelo, data);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
export const getModeloEquiposStorage = async () => {
    try {
        const result = await AsyncStorage.getItem(modelo);
        return result ? JSON.parse(result) : null;
    } catch (error) {
        return null;
    }
}