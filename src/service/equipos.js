import axios from "axios";
import { host } from "../utils/constantes";
import db from "./Database/model";
import { getToken } from "./usuario";


export const getEquipos = async () => {
    const url = `${host}MSCatalogo/api/TiposEquipos`;
    try {
        const { token } = await getToken()
        const { data, status } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return new Promise((resolve, reject) => {
            data.Response.map(async (r, i) => {
                await InserTipoEquipo(r, i)
            })
            resolve(true);
        });
    } catch (error) {
        console.log(error);
    }
}
async function InserTipoEquipo(r) {
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `INSERT INTO tiposEquipos (
                tipo_id,
                empresa_id,
                tipo_descripcion,
                tipo_estado,
                tipo_usuarioCreacion,
                tipo_usuarioModificacion,
                tipo_fechaCreacion,
                tipo_fechaModificacion,
                MO,
                CONTCREPTO,
                CONTSREPTO,
                modalidad_id
                    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
            args: [
                r.tipo_id,
                r.empresa_id,
                r.tipo_descripcion,
                r.tipo_estado,
                r.tipo_usuarioCreacion,
                r.tipo_usuarioModificacion,
                r.tipo_fechaCreacion,
                r.tipo_fechaModificacion,
                r.MO,
                r.CONTCREPTO,
                r.CONTSREPTO,
                r.modalidad_id]
        }], false, (err, results) => {
            if (err) {
                console.log("error", err);
            } else {
                resolve(true);
                console.log("results tiposEquipos", results);
            }

        })
    })
}
export const getEquiposStorage = async () => {
    try {

        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('select * from tiposEquipos', [], (_, { rows }) => {
                    resolve(rows._array)
                });
            })
        })

    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}