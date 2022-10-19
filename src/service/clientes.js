import { host } from "../utils/constantes";
import { getToken } from "./usuario";
import db from "./Database/model";


export const getClientes = async () => {
    const url = `${host}MSCatalogo/ClienteByNombre`;
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
                await InserCliente(r)
            })
            resolve(true);
        })
    } catch (error) {
        console.log(error);
    }
}
 
async function InserCliente(r) {
    const existe = await SelectCliente(r.CustomerID)
    if (!existe) {
        return new Promise((resolve, reject) => {
            db.exec([{
                sql: `INSERT INTO cliente (
                    CustomerID,
                    CustomerName,
                    ProvinciaID,
                    CantonID,
                    Direccion,
                    grupo,
                    Sucursal) VALUES (?,?,?,?,?,?,?)`,
                args: [
                    r.CustomerID,
                    r.CustomerName,
                    r.ProvinciaID,
                    r.CantonID,
                    r.Direccion,
                    r.grupo,
                    JSON.stringify(r.Sucursal)]
            }], false, (err, results) => {
                if (err) {
                    console.log("error", err);
                } else {
                    console.log("results clientes", results);
                }
            })
            resolve(true);
        })
    }else{
        return true
    }
}
export async function SelectCliente(CustomerID) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM cliente WHERE CustomerID = ?`,
                [CustomerID],
                (tx, results) => {
                    if (results.rows._array.length > 0) {
                        resolve(results.rows._array[0])
                    } else {
                        resolve(false)
                    }
                })
        })
    })
}    
export const getClientesStorage = async (cedulaRuc) => {
    try {
        if (cedulaRuc === "") {
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from cliente', [], (_, { rows }) => {
                        resolve(rows._array)
                    });
                })
            })
        }else if(cedulaRuc !== ""){
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql(`select * from cliente where CustomerID like '%${cedulaRuc}%'`, [], (_, { rows }) => {
                        resolve(rows._array)
                    });
                })
            })
        }
    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}

export const GetClienteCustimerName = async (CustomerName) => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(`select * from cliente where CustomerName like '%${CustomerName}%' limit 10`, [], (_, { rows }) => {
                    resolve(rows._array)
                });
            })
        })
    } catch (error) {
        console.log("GetClienteCustimerName-->", error);
        return null;
    }
}

export const GetClienteClienteName = async (CustomerName) => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql(`select * from cliente where CustomerName = ?`, [CustomerName], (_, { rows }) => {
                    resolve(rows._array)
                });
            })
        })
    } catch (error) {
        console.log("GetClienteCustimerName-->", error);
        return null;
    }
}