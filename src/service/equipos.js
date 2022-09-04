import axios from "axios";
import { equipos, host } from "../utils/constantes";
import { getToken } from "./usuario";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const getEquipos = async () => {
    const url = `${host}MSCatalogo/api/TiposEquipos`;
    try {
        const { token, userId } = await getToken()
        const { data, status } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (status === 200) {
            await setEquiposStorage(JSON.stringify(data.Response))
        }
        return true
    } catch (error) {
        console.log(error);
    }
}




export const setEquiposStorage = async (data) => {
    try {
        await AsyncStorage.setItem(equipos, data);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
export const getEquiposStorage = async () => {
    try {
        const result = await AsyncStorage.getItem(equipos);
        return result ? JSON.parse(result) : null;
    } catch (error) {
        return null;
    }
}