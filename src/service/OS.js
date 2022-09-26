import { getToken } from "./usuario";

export const PostOS = async (data) => {

    const { token } = await getToken()
    console.log(token)
    const url = `https://technical.eos.med.ec/MSOrdenServicio/ordenServicio`;
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