import { SacarOSasunto } from "./OS_OrdenServicio"
import { getToken } from "./usuario"
import axios from "axios"


/**
 * 
 * @param {*} Correo 
 * @param {*} OrdenServicioID 
 * @returns {
 * Message: string,
 * Status: string
 * }
 */
export const EnviarCorreo = async (Correo, OrdenServicioID) => {
    const { token } = await getToken()
    console.log(token)
    const { OS_ASUNTO, OS_Firmas, ClienteNombre } = await SacarOSasunto(OrdenServicioID)
    console.log(OS_ASUNTO, ClienteNombre)
    const { data } = await axios.post(`https://technical.eos.med.ec/WSEventos/api/Eventos/enviaCorreo`, {
        file: [],
        body: OS_ASUNTO,
        subject: `E.O.A. Servicios S.A - Orden de Servicio Nro ${OrdenServicioID} - Cliente: ${ClienteNombre}`,
        destinatario: Correo,
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const { Message, Status } = data
    console.log(Message)
    return { Message, Status }
} 