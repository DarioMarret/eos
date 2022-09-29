import { host } from "../utils/constantes";
import { getToken } from "./usuario";
import db from './Database/model';


export const HistorialEquipoIngeniero = async () => {

    try {
        const { token, userId } = await getToken()
        var IdUsuario = await SqlIdUsuario(userId)
        console.log("token", token)
        const response = await fetch(`${host}MSOrdenServicio/getbaseInstal247ClientesReport?ingeniero_id=${IdUsuario}`, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const resultado = await response.json()
        const { Response } = resultado
        return new Promise((resolve, reject) => {
            Response.map(async (r) => {
                await SelectExisteEquipo(r)
            })
            resolve(true);
        });
    } catch (error) {
        console.log("errores", error.message);
        return false
    }
}
async function SqlIdUsuario(userId) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`SELECT IdUsuario FROM ingenieros where adicional = ?`, [userId], (_, { rows }) => {
                console.log("ingenieros IdUsuario", rows._array[0].IdUsuario)
                resolve(rows._array[0].IdUsuario)
            })
        })
    })
}

async function SelectExisteEquipo(r) {
    const existe = await SelectExisteEquipoQ(r.equipo_id)
    if (!existe) {
        return new Promise((resolve, reject) => {
            db.exec([{
                sql: `INSERT INTO historialEquipo (
                                 equipo_id,
                                 equ_tipoEquipo,
                                 tipo,
                                 equ_modeloEquipo,
                                 modelo,
                                 equ_serie,
                                 equ_SitioInstalado,
                                 equ_areaInstalado,
                                 con_ClienteNombre,
                                 marca,
                                 equ_modalidad,
                                 Modalidad,
                                 equ_fechaInstalacion,
                                 equ_fecIniGaranP,
                                 equ_fecFinGaranP,
                                 equ_provincia,
                                 equ_canton,
                                 equ_ingenieroResponsable,
                                 equ_marca,
                                 equ_estado,
                                 id_equipoContrato,
                                 localidad_id,
                                 historial,
                                 checklist,
                                 id_contrato,
                                 isChecked
                                 ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                args: [
                    r.equipo_id,
                    r.equ_tipoEquipo,
                    r.tipo,
                    r.equ_modeloEquipo,
                    r.modelo,
                    r.equ_serie,
                    r.equ_SitioInstalado,
                    r.equ_areaInstalado,
                    r.con_ClienteNombre,
                    r.marca,
                    r.equ_modalidad,
                    r.Modalidad,
                    r.equ_fechaInstalacion,
                    r.equ_fecIniGaranP,
                    r.equ_fecFinGaranP,
                    r.equ_provincia,
                    r.equ_canton,
                    r.equ_ingenieroResponsable,
                    r.equ_marca,
                    r.equ_estado,
                    r.id_equipoContrato,
                    r.localidad_id,
                    JSON.stringify(r.historial),
                    JSON.stringify(r.checklist),
                    r.id_contrato,
                    "false"
                ],
            }], false, (err, results) => {
                if (err) {
                    console.log("error", err);
                } else {
                    console.log("insert historialEquipo", results);
                    resolve(true)
                }
            })
        })
    } else {
        return true
    }
}

export async function SelectExisteEquipoQ(equipo_id) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM historialEquipo WHERE equipo_id = ?`,
                [equipo_id],
                (tx, results) => {
                    // console.log("results", results)
                    if (results.rows._array.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
        })
    })
}

export const getHistorialEquiposStorage = async (tipo, modelo, serie) => {
    try {
        console.log("tipo", tipo)
        console.log("modelo", modelo)
        console.log("serie", serie)
        if (tipo === "" && modelo === "" && serie === "") {
            return []
        } else if (tipo !== "" && modelo == "" && serie == "") {
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from historialEquipo where equ_tipoEquipo = ? ', [tipo], (_, { rows }) => {
                        resolve(rows._array)
                        // console.log("rows", rows._array);
                    });
                })
            })
        } else if (tipo !== "" && modelo !== "" && serie === "") {
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from historialEquipo where equ_tipoEquipo = ? and modelo = ?', [tipo, modelo], (_, { rows }) => {
                        resolve(rows._array)

                    });
                })
            })
        } else if (tipo !== "" && modelo !== "" && serie !== "") {
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from historialEquipo where equ_tipoEquipo = ? and modelo = ? and equ_serie = ?', [tipo, modelo, Number(serie)], (_, { rows }) => {
                        resolve(rows._array)

                    });
                })
            })
        } else if (tipo !== "" && modelo === "" && serie !== "") {
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from historialEquipo where equ_tipoEquipo = ? and equ_serie = ?', [tipo, serie], (_, { rows }) => {
                        resolve(rows._array)

                    });
                })
            })
        } else if (serie !== "") {
            console.log("serie", serie);
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql(`select * from historialEquipo where equ_serie like '%${serie}%'`, [], (_, { rows }) => {
                        console.log(rows._array)
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

export const isChecked = (equipo_id) => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('update historialEquipo set isChecked = ?', ["false"], (_, { rows }) => {
                    tx.executeSql('update historialEquipo set isChecked = ? where equipo_id = ? ', ["true", equipo_id], (_, { rows }) => {
                        tx.executeSql('select * from historialEquipo where isChecked = ? ', ["true"], (_, { rows }) => {
                            // console.log("rows", rows._array);
                            resolve(rows._array)
                        })
                    });
                });
            })
        })
    } catch (error) {
        console.log("isChecked-->", error);
        return null;
    }
}
export const isCheckedCancelar = () => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('update historialEquipo set isChecked = ?', ["false"], (_, { rows }) => {
                    resolve(true)
                    // console.log("isCheckedCancelar-->", rows);
                });
            })
        })
    } catch (error) {
        console.log("isChecked-->", error);
        return null;
    }
}
export const isCheckedCancelaReturn = (equipo_id) => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('update historialEquipo set isChecked = ?', ["false"], (_, { rows }) => {
                    tx.executeSql('select * from historialEquipo where equipo_id = ? ', [equipo_id], (_, { rows }) => {
                        resolve(rows._array)
                    })
                });
            })
        })
    } catch (error) {
        console.log("isChecked-->", error);
        return null;
    }
}

export const getHistorialEquiposStorageChecked = async () => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('select * from historialEquipo where isChecked = ?', ["true"], (_, { rows }) => {
                    // console.log("rows getHistorialEquiposStorageChecked", rows._array);
                    resolve(rows._array)
                });
            })
        })
    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}

export const getHistorialEquiposStorageChecklist = async (equipo_id) => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('select checklist from historialEquipo where equipo_id = ?', [equipo_id], (_, { rows }) => {
                    // console.log("rows getHistorialEquiposStorageChecked", rows._array);
                    resolve(rows._array)
                });
            })
        })
    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}