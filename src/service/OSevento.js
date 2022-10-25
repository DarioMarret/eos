import { host } from "../utils/constantes";
import { getToken } from "./usuario";
import db from './Database/model';
import moment from "moment";

export const GetEventosDelDia = async () => {

    try {
        const { token, userId } = await getToken()
        let fechaInic = moment().add(-1, 'days').format('YYYY-MM-DD')
        let fechaFini = moment().add(1, 'days').format('YYYY-MM-DD')
        const url = `${host}MSOrdenServicio/api/OS_OrdenServicio?idUsuario=${userId}&fechaInicio=${fechaInic}&fechaFin=${fechaFini}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const resultado = await response.json()
        const { Response } = resultado
        for (let index = 0; index < Response.length; index++) {
            const item = Response[index];
            await InserEventosDiarios(item)
        }
        return true
    } catch (error) {
        console.log("errores GetEventosDelDia--->", error);
        return true
    }
}

export const GetEventosDelDiaHoy = async () => {

    try {
        const { token, userId } = await getToken()
        let fechaFini = moment().format('YYYY-MM-DD')
        const url = `${host}MSOrdenServicio/api/OS_OrdenServicio?idUsuario=${userId}&fechaInicio=${fechaFini}&fechaFin=${fechaFini}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const resultado = await response.json()
        const { Response } = resultado
        for (let index = 0; index < Response.length; index++) {
            const item = Response[index];
            await InserEventosDiarios(item)
        }
        return true
    } catch (error) {
        console.log("errores GetEventosDelDia--->", error);
        return true
    }
}

export async function DeleteEventes(ticket_id) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`DELETE FROM OrdenesServicio WHERE ticket_id = ?`,
                [ticket_id], (_, { rows: { _array } }) => {
                    resolve(true)
                })
        });
    })
}
async function InserEventosDiarios(r) {
    try {
        return new Promise((resolve, reject) => {
            db.exec([{
                sql: `INSERT INTO OrdenesServicio (
                        evento_id,
                        ticket_id,
                        codOS,
                        codTicket,
                        tck_cliente,
                        tck_tipoTicket,
                        tck_tipoTicketDesc,
                        tck_descripcionProblema,
                        ev_fechaAsignadaDesde,
                        ev_fechaAsignadaHasta,
                        ev_horaAsignadaDesde,
                        ev_horaAsignadaHasta,
                        ev_estado,
                        tck_direccion,
                        tck_canton,
                        tck_provincia,
                        tck_reporta,
                        tck_telefonoReporta,
                        tck_usuario_creacion,
                        tck_estadoTicket,
                        ev_descripcion,
                        id_contrato,
                        ingenieroId,
                        ingeniero,
                        tipoIncidencia,
                        OrdenServicioID,
                        tck_tipoTicketCod,
                        estado_local
                            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                args: [
                    r.evento_id,
                    r.ticket_id,
                    r.codOS,
                    r.codTicket,
                    r.tck_cliente,
                    r.tck_tipoTicket,
                    r.tck_tipoTicketDesc,
                    r.tck_descripcionProblema,
                    r.ev_fechaAsignadaDesde,
                    r.ev_fechaAsignadaHasta,
                    r.ev_horaAsignadaDesde,
                    r.ev_horaAsignadaHasta,
                    r.ev_estado,
                    r.tck_direccion,
                    r.tck_canton,
                    r.tck_provincia,
                    r.tck_reporta,
                    r.tck_telefonoReporta,
                    r.tck_usuario_creacion,
                    r.tck_estadoTicket,
                    r.ev_descripcion,
                    r.id_contrato,
                    r.ingenieroId,
                    r.ingeniero,
                    r.tipoIncidencia,
                    r.OrdenServicioID,
                    r.tck_tipoTicketCod,
                    "SIN"]
            }], false, (err, results) => {
                if (err) {
                    console.log("error", err);
                    resolve(true)
                } else {
                    console.log("sincronizacion results GetEventosDelDia-->", results);
                    resolve(true);
                }

            })
        })
    } catch (error) {
        return true
    }
}

export const InsertEventosLocales = async (r) => {
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `INSERT INTO OrdenesServicio (
                        evento_id,
                        ticket_id,
                        codOS,
                        codTicket,
                        tck_cliente,
                        tck_tipoTicket,
                        tck_tipoTicketDesc,
                        tck_descripcionProblema,
                        ev_fechaAsignadaDesde,
                        ev_fechaAsignadaHasta,
                        ev_horaAsignadaDesde,
                        ev_horaAsignadaHasta,
                        ev_estado,
                        tck_direccion,
                        tck_canton,
                        tck_provincia,
                        tck_reporta,
                        tck_telefonoReporta,
                        tck_usuario_creacion,
                        tck_estadoTicket,
                        ev_descripcion,
                        id_contrato,
                        ingenieroId,
                        ingeniero,
                        tipoIncidencia,
                        OrdenServicioID,
                        tck_tipoTicketCod,
                        estado_local
                            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            args: [
                r.evento_id,
                r.ticket_id,
                r.codOS,
                r.codTicket,
                r.tck_cliente,
                r.tck_tipoTicket,
                r.tck_tipoTicketDesc,
                r.tck_descripcionProblema,
                r.ev_fechaAsignadaDesde,
                r.ev_fechaAsignadaHasta,
                r.ev_horaAsignadaDesde,
                r.ev_horaAsignadaHasta,
                r.ev_estado,
                r.tck_direccion,
                r.tck_canton,
                r.tck_provincia,
                r.tck_reporta,
                r.tck_telefonoReporta,
                r.tck_usuario_creacion,
                r.tck_estadoTicket,
                r.ev_descripcion,
                r.id_contrato,
                r.ingenieroId,
                r.ingeniero,
                r.tipoIncidencia,
                r.OrdenServicioID,
                r.tck_tipoTicketCod,
                "SIN"]
        }], false, (err, results) => {
            if (err) {
                console.log("error", err);
                resolve(true);
            } else {
                console.log("aqui results GetEventosDelDia-->", results);
                resolve(true);
            }
        })
    })
}

/**
 * 
 * @param {*} estado 
 * @param {*} OrdenServicioID 
 * @param {*} evento_id 
 * @returns 
 */
export const AactualizarEventos = async (estado, OrdenServicioID, evento_id) => {
    console.log("AactualizarEventos-->", estado, OrdenServicioID, evento_id);
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `UPDATE OrdenesServicio SET ev_estado = ? WHERE OrdenServicioID = ? AND evento_id = ?`,
            args: [estado, OrdenServicioID, evento_id]
        }], false, (err, results) => {
            if (err) {
                console.log("error", err);
            } else {
                console.log("aqui results GetEventosDelDia-->", results);
            }
        })
        resolve(true);
    })
}


export const DeleteEventesDiaHoy = async () => {
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `DELETE FROM OrdenesServicio WHERE ev_fechaAsignadaDesde = ?`,
            args: [`${moment().format("YYYY-MM-DD")}T00:00:00`]
        }], false, (err, results) => {
            if (err) {
                console.log("error", err);
            } else {
                console.log("aqui results GetEventosDelDia-->", results);
            }
        })
        resolve(true);
    })
}

async function SelectTicket(evento_id) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM OrdenesServicio WHERE evento_id = ?`,
                [evento_id], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
        });
    })
}

export const GetEventos = async (ev_fechaAsignadaDesde) => {
    try {
        if (ev_fechaAsignadaDesde === "") {
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from OrdenesServicio', [], (_, { rows }) => {
                        resolve(rows._array)
                    });
                })
            })
        } else if (ev_fechaAsignadaDesde !== "") {
            console.log("ev_fechaAsignadaDesde", ev_fechaAsignadaDesde);
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from OrdenesServicio where ev_fechaAsignadaDesde = ?', [ev_fechaAsignadaDesde], (_, { rows }) => {
                        resolve(rows._array)
                    })
                })
            })
        }
    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error)
        return null
    }
}

/**
 * 
 * @param {} ayer 
 * @param {*} hoy 
 * @param {*} manana 
 * @returns [{
 * ticket_id: string,
 * evento_id: string
 * }] 
 */
export const GetEventosByTicket = async (ayer, hoy, manana) => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('select ticket_id, evento_id, OrdenServicioID, tck_cliente from OrdenesServicio where ev_fechaAsignadaHasta = ? or ev_fechaAsignadaHasta = ? or ev_fechaAsignadaHasta = ?',
                    [`${ayer}T00:00:00`, `${hoy}T00:00:00`, `${manana}T00:00:00`], (_, { rows }) => {
                        resolve(rows._array)
                    });
            })
        })
    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}

export const GetEventosByTicketHoy = async (hoy) => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('select ticket_id, evento_id, OrdenServicioID, tck_cliente from OrdenesServicio where ev_fechaAsignadaHasta = ?',
                    [`${hoy}T00:00:00`], (_, { rows }) => {
                        resolve(rows._array)
                    });
            })
        })
    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}