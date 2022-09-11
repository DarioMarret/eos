import { host } from "../utils/constantes";
import { getToken } from "./usuario";
import axios from "axios";
import db from "./Database/model";


export const getClientes = async () => {
    const url = `${host}MSCatalogo/ClienteByNombre`;
    try {
        const { token } = await getToken()
        const { data, status } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return new Promise((resolve, reject) => {
            data.Response.map(async (r, i) => {
                await InserCliente(r)
            })
            resolve(true);
        });
    } catch (error) {
        console.log(error);
    }
}

async function InserCliente(r) {
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
                String(r.CustomerID),
                String(r.CustomerName),
                String(r.ProvinciaID),
                String(r.CantonID),
                String(r.Direccion),
                String(r.grupo),
                String(JSON.stringify(r.Sucursal))]
        }], false, (err, results) => {
            if (err) {
                console.log("error", err);
            } else {
                resolve(true);
                console.log("results clientes", results);
            }
    
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
                tx.executeSql(`select * from cliente where CustomerName like '%${CustomerName}%'`, [], (_, { rows }) => {
                    resolve(rows._array)
                });
            })
        })
    } catch (error) {
        console.log("GetClienteCustimerName-->", error);
        return null;
    }
}