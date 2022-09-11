import { host } from "../utils/constantes";
import axios from "axios";
import db from "./Database/model";
import { getToken } from "./usuario";



export const getProvincias = async () => {
    const url = `${host}MSCatalogo/provincia`;
    try {
        const { token } = await getToken()
        const { data, status } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return new Promise((resolve, reject) => {
            data.Response.map(async (r, i) => {
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
                resolve(true);
                console.log("results provincias", results);
            }
        })
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