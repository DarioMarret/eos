import { host } from "../utils/constantes";
import { getToken } from "./usuario";
import db from "./Database/model";


export const getIngenieros = async () => {
    const url = `${host}webApiSegura/api/customers/ingeniero`;
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
        for (let index = 0; index < Response.length; index++) {
            let item = Response[index];
            await InserIngenieros(item)
        }
        return true
    } catch (error) {
        console.log(error);
    }
}

async function InserIngenieros(r) {
    const existe = await SelectIngenieros(r.IdUsuario)
    if (existe == false) {
        return new Promise((resolve, reject) => {
            try {
                db.exec([{
                    sql: `INSERT INTO ingenieros 
                    (
                        IdUsuario,
                        NombreUsuario,
                        cedula,
                        adicional
                    ) VALUES (?,?,?,?)`,
                    args: [
                        r.IdUsuario,
                        r.NombreUsuario,
                        r.cedula,
                        r.adicional
                    ]
                }], false, (err, results) => {
                    if (err) {
                        console.log("error", err);
                    } else {
                        console.log("results ingenieros", results);
                    }
                })
                resolve(true)
            } catch (error) {
                console.log("insert InserIngenieros--->", error);
            }
        })
    } else {
        return true
    }
}
export async function SelectIngenieros(IdUsuario) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ingenieros WHERE IdUsuario = ?`,
                [IdUsuario],
                (tx, results) => {
                    if (results.rows._array.length > 0) {
                        resolve(results.rows._array)
                    } else {
                        resolve(false)
                    }
                })
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

/**
 * 
 * @param {*} adicional 
 * @returns {
 * "IdUsuario": 0,
 * "NombreUsuario": "string",
 * "cedula": "string",
 * "adicional": "string"
 * }
 */
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