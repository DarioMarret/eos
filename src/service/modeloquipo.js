import axios from "axios";
import { host } from "../utils/constantes";
import db from "./Database/model";
import { getToken } from "./usuario";

export const getModeloEquipos = async () => {
    const url = `${host}MSCatalogo/api/ModelosEquipos`;
    try {
        const { token } = await getToken()
        const { data } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return new Promise((resolve, reject) => {
            data.Response.map(async (r, i) => {
                await InserModeloEquipo(r)
            })
            resolve(true);
        });
    } catch (error) {
        console.log(error);
    }
}

async function InserModeloEquipo(r) {
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
            Number(r.modelo_id),
            Number(r.tipo_id),
            String(r.tipoEquipo),
            Number(r.empresa_id),
            String(r.modelo_descripcion),
            String(r.modelo_tiempoprom_inst),
            String(r.modelo_tiempoprom_mant),
            String(r.modelo_estado),
            Number(r.modelo_usuarioCreacion),
            Number(r.modelo_usuarioModificacion),
            String(r.modelo_fechaCreacion),
            String(r.modelo_fechaModificacion)]
    }], false, (err, results) => {
        if (err) {
            console.log("error",err);
        } else {
            console.log("results modelosEquipo", results);
        }

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