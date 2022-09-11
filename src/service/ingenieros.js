import { host } from "../utils/constantes";
import { getToken } from "./usuario";
import axios from "axios";
import db from "./Database/model";


export const getIngenieros = async () => {
    const url = `${host}webApiSegura/api/customers/ingeniero`;
    try {
        const { token } = await getToken()
        const { data, status } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return new Promise((resolve, reject) => {
            data.Response.map(async (r, i) => {
                await InserIngenieros(r)
            })
            resolve(true);
        });
    } catch (error) {
        console.log(error);
    }
}

async function InserIngenieros(r) {
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `INSERT INTO ingenieros (
                IdUsuario,
                NombreUsuario,
                cedula,
                adicional) VALUES (?,?,?,?)`,
            args: [
                Number(r.IdUsuario),
                String(r.NombreUsuario),
                String(r.cedula),
                Number(r.adicional)]
        }], false, (err, results) => {
            if (err) {
                console.log("error", err);
            } else {
                resolve(true)
                console.log("results ingenieros", results);
            }
        })
    })
}

export const getIngenierosStorage = async (IdUsuario, NombreUsuario) => {
    try {
        if (IdUsuario === "" && NombreUsuario === "") {
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from ingenieros', [], (_, { rows }) => {
                        resolve(rows._array)
                    });
                });
            });
        } else if (IdUsuario !== "" && NombreUsuario === "") {
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from ingenieros where IdUsuario = ?', [IdUsuario], (_, { rows }) => {
                        resolve(rows._array)
                    });
                });
            });
        } else if (IdUsuario === "" && NombreUsuario !== "") {
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from ingenieros where NombreUsuario = ?', [NombreUsuario], (_, { rows }) => {
                        resolve(rows._array)
                    });
                });
            });
        }
    } catch (error) {
        console.log(error);
    }
}

export const getIngenierosStorageById = async (adicional) => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('select * from ingenieros where adicional = ?', [adicional], (_, { rows }) => {
                    resolve(rows._array[0])
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
}