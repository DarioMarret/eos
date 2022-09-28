import axios from "axios";
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
    console.log("PostOS", result)
    await InserOSOrdenServicioID(result.Response)
    return result
}

export const PutOS = async (data) => {
    const { token } = await getToken()
    const url = `https://technical.eos.med.ec/MSOrdenServicio/ordenServicio/${data.OrdenServicioID}`;
    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
    };
    try {
        const response = await fetch(url, params);
        const result = await response.json()
        console.log("result", result)
        return result;
    } catch (error) {
        return error;
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