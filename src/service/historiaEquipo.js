import axios from "axios";
import { host } from "../utils/constantes";
import { getToken } from "./usuario";
import db from './Database/model';


export const HistorialEquipoIngeniero = async () => {

    try {
        const { token, userId } = await getToken()
        var IdUsuario = await SqlIdUsuario(userId)
        console.log("token", token)
        console.log(`${host}MSOrdenServicio/getbaseInstal247ClientesReport?ingeniero_id=${IdUsuario}`)
        const { data, status } = await axios.get(`${host}MSOrdenServicio/getbaseInstal247ClientesReport?ingeniero_id=${IdUsuario}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return new Promise((resolve, reject) => {
            for (let index = 0; index < data.Response.length; index++) {
                data.Response[index];
                SelectExisteEquipo(data.Response[index])

            }
            // data.Response.map(async (r, i) => {
            // })
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
async function SelectExisteEquipo(r, i) {
    return new Promise((resolve, reject) => {
        try {
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
                             isChecked
                             ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                args: [
                    Number(r.equipo_id),
                    Number(r.equ_tipoEquipo),
                    String(r.tipo),
                    Number(r.equ_modeloEquipo),
                    String(r.modelo),
                    String(r.equ_serie),
                    String(r.equ_SitioInstalado),
                    String(r.equ_areaInstalado),
                    String(r.con_ClienteNombre),
                    String(r.marca),
                    String(r.equ_modalidad),
                    String(r.Modalidad),
                    String(r.equ_fechaInstalacion),
                    String(r.equ_fecIniGaranP),
                    String(r.equ_fecFinGaranP),
                    String(r.equ_provincia),
                    String(r.equ_canton),
                    String(r.equ_ingenieroResponsable),
                    String(r.equ_marca),
                    String(r.equ_estado),
                    String(r.id_equipoContrato),
                    String(r.localidad_id),
                    JSON.stringify(r.historial),
                    "false"
                ],
            }], false, (err, results) => {
                if (err) {
                    console.log("error", err);
                } else {
                    const delay = time => new Promise(resolveCallback => setTimeout(resolveCallback, time));
                    delay(1000).then(() => {
                        resolve(true)
                    })
                    const { error } = results[0];
                    if (error) {

                        console.log("results historialEquipo", results);
                    }
                }
            })
        } catch (error) {
            console.log("error al insertar--->", error);
        }
    })
}

export const getHistorialEquiposStorage = async (tipo, modelo, serie) => {
    try {
        if (tipo === "" && modelo === "" && serie === "") {
            return []
        } else if (tipo !== "" && modelo == "" && serie == "") {
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from historialEquipo where equ_tipoEquipo = ? ', [tipo], (_, { rows }) => {
                        resolve(rows._array)
                        console.log("rows", rows._array);
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
        } else if (serie.length > 0) {
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql(`select * from historialEquipo where equ_serie like '%${serie}%'`, [], (_, { rows }) => {
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
                            console.log("rows", rows._array);
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
