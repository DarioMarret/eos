import { host } from "../utils/constantes";
import axios from "axios";
import db from "./Database/model";
import { getToken } from "./usuario";



export const getCantones = async () => {
    const url = `${host}MSCatalogo/canton`;
    try {
        const { token } = await getToken()
        const { data, status } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return new Promise((resolve, reject) => {
            data.Response.map(async (r, i) => {
                await InserCantones(r)
            })
            resolve(true);
        });
    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}
async function InserCantones(r) {
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `INSERT INTO cantones (id,descripcion) VALUES (?,?)`,
            args: [String(r.id),String(r.descripcion)]
        }], false, (err, results) => {
            if (err) {
                console.log("error", err);
            } else {
                resolve(true);
                console.log("results cantones", results);
            }
        })
    })
}

export const getCantonesStorageBy = async (id) => {
    try {
        return new Promise((resolve, reject) => {
            db.exec([{
                sql: `SELECT * FROM cantones WHERE id = ?`,
                args: [id]
            }], false, (err, results) => {
                if (err) {
                    console.log("error", err);
                } else {
                    resolve(results);
                    console.log("results cantones", results);
                }
            })
        })
    } catch (error) {
        console.log("getCantonesStorageBy-->", error);
        return null;
    }
}