import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { OS } from "../utils/constantes";
import { ActualizaOrdenServicioIDOrdenServicioAnidadas, EliminarEventoAnidado, OrdenServicioAnidadas } from "./OrdenServicioAnidadas";
import { AactualizarEventos } from "./OSevento";
import { ActualizarOrdenServicioRespuesta, ActualizarOrdenServicioRespuestaPUT, InserOSOrdenServicioID, SelectOSOrdenServicioID, UpdateOSOrdenServicioID } from "./OS_OrdenServicio";
import { getToken } from "./usuario";

const isConnectionPOST = axios.create({
    baseURL:
      "https://technical.eos.med.ec/MSOrdenServicio/getVerificaLlegada",
    timeout: 100,
  });

  /**
   * 
   * @param {*} data 
   * @param {*} id 
   * @param {*} idorden 
   * @param {*} evento_id 
   * @param {*} es 
   * @returns 
   */
export const PostOS = async (data, id, idorden, evento_id, es) => {
    try {
        console.log("data", data)
        const { token } = await getToken()
        // const url = `https://technical.eos.med.ec/MSOrdenServicio/ordenServicio`;
        const url = `https://technical.eos.med.ec/MSOrdenServicio/OrdenServicioAppM `;
        const params = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
            timeout: 100,
        }
        let response = await fetch(url, params);
        let result = await response.json()
        if (result.Code == "200") {
            const { OrdenServicioID, EstadoEquipo, OS_FINALIZADA, Estado } = result.Response
            var estado = Estado == "FINA" ? "FINALIZADO" : "PROCESO"
            //inserta el id de la orden de servicio
            await ActualizarOrdenServicioRespuesta(OrdenServicioID, EstadoEquipo, OS_FINALIZADA, Estado, id)
            if(es == "ANI"){

                await EliminarEventoAnidado(idorden)


                await OrdenServicioAnidadas(evento_id)
                //acualizar el vento de la orden de servicio anidada

                // await ActualizaOrdenServicioIDOrdenServicioAnidadas(estado,"UPDATE", OrdenServicioID, idorden)
            }else{
                //actualiza el id de la orden de servicio en los eventos
                await AactualizarEventos(estado, OrdenServicioID, idorden)
            }

            return OrdenServicioID
        }
    } catch (error) {
        console.log("error en el post", error)
        return false
    }
}

/**
 * 
 * @param {*} datos 
 * @param {*} OrdenServicioID 
 * @returns 
 */
export const PutOS = async (datos, OrdenServicioID) => {
    const { token } = await getToken()
    console.log("\n")
    try {
        const { data, status } = await axios.put(
            // `https://technical.eos.med.ec/MSOrdenServicio/api/OS_OrdenServicio/${datos.OrdenServicioID}`,
            `https://technical.eos.med.ec/MSOrdenServicio/OrdenServicioAppM?id=${OrdenServicioID}`,
            datos, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            timeout: 100,
        })
        if (data.Code == "200") {
            const { OrdenServicioID, EstadoEquipo, OS_FINALIZADA, Estado } = data.Response
            var estado = Estado == "FINA" ? "FINALIZADO" : "PROCESO"
            //inserta el id de la orden de servicio
            await ActualizarOrdenServicioRespuestaPUT(OrdenServicioID, EstadoEquipo, OS_FINALIZADA, Estado)
            // if(es == "ANI"){
                // await EliminarEventoAnidado(idorden)
                // await OrdenServicioAnidadas(item)
                //acualizar el vento de la orden de servicio anidada
                // await ActualizaOrdenServicioIDOrdenServicioAnidadas(estado,"UPDATE", OrdenServicioID, evento_id)
            // }else{
                //actualiza el id de la orden de servicio en los eventos
                // await AactualizarEventos(estado, OrdenServicioID, evento_id)
            // }

            return OrdenServicioID
        }



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
    console.log("FinalizarOS", OrdenServicioID)
    const { token } = await getToken()
    for (let index = 0; index < OrdenServicioID.length; index++) {
        let item = OrdenServicioID[index];
        const os = await SelectOSOrdenServicioID(item)
        const OS_PartesRepuestos = JSON.parse(os[0].OS_PartesRepuestos)
        const OS_CheckList = JSON.parse(os[0].OS_CheckList)
        const OS_Tiempos = JSON.parse(os[0].OS_Tiempos)
        const OS_Anexos = JSON.parse(os[0].OS_Anexos)
        const OS_Firmas = JSON.parse(os[0].OS_Firmas)
        os[0].OS_PartesRepuestos = OS_PartesRepuestos
        os[0].OS_CheckList = OS_CheckList
        os[0].OS_Tiempos = OS_Tiempos
        os[0].OS_Firmas = OS_Firmas
        os[0].OS_Colaboradores = []
        os[0].OS_Encuesta = []
        os[0].OS_ASUNTO = ""
        os[0].OS_FINALIZADA = ""
        os[0].Estado = "FINA"
        os[0].OS_Anexos = OS_Anexos
        try {
            const { data, status } = await axios.put(
                `https://technical.eos.med.ec/MSOrdenServicio/api/OS_OrdenServicio/${os[0].OrdenServicioID}`,
                os[0], {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log("PutOS", data)
            console.log("PutOS Status", status)
        } catch (error) {
            console.log("PutOS ERROR", error)
            return 300
        }
    }
    for (let index = 0; index < OrdenServicioID.length; index++) {
        const item = OrdenServicioID[index];
        console.log("item actualizar fina", item)
        const { status } = await axios.put(`https://technical.eos.med.ec/MSOrdenServicio/finalizar?idOrdenServicio=${item}`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        console.log("status", status)
    }
    return 200
}

export const FinalizarOS_ = async (OrdenServicioID) => {
    const parse = await SelectOSOrdenServicioID(OrdenServicioID)
    const OS_PartesRepuestos = JSON.parse(parse[0].OS_PartesRepuestos)
    const OS_CheckList = JSON.parse(parse[0].OS_CheckList)
    const OS_Tiempos = JSON.parse(parse[0].OS_Tiempos)
    const OS_Anexos = JSON.parse(parse[0].OS_Anexos)
    const OS_Firmas = JSON.parse(parse[0].OS_Firmas)
    parse[0].OS_PartesRepuestos = OS_PartesRepuestos
    parse[0].OS_CheckList = OS_CheckList
    parse[0].OS_Tiempos = OS_Tiempos
    parse[0].OS_Firmas = OS_Firmas
    parse[0].OS_Colaboradores = []
    parse[0].OS_Encuesta = []
    parse[0].OS_ASUNTO = ""
    parse[0].OS_FINALIZADA = ""
    parse[0].Estado = "FINA"
    parse[0].OS_Anexos = OS_Anexos
    const { token } = await getToken()
    try {
        const { data, status } = await axios.put(
            `https://technical.eos.med.ec/MSOrdenServicio/api/OS_OrdenServicio/${OrdenServicioID}`,
            parse[0], {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        console.log("PutOS", data)
        console.log("PutOS Status", status)
        if (status == 204) {
            await FinalizarOS([OrdenServicioID])
            await UpdateOSOrdenServicioID([OrdenServicioID])
            return status
        } else {
            return false
        }
    } catch (error) {
        console.log("PutOS ERROR", error)
        return false
    }
}

export const FinalizarOSmasivo = async (OrdenServicioID) => {
    const parse = await SelectOSOrdenServicioID(OrdenServicioID)
    const OS_PartesRepuestos = JSON.parse(parse[0].OS_PartesRepuestos)
    const OS_CheckList = JSON.parse(parse[0].OS_CheckList)
    const OS_Tiempos = JSON.parse(parse[0].OS_Tiempos)
    const OS_Anexos = JSON.parse(parse[0].OS_Anexos)
    const OS_Firmas = JSON.parse(parse[0].OS_Firmas)
    parse[0].OS_PartesRepuestos = OS_PartesRepuestos
    parse[0].OS_CheckList = OS_CheckList
    parse[0].OS_Tiempos = OS_Tiempos
    parse[0].OS_Firmas = OS_Firmas
    parse[0].OS_Colaboradores = []
    parse[0].OS_Encuesta = []
    parse[0].OS_ASUNTO = ""
    parse[0].OS_FINALIZADA = ""
    parse[0].Estado = "FINA"
    parse[0].OS_Anexos = OS_Anexos
    const { token } = await getToken()
    try {
        const { data, status } = await axios.put(
            `https://technical.eos.med.ec/MSOrdenServicio/api/OS_OrdenServicio/${OrdenServicioID}`,
            parse[0], {
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
