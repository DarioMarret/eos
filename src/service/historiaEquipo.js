import { host } from "../utils/constantes";
import { getToken } from "./usuario";
import db from './Database/model';
import isEmpty from "is-empty";


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
        console.log("Response", resultado)
        for (let index = 0; index < Response.length; index++) {
            let item = Response[index];
            await SelectExisteEquipo(item)
        }
        return true
        // return new Promise((resolve, reject) => {
        //     Response.map(async (r) => {
        //     })
        //     resolve(true)
        // });
    } catch (error) {
        console.log("errores", error.message);
        return true
    }
}

export const HistorialEquipoPorCliente = async (cadenaRucCliente) => {

    try {
        const { token, userId } = await getToken()
        const response = await fetch(`${host}MSOrdenServicio/getbaseInstal247ClientesReport?ruc=${cadenaRucCliente}`, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const resultado = await response.json()
        const { Response } = resultado
        console.log("Response", resultado)
        for (let index = 0; index < Response.length; index++) {
            let item = Response[index];
            await SelectExisteEquipo(item)
        }
        return true
    } catch (error) {
        console.log("errores", error.message);
        return true
    }
}

async function SqlIdUsuario(userId) {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(`SELECT IdUsuario FROM ingenieros where adicional = ?`, [userId], (_, { rows }) => {
                console.log("ingenieros IdUsuario", rows._array)
                resolve(rows._array[0].IdUsuario)
            })
        })
    })
}

async function DeleteHistorialEquipo(equipo_id) {
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `DELETE FROM historialEquipo WHERE equipo_id = ?`,
            args: [equipo_id],
        }], false, (err, results) => {
            if (err) {
                console.log("error", err);
            } else {
                console.log("delete historialEquipo", results);
                resolve(true)
            }
        })
    })
}

async function SelectExisteEquipo(r) {
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
}

export async function SelectExisteEquipoQ(equipo_id) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM historialEquipo WHERE equipo_id = ?`,
                [equipo_id],
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
//Para ver si existe el equipo en la base de datos local
export const ExisteHistorialEquipoClienteNombre = async (con_ClienteNombre) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM historialEquipo WHERE con_ClienteNombre = ?`,
                [con_ClienteNombre],
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
export async function getEquipoID(equipo_id) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM historialEquipo WHERE equipo_id = ?`,
                [equipo_id],
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

export const getHistorialEquiposStorage = async (tipo, modelo, serie) => {
    try {
        console.log("tipo", tipo)
        console.log("modelo", modelo)
        console.log("serie", serie)
        if (isEmpty(tipo) && isEmpty(modelo) && isEmpty(serie)) {
            console.log("tipo vacio", tipo)
            return []
        } else if (!isEmpty(tipo) && isEmpty(modelo) && isEmpty(serie)) {
            console.log("tipo 1", tipo)
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from historialEquipo where equ_tipoEquipo = ? ', [tipo], (_, { rows }) => {
                        console.log("rows", rows._array);
                        if (rows._array.length > 0) {
                            resolve(rows._array)
                        } else {
                            resolve([])
                        }
                    });
                })
            })
        } else if (!isEmpty(tipo) && !isEmpty(modelo) && isEmpty(serie)) {
            console.log("tipo 2", tipo)
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from historialEquipo where equ_tipoEquipo = ? and modelo = ?', [tipo, modelo], (_, { rows }) => {
                        if (rows._array.length > 0) {
                            resolve(rows._array)
                        } else {
                            resolve([])
                        }

                    });
                })
            })
        } else if (!isEmpty(tipo) && !isEmpty(modelo) && !isEmpty(serie)) {
            console.log("tipo 3", tipo)
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from historialEquipo where equ_tipoEquipo = ? and modelo = ? and equ_serie = ?', [tipo, modelo, Number(serie)], (_, { rows }) => {
                        if (rows._array.length > 0) {
                            resolve(rows._array)
                        } else {
                            resolve([])
                        }

                    });
                })
            })
        } else if (!isEmpty(tipo) && isEmpty(modelo) && !isEmpty(serie)) {
            console.log("tipo 4", tipo)
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from historialEquipo where equ_tipoEquipo = ? and equ_serie = ?', [tipo, serie], (_, { rows }) => {
                        if (rows._array.length > 0) {
                            resolve(rows._array)
                        } else {
                            resolve([])
                        }

                    });
                })
            })
        } else if (!isEmpty(serie)) {
            console.log("serie", serie);
            //like '%${CustomerName}%' limit 10
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql(`select * from historialEquipo where equ_serie like '%${serie}%' limit 10`, [], (_, { rows }) => {
                        if (rows._array.length > 0) {
                            resolve(rows._array)
                        } else {
                            resolve([])
                        }
                    });
                })
            })
        }
    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return [];
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
                    if (rows._array.length > 0) {
                        resolve(rows._array[0].checklist)
                    } else {
                        resolve([])
                    }
                });
            })
        })
    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}

export const getHistorialEquiposStoragId = async (equipo_id) => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('select * from historialEquipo where equipo_id = ?', [equipo_id], (_, { rows }) => {
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