import axios from "axios";
import { time } from "./CargaUtil";
import { InserOSOrdenServicioID } from "./OS_OrdenServicio";
import { getToken } from "./usuario";

export const PostOS = async (data) => {
    const { token } = await getToken()
    const url = `https://technical.eos.med.ec/MSOrdenServicio/ordenServicio`;
    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
    }
    let response = await fetch(url, params);
    let result = await response.json()
    await InserOSOrdenServicioID(result.Response)
    return result.Code
}

export const PutOS = async (data) => {
    console.log(typeof data)
    const { token } = await getToken()
    console.log("PutOS", data.OrdenServicioID)

    console.log("PutOS", data)

    try {
        const { status } = await axios.put(`https://technical.eos.med.ec/MSOrdenServicio/api/OS_OrdenServicio/${data.OrdenServicioID}`, data, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        console.log("PutOS", status)
        return status
    } catch (error) {
        console.log("PutOS", error)
        return false
    }
}

/**
 * 
 * @param {*} OrdenServicioID 
 * @returns 
 */
export const FinalizarOS = async (OrdenServicioID) => {
    const { token } = await getToken()
    return new Promise((resolve, reject) => {
        OrdenServicioID.map(async (item, index) => {
            const { status } = await axios.put(`https://technical.eos.med.ec/MSOrdenServicio/finalizar?idOrdenServicio=${item}`, {}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log("status", status)
        })
        resolve(200)
    })
}


// Language: javascript


// Path: src/service/OS_OrdenServicio.js



export const ParseOS = (data, accion) => {
    if (accion == "NUEVO OS TICKET") {

        data[0].OS_PartesRepuestos = JSON.parse(data[0].OS_PartesRepuestos)
        data[0].OS_CheckList = JSON.parse(data[0].OS_CheckList)
        data[0].OS_Tiempos = JSON.parse(data[0].OS_Tiempos)
        data[0].OS_Firmas = JSON.parse(data[0].OS_Firmas)
        data[0].OS_Colaboradores = []
        data[0].OrdenServicioID = 0
        data[0].OS_Encuesta = []
        data[0].OS_Anexos = []
        delete data[0].OS_FINALIZADA
        delete data[0].OS_ASUNTO
        data[0].Estado = "ACTI"
        delete data[0].codOS
        return data[0]

    } else if (accion == "PENDIENTE") {
        
        console.log("ParseOS PENDIENTE", data[0])
        data[0].OS_PartesRepuestos = []
        data[0].OS_CheckList = []
        data[0].OS_Tiempos = []
        data[0].OS_Firmas = []
        data[0].OS_Anexos = []
        data[0].OrdenServicioID = 0
        data[0].OS_Colaboradores = []
        data[0].OS_Encuesta = []
        data[0].Estado = "ACTI"
        delete data[0].OS_FINALIZADA
        delete data[0].OS_ASUNTO
        delete data[0].codOS
        return data[0]

    } else if (accion == "FINALIZADO") {
        
        data[0].OS_PartesRepuestos = JSON.parse(data[0].OS_PartesRepuestos)
        data[0].OS_CheckList = JSON.parse(data[0].OS_CheckList)
        data[0].OS_Tiempos = JSON.parse(data[0].OS_Tiempos)
        data[0].OS_Firmas = JSON.parse(data[0].OS_Firmas)
        data[0].OS_Colaboradores = []
        data[0].OS_Encuesta = []
        data[0].OS_Anexos = JSON.parse(data[0].OS_Anexos)
        return data[0]

    } else if (accion == "clonar") {
        
        data[0].OS_Tiempos = JSON.parse(data[0].OS_Tiempos)
        data[0].OS_PartesRepuestos = []
        data[0].OS_Colaboradores = []
        data[0].OrdenServicioID = 0
        data[0].OS_CheckList = []
        data[0].OS_Encuesta = []
        data[0].OS_Firmas = []
        data[0].OS_Anexos = []
        delete data[0].OS_FINALIZADA
        delete data[0].OS_ASUNTO
        data[0].Estado = "ACTI"
        delete data[0].codOS
        return data[0]

    }else if (accion == "FIRMAR") {
        
        data[0].OS_PartesRepuestos = JSON.parse(data[0].OS_PartesRepuestos)
        data[0].OS_CheckList = JSON.parse(data[0].OS_CheckList)
        data[0].OS_Tiempos = JSON.parse(data[0].OS_Tiempos)
        data[0].OS_Firmas = JSON.parse(data[0].OS_Firmas)
        data[0].OS_Colaboradores = []
        data[0].OS_Encuesta = []
        data[0].OS_Anexos = JSON.parse(data[0].OS_Anexos)
        return data[0]
    }else if (accion == "PROCESO") {
        
        data[0].OS_PartesRepuestos = JSON.parse(data[0].OS_PartesRepuestos)
        data[0].OS_CheckList = JSON.parse(data[0].OS_CheckList)
        data[0].OS_Tiempos = JSON.parse(data[0].OS_Tiempos)
        data[0].OS_Firmas = JSON.parse(data[0].OS_Firmas)
        data[0].OS_Colaboradores = []
        data[0].OS_Encuesta = JSON.parse(data[0].OS_Encuesta)
        data[0].OS_Anexos = JSON.parse(data[0].OS_Anexos)
        delete data[0].OS_ASUNTO
        delete data[0].OS_FINALIZADA

        return data[0]
    }
}

export const ESTADO = (accion) => {
    switch (accion) {
        case "clonar":
            return "ACTI"
        case "NUEVO OS TICKET":
            return "ACTI"
        case "PENDIENTE":
            return "TROC"
        case "OrdenSinTicket":
            return "ACTI"
        default:
            break;
    }
}