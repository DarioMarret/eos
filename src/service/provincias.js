import { host } from "../utils/constantes";
import { getToken } from "./usuario";
import db from "./Database/model";



export const getProvincias = async () => {
    const url = `${host}MSCatalogo/provincia`;
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
            Response.map(async (r, i) => {
                await InserProvincias(r)
            })
            resolve(true);
        });
    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}
async function InserProvincias(r) {
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `INSERT INTO provincias (id,descripcion) VALUES (?,?)`,
            args: [String(r.id),String(r.descripcion)]
        }], false, (err, results) => {
            if (err) {
                console.log("error", err);
            } else {
                console.log("results provincias", results);
            }
        })
        resolve(true);
    })
}

export const getProvinciasStorageBy = async (id) => {
    try {
        console.log("id provincia que se consultara",id)
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM provincias WHERE id = ?', [id], (_, { rows }) => {
                    resolve(rows._array);
                });
            });
        })
    } catch (error) {
        console.log("getProvinciasStorageBy-->", error);
        return null;
    }
}