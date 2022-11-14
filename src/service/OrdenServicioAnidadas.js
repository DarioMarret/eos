import isEmpty from "is-empty";
import db from "./Database/model";
import { getToken } from "./usuario";


export const OrdenServicioAnidadas = async (idEvento) => {

    try {
        const { token, userId } = await getToken()
        const response = await fetch(`https://technical.eos.med.ec/MSOrdenServicio/api/OS_OrdenServicio?idUsuario=${userId}&idEvento=${idEvento}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        const { Response } = data;
        if (!isEmpty(Response)) {
            let idorden = []
            for (let index = 0; index < Response.length; index++) {
                let item = Response[index];
                console.log("anidacion-->", item)
                idorden.push(item.OrdenServicioID)
                await InsertOrdenServicioAnidadas(item)
            }
            return idorden
        }

    } catch (error) {
        console.log("OrdenServicioAnidadas-->", error)
        return null;
    }
}

export async function InsertOrdenServicioAnidadas(data) {
    return new Promise((resolve, reject) => {
        db.exec([{
            sql:
                `INSERT INTO ordenesAnidadas (
                    evento_id,
                    ticket_id,
                    codOS,
                    codeTicket,
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
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                data.evento_id,
                data.ticket_id,
                data.codOS,
                data.codeTicket,
                data.tck_cliente,
                data.tck_tipoTicket,
                data.tck_tipoTicketDesc,
                data.tck_descripcionProblema,
                data.ev_fechaAsignadaDesde,
                data.ev_fechaAsignadaHasta,
                data.ev_horaAsignadaDesde,
                data.ev_horaAsignadaHasta,
                data.ev_estado,
                data.tck_direccion,
                data.tck_canton,
                data.tck_provincia,
                data.tck_reporta,
                data.tck_telefonoReporta,
                data.tck_usuario_creacion,
                data.tck_estadoTicket,
                data.ev_descripcion,
                data.id_contrato,
                data.ingenieroId,
                data.ingeniero,
                data.tipoIncidencia,
                data.OrdenServicioID,
                data.tck_tipoTicketCod,
                "SIN"
            ],
        }], false, (err, results) => {
            if (err) {
                console.log("InsertOrdenServicioAnidadas", err)
            } else {
                console.log("insert ordenesAnidadas", results)
            }
        })
        resolve(true)
    })
}

export async function InsertOrdenServicioAnidadasLocal(data) {
    return new Promise((resolve, reject) => {
        db.exec([{
            sql:
                `INSERT INTO ordenesAnidadas (
                    evento_id,
                    ticket_id,
                    codOS,
                    codeTicket,
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
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            args: [
                data.evento_id,
                data.ticket_id,
                data.codOS,
                data.codeTicket,
                data.tck_cliente,
                data.tck_tipoTicket,
                data.tck_tipoTicketDesc,
                data.tck_descripcionProblema,
                data.ev_fechaAsignadaDesde,
                data.ev_fechaAsignadaHasta,
                data.ev_horaAsignadaDesde,
                data.ev_horaAsignadaHasta,
                data.ev_estado,
                data.tck_direccion,
                data.tck_canton,
                data.tck_provincia,
                data.tck_reporta,
                data.tck_telefonoReporta,
                data.tck_usuario_creacion,
                data.tck_estadoTicket,
                data.ev_descripcion,
                data.id_contrato,
                data.ingenieroId,
                data.ingeniero,
                data.tipoIncidencia,
                data.OrdenServicioID,
                data.tck_tipoTicketCod,
                "UPDATE"
            ],
        }], false, (err, results) => {
            if (err) {
                console.log("InsertOrdenServicioAnidadas", err)
            } else {
                console.log("insert ordenesAnidadas", results)
            }
        })
        resolve(true)
    })
}

/**
 * 
 * @param {*} estado 
 * @param {*} OrdenServicioID 
 * @returns 
 */
export const ActualizaEstadoOrdenServicioAnidadas = (estado, OrdenServicioID) => {
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `UPDATE ordenesAnidadas SET ev_estado = ?, estado_local = ? WHERE OrdenServicioID = ?`,
            args: [estado, "UPDATE",OrdenServicioID]
        }], false, (err, results) => {
            if (err) {
                console.log("ActualizaEstadoOrdenServicioAnidadas", err)
            } else {
                console.log("ActualizaEstadoOrdenServicioAnidadas", results)
            }
        })
        resolve(true)
    })
}


/**
 * 
 * @param {*} estado 
 * @param {*} estado_local //SIN, UPDATE
 * @param {*} OrdenServicioID 
 * @param {*} evento_id 
 * @returns 
 */
export const ActualizaOrdenServicioIDOrdenServicioAnidadas = (estado, estado_local, OrdenServicioID, evento_id) => {
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `UPDATE ordenesAnidadas SET 
            ev_estado = ?, 
            estado_local = ? 
            OrdenServicioID = ?
            WHERE evento_id = ?`,
            args: [estado, estado_local,OrdenServicioID, evento_id]
        }], false, (err, results) => {
            if (err) {
                console.log("ActualizaEstadoOrdenServicioAnidadas", err)
            } else {
                console.log("ActualizaEstadoOrdenServicioAnidadas", results)
            }
        })
        resolve(true)
    })
}

export async function DeleteAnidada(evento_id) {

    console.log("evento_id------>", evento_id)

    evento_id.map(async (id) => {
        db.exec([{
            sql: `SELECT * FROM ordenesAnidadas WHERE evento_id = ?`,
            args: [id],
        }], false, (err, results) => {
            if (err) {
                console.log("error", err);
            } else {
                const { rows } = results[0];
                console.log("delete results ordenesAnidadas-->", rows, "id-->", id);
            }
        })
    })


    // evento_id.map(async (id) => {
    //     db.exec([{
    //         sql: `DELETE FROM ordenesAnidadas WHERE evento_id = ?`,
    //         args: [id],
    //     }], false, (err, results) => {
    //         if (err) {
    //             console.log("error", err);
    //         } else {
    //             console.log("delete results ordenesAnidadas-->", results, "id-->", id);
    //         }
    //     })
    // })
    // return true
}

async function selectOrdenServicioAnidadas(OrdenServicioID) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ordenesAnidadas WHERE OrdenServicioID = ?`,
                [OrdenServicioID],
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

export const ExisteAnidacion = async (evento_id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ordenesAnidadas WHERE evento_id = ?`,
                [evento_id],
                (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            );
        })
    })
}

export const getOrdenServicioAnidadas = async (ticket_id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ordenesAnidadas WHERE ticket_id = ?`,
                [ticket_id],
                (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(_array)
                    } else {
                        resolve(null)
                    }
                }
            );
        })
    })
}

export const getOrdenServicioAnidadasTicket_id = async (ticket_id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM ordenesAnidadas WHERE ticket_id = ?`,
                [ticket_id],
                (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(_array)
                    } else {
                        resolve(null)
                    }
                }
            );
        })
    })
}