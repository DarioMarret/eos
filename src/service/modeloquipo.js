import axios from "axios";
import { host } from "../utils/constantes";
import db from "./Database/model";
import { getToken } from "./usuario";

export const getModeloEquipos = async () => {
    const url = `${host}MSCatalogo/api/ModelosEquipos`;
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
                await InserModeloEquipo(r)
            })
            resolve(true);
        });
    } catch (error) {
        console.log(error);
    }
}

async function InserModeloEquipo(r) {
    const existe = await SelectModeloEquipo(r.modelo_id)
    if (!existe) {
        return new Promise((resolve, reject) => {
            db.exec([{
                sql: `INSERT INTO modelosEquipo (
                    modelo_id,
                    tipo_id,
                    tipoEquipo,
                    empresa_id,
                    modelo_descripcion,
                    modelo_tiempoprom_inst,
                    modelo_tiempoprom_mant,
                    modelo_estado,
                    modelo_usuarioCreacion,
                    modelo_usuarioModificacion,
                    modelo_fechaCreacion,
                    modelo_fechaModificacion
                    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
                args: [
                    r.modelo_id,
                    r.tipo_id,
                    r.tipoEquipo,
                    r.empresa_id,
                    r.modelo_descripcion,
                    r.modelo_tiempoprom_inst,
                    r.modelo_tiempoprom_mant,
                    r.modelo_estado,
                    r.modelo_usuarioCreacion,
                    r.modelo_usuarioModificacion,
                    r.modelo_fechaCreacion,
                    r.modelo_fechaModificacion]
            }], false, (err, results) => {
                if (err) {
                    console.log("error", err);
                } else {
                    console.log("results modelosEquipo", results);
                }
    
            })
            resolve(true);
        });
    }else{
        return true
    }
}
export async function SelectModeloEquipo(modelo_id) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM modelosEquipo WHERE modelo_id = ?`,
                [modelo_id],
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

export const getModeloEquiposStorage = async () => {
    try {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('select * from modelosEquipo', [], (_, { rows }) => {
                    resolve(rows._array)
                });
            })
        })

    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}