// import { SacarOSasunto } from "./OS_OrdenServicio"
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
    console.log("enviar por correo", Correo, OrdenServicioID)
    const { data, status } = await axios.post(`https://technical.eos.med.ec/MSOrdenServicio/enviaCorreoOs`, {
        // file: [OS_FINALIZADA],
        // body: OS_ASUNTO,
        // subject: `E.O.A. Servicios S.A - Orden de Servicio Nro ${OrdenServicioID} - Cliente: ${ClienteNombre}`,
        // destinatario: Correo,
        OrdenServicioID,
        correos: Correo
    }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    console.log("respuesta--> ",data, "RESPUESTA STATUS",status)
    const { Message } = data
    console.log(Message)
    return status
} 