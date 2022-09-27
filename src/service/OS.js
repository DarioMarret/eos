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
    const url = `https://technical.eos.med.ec/MSOrdenServicio/finalizar?idOrdenServicio=${OrdenServicioID}`;
    const params = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }
    try {
        const response = await fetch(url, params);
        const result = await response.json()
        console.log("result", result)
        return result;
    } catch (error) {
        return error;
    }
}