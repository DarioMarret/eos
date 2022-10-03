import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { time } from "./CargaUtil";
import { InserOSOrdenServicioID, UpdateOSOrdenServicioID } from "./OS_OrdenServicio";
import { getToken } from "./usuario";

export const PostOS = async (data) => {
    try {
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
        console.log("result", result)
        if (result.Code == "200") {
            await InserOSOrdenServicioID(result.Response)
            await time(1000)
            return result.Code
        }
    } catch (error) {
        console.log("error en el post", error)
    }
}

export const PutOS = async (datos) => {
    console.log(typeof datos)
    const { token } = await getToken()
    console.log("PutOS", datos.OrdenServicioID)

    console.log("PutOS", datos)
    console.log("\n")

    try {
        const { data, status } = await axios.put(
            `https://technical.eos.med.ec/MSOrdenServicio/api/OS_OrdenServicio/${datos.OrdenServicioID}`,
            datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        console.log("PutOS", data)
        console.log("PutOS Status", status)
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

export const FinalizarOS_ = async (OrdenServicioID, datos) => {
    const OS_PartesRepuestos = JSON.parse(await AsyncStorage.getItem("OS_PartesRepuestos"))
    const OS_CheckList = JSON.parse(await AsyncStorage.getItem("OS_CheckList"))
    const OS_Tiempos = JSON.parse(await AsyncStorage.getItem("OS_Tiempos"))
    const OS_Anexos = JSON.parse(await AsyncStorage.getItem("OS_Anexos"))
    const OS_Firmas = JSON.parse(await AsyncStorage.getItem("OS_Firmas"))
    datos.OS_PartesRepuestos = OS_PartesRepuestos
    datos.OS_CheckList = OS_CheckList
    datos.OS_Tiempos = OS_Tiempos
    datos.OS_Firmas = OS_Firmas
    datos.OS_Colaboradores = []
    datos.OrdenServicioID = OrdenServicioID
    datos.OS_Encuesta = []
    datos.Estado = "FINA"
    console.log("FinalizarOS_", datos)
    datos.OS_Anexos = OS_Anexos
    const { token } = await getToken()
    try {
        const { data, status } = await axios.put(
            `https://technical.eos.med.ec/MSOrdenServicio/api/OS_OrdenServicio/${OrdenServicioID}`,
            datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        console.log("PutOS", data)
        console.log("PutOS Status", status)
        if (status == 204) {
            await FinalizarOS([OrdenServicioID])
            await UpdateOSOrdenServicioID(OrdenServicioID)
            return status
        } else {
            return false
        }
    } catch (error) {
        console.log("PutOS ERROR", error)
        return false
    }
}

export const FinalizarOSmasivo = async (OrdenServicioID, datos) => {
    const OS_PartesRepuestos = JSON.parse(await AsyncStorage.getItem("OS_PartesRepuestos"))
    const OS_CheckList = JSON.parse(await AsyncStorage.getItem("OS_CheckList"))
    const OS_Tiempos = JSON.parse(await AsyncStorage.getItem("OS_Tiempos"))
    const OS_Anexos = JSON.parse(await AsyncStorage.getItem("OS_Anexos"))
    const OS_Firmas = JSON.parse(await AsyncStorage.getItem("OS_Firmas"))
    datos.OS_PartesRepuestos = OS_PartesRepuestos
    datos.OS_CheckList = OS_CheckList
    datos.OS_Tiempos = OS_Tiempos
    datos.OS_Firmas = OS_Firmas
    datos.OS_Colaboradores = []
    datos.OrdenServicioID = OrdenServicioID
    datos.OS_Encuesta = []
    datos.Estado = "FINA"
    console.log("FinalizarOS_", datos)
    datos.OS_Anexos = OS_Anexos
    const { token } = await getToken()
    try {
        const { data, status } = await axios.put(
            `https://technical.eos.med.ec/MSOrdenServicio/api/OS_OrdenServicio/${OrdenServicioID}`,
            datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        console.log("PutOS", data)
        console.log("PutOS Status", status)
        if (status == 204) {
            await FinalizarOS([OrdenServicioID])
            await UpdateOSOrdenServicioID(OrdenServicioID)
            return status
        } else {
            return false
        }
    } catch (error) {
        console.log("PutOS ERROR", error)
        return false
    }
}

// Language: javascript


// Path: src/service/OS_OrdenServicio.js



export const ParseOS = async (data, accion) => {
    if (accion == "NUEVO OS TICKET") {

        await AsyncStorage.setItem("OS_PartesRepuestos", data[0].OS_PartesRepuestos)
        await AsyncStorage.setItem("OS_CheckList", data[0].OS_CheckList)
        await AsyncStorage.setItem("OS_Tiempos", data[0].OS_Tiempos)
        await AsyncStorage.setItem("OS_Anexos", data[0].OS_Anexos)
        await AsyncStorage.setItem("OS_Firmas", data[0].OS_Firmas)

        data[0].OS_PartesRepuestos = []
        data[0].OS_CheckList = []
        data[0].OS_Tiempos = []
        data[0].OS_Firmas = []
        data[0].OS_Colaboradores = []
        data[0].OrdenServicioID = 0
        data[0].OS_Encuesta = []
        data[0].OS_Anexos = []
        data[0].OS_FINALIZADA = ""
        data[0].OS_ASUNTO = ""
        data[0].Estado = "ACTI"
        data[0].codOS = ""
        return data[0]

    } else if (accion == "PENDIENTE") {

        // console.log("ParseOS PENDIENTE", data[0])
        console.log("OS_PartesRepuestos", data[0].OS_PartesRepuestos)
        await AsyncStorage.setItem("OS_PartesRepuestos", data[0].OS_PartesRepuestos)
        await AsyncStorage.setItem("OS_CheckList", data[0].OS_CheckList)
        await AsyncStorage.setItem("OS_Tiempos", data[0].OS_Tiempos)
        await AsyncStorage.setItem("OS_Anexos", data[0].OS_Anexos)
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

        await AsyncStorage.setItem("OS_PartesRepuestos", data[0].OS_PartesRepuestos)
        await AsyncStorage.setItem("OS_CheckList", data[0].OS_CheckList)
        await AsyncStorage.setItem("OS_Tiempos", data[0].OS_Tiempos)
        await AsyncStorage.setItem("OS_Anexos", data[0].OS_Anexos)
        await AsyncStorage.setItem("OS_Firmas", data[0].OS_Firmas)
        data[0].OS_PartesRepuestos = []
        data[0].OS_CheckList = []
        data[0].OS_Tiempos = []
        data[0].OS_Firmas = []
        data[0].OS_Colaboradores = []
        data[0].OS_Encuesta = []
        data[0].OS_Anexos = []
        return data[0]

    } else if (accion == "clonar") {
        console.log("ParseOS clonar", data[0].OS_Tiempos)
        data[0].OS_Tiempos[0].IdTiempo = 0
        await AsyncStorage.setItem("OS_Tiempos", data[0].OS_Tiempos)
        data[0].OS_Tiempos = []
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

    } else if (accion == "FIRMAR") {

        await AsyncStorage.setItem("FIRMADOR", JSON.stringify([]))
        await AsyncStorage.setItem("OS_PartesRepuestos", data[0].OS_PartesRepuestos)
        await AsyncStorage.setItem("OS_CheckList", data[0].OS_CheckList)
        await AsyncStorage.setItem("OS_Tiempos", data[0].OS_Tiempos)
        await AsyncStorage.setItem("OS_Anexos", data[0].OS_Anexos)
        await AsyncStorage.setItem("OS_Firmas", data[0].OS_Firmas)

        data[0].OS_PartesRepuestos = []
        data[0].OS_Colaboradores = []
        data[0].OS_CheckList = []
        data[0].OS_Encuesta = []
        data[0].OS_Tiempos = []
        data[0].OS_Firmas = []
        data[0].OS_Anexos = []
        return data[0]

    } else if (accion == "PROCESO") {

        console.log("ParseOS PROCESO", data[0].OS_CheckList)

        await AsyncStorage.setItem("OS_PartesRepuestos", data[0].OS_PartesRepuestos)
        await AsyncStorage.setItem("OS_CheckList", data[0].OS_CheckList)
        await AsyncStorage.setItem("OS_Tiempos", data[0].OS_Tiempos)
        await AsyncStorage.setItem("OS_Anexos", data[0].OS_Anexos)
        await AsyncStorage.setItem("OS_Firmas", data[0].OS_Firmas)

        data[0].OS_PartesRepuestos = []
        data[0].OS_Colaboradores = []
        data[0].OS_CheckList = []
        data[0].OS_Encuesta = []
        data[0].OS_Tiempos = []
        data[0].OS_Firmas = []
        data[0].OS_Anexos = []
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
            return "ACTI"
        case "OrdenSinTicket":
            return "ACTI"
        default:
            break;
    }
}