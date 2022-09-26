import { host } from "../utils/constantes"
import db from "./Database/model"

export const getTPTCKStorage = async () => {
    await GetTPTCK()
    await GetTPINC()
    await GetESTEQ()
}
const GetTPTCK = async () => {
    const url = `${host}MSCatalogo/api/Catalogoes/TPTCK`;
    try {
        const response = await fetch(url)
        const resultado = await response.json()
        const { CatalogoDetalle } = resultado
        return new Promise((resolve, reject) => {
            CatalogoDetalle.map(async (r, i) => {
                await InserTPTCK(r)
            })
            resolve(true);
        });
    } catch (error) {
        console.log(error);
    }
}
const GetTPINC = async () => {
    const url = `${host}MSCatalogo/api/Catalogoes/TPINC`;
    try {
        const response = await fetch(url)
        const resultado = await response.json()
        const { CatalogoDetalle } = resultado
        return new Promise((resolve, reject) => {
            CatalogoDetalle.map(async (r, i) => {
                await InserTPTCK(r)
            })
            resolve(true);
        });
    } catch (error) {
        console.log(error);
    }
}
const GetESTEQ = async () => {
    const url = `${host}MSCatalogo/api/Catalogoes/ESTEQ`;
    try {
        const response = await fetch(url)
        const resultado = await response.json()
        const { CatalogoDetalle } = resultado
        return new Promise((resolve, reject) => {
            CatalogoDetalle.map(async (r, i) => {
                await InserTPTCK(r)
            })
            resolve(true);
        });
    } catch (error) {
        console.log(error);
    }
}
async function InserTPTCK(r) {
    const existe = await SelectTPTCK(r.IdCatalogo, r.Descripcion)
    if (!existe) {
        return new Promise((resolve, reject) => {
            db.exec([{
                sql: `INSERT INTO EstadoDatos (
                    IdCatalogo,
                    IdCatalogoDetalle,
                    Descripcion,
                    Auxiliar1,
                    Auxiliar2,
                    Ordenamiento,
                    FechaCreacion,
                    UsuarioCreacion,
                    FechaModificacion,
                    UsuarioModificacion,
                    Estado
                    ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
                args: [
                    r.IdCatalogo,
                    r.IdCatalogoDetalle,
                    r.Descripcion,
                    r.Auxiliar1,
                    r.Auxiliar2,
                    r.Ordenamiento,
                    r.FechaCreacion,
                    r.UsuarioCreacion,
                    r.FechaModificacion,
                    r.UsuarioModificacion,
                    r.Estado]
            }], false, (err, results) => {
                if (err) {
                    console.log("error", err);
                } else {
                    console.log("results EstadoDatos", results);
                }
            })
            resolve(true);
        })
    } else {
        return true
    }
}
async function SelectTPTCK(IdCatalogo, Descripcion) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM EstadoDatos WHERE IdCatalogo = ? AND Descripcion = ?`,
                [IdCatalogo, Descripcion],
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

export async function SelectCategoria(IdCatalogo) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM EstadoDatos WHERE IdCatalogo = ?`,
                [IdCatalogo],
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