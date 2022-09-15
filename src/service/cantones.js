import { host } from "../utils/constantes";
import { getToken } from "./usuario";
import db from "./Database/model";



export const getCantones = async () => {
    const url = `${host}MSCatalogo/canton`;
    try {
        const { token } = await getToken()
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const resultado = await response.json()
        const { Response } = resultado
        return new Promise((resolve, reject) => {
            Response.map(async (r) => {
                await InserCantones(r)
            })
            resolve(true)
        });
    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}
async function InserCantones(r) {
    const existe = await SelectCantones(r.id)
    if (!existe) {
        return new Promise((resolve, reject) => {
            db.exec([{
                sql: `INSERT INTO cantones (id,descripcion) VALUES (?,?)`,
                args: [r.id, r.descripcion]
            }], false, (err, results) => {
                if (err) {
                    console.log("error", err);
                } else {
                    console.log("results cantones", results);
                }
            })
            resolve(true);
        })
    } else {
        return true
    }
}
async function SelectCantones(id) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM cantones WHERE id = ?`,
                [id],
                (tx, results) => {
                    if (results.rows._array.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
        })
    })
}
export const getCantonesStorageBy = async (id) => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT * FROM cantones WHERE id = ?`,
                    [id],
                    (tx, results) => {
                        if (results.rows._array.length > 0) {
                            resolve(results)
                        } else {
                            resolve(false)
                        }
                    })
            })
        })
    } catch (error) {
        console.log("getCantonesStorageBy-->", error);
        return null;
    }
}