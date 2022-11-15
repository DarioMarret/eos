import axios from "axios"
import { getToken } from "./usuario"
export const GetCorreos = async (ClienteID, OrdenServicioID) => {
    console.log('GetCorreos', ClienteID)
    console.log('GetCorreos OrdenServicioID',  OrdenServicioID)
    try {
        const { token } = await getToken()
        const InstanceAxios = axios.create({
            baseURL: "https://technical.eos.med.ec/MSOrdenServicio/correos",
            timeout: 1000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const { data } = await InstanceAxios.get(`?ruc=${ClienteID}&ordServ=${OrdenServicioID}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return data
    } catch (error) {
        return []        
    }
}