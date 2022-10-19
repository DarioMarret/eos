import axios from "axios";
import { host } from "../utils/constantes";
import { getToken } from "./usuario";
import db from './Database/model';

export const EquipoTicket = async (ticket_id) => {

    try {
        const { token } = await getToken()
        const url = `${host}MSOrdenServicio/equipoTicket?ticketId=${ticket_id}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        const resultado = await response.json()
        const { Response } = resultado
        return new Promise((resolve, reject) => {
            Response.EquipoContrato.map(async (r) => {
                await SelectEquipoTicket(r, Response.con_ClienteNombre, ticket_id)
            })
            resolve(true);
        });
    } catch (error) {
        console.log("errores", error);
        return false
    }
}

async function SelectEquipoTicket(r, con_ClienteNombre, ticket_id) {
    // await DeleteTicket(ticket_id)
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `INSERT INTO equipoTicket (
                        id_equipoContrato,
                        con_ClienteNombre,
                        id_equipo,
                        id_contrato,
                        empresa_id,
                        eqc_conRepuesto,
                        eqc_frecuenciaVisita,
                        eqc_periodo,
                        eqc_tiempoVisita,
                        eqc_horarioAtencionDesde,
                        eqc_horarioAtencionHasta,
                        eqc_lunes,
                        eqc_martes,
                        eqc_miercoles,
                        eqc_jueves,
                        eqc_viernes,
                        eqc_sabado,
                        eqc_domingo,
                        eqc_monto,
                        eqc_usuarioCreacion,
                        eqc_UsuarioModificacion,
                        eqc_fechaCreacion,
                        eqc_fechaModificacion,
                        localidad_id,
                        eqc_estado,
                        eqc_tiempoServicio,
                        eqc_frecuenciaServicio,
                        eqc_manoObra,
                        eqc_estadoProgramado,
                        eqc_fechaIniGaranC,
                        eqc_fechaFinGaranC,
                        eqc_fechaServicio,
                        eqc_fechaServicioFin,
                        eqc_oldContract,
                        eqc_tiempoRepuestos,
                        eqc_tiempoManoObra,
                        eqc_consumibles,
                        eqc_tiempoConsumibles,
                        eqc_fungibles,
                        eqc_tiempoFungibles,
                        eqc_kitMantenimiento,
                        eqc_fechaKitMantenimiento,
                        eqc_rutaAdjunto,
                        eqc_rucComodato,
                        eqc_codComodato,
                        eqc_frecVisSitePlan,
                        eqc_periodoSitePlan,
                        eqc_observacion,
                        Equipo,
                        estado_local,
                        ticket_id
                                 ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            args: [
                r.id_equipoContrato,
                con_ClienteNombre,
                r.id_equipo,
                r.id_contrato,
                r.empresa_id,
                r.eqc_conRepuesto,
                r.eqc_frecuenciaVisita,
                r.eqc_periodo,
                r.eqc_tiempoVisita,
                r.eqc_horarioAtencionDesde,
                r.eqc_horarioAtencionHasta,
                r.eqc_lunes,
                r.eqc_martes,
                r.eqc_miercoles,
                r.eqc_jueves,
                r.eqc_viernes,
                r.eqc_sabado,
                r.eqc_domingo,
                r.eqc_monto,
                r.eqc_usuarioCreacion,
                r.eqc_UsuarioModificacion,
                r.eqc_fechaCreacion,
                r.eqc_fechaModificacion,
                r.localidad_id,
                r.eqc_estado,
                r.eqc_tiempoServicio,
                r.eqc_frecuenciaServicio,
                r.eqc_manoObra,
                r.eqc_estadoProgramado,
                r.eqc_fechaIniGaranC,
                r.eqc_fechaFinGaranC,
                r.eqc_fechaServicio,
                r.eqc_fechaServicioFin,
                r.eqc_oldContract,
                r.eqc_tiempoRepuestos,
                r.eqc_tiempoManoObra,
                r.eqc_consumibles,
                r.eqc_tiempoConsumibles,
                r.eqc_fungibles,
                r.eqc_tiempoFungibles,
                r.eqc_kitMantenimiento,
                r.eqc_fechaKitMantenimiento,
                r.eqc_rutaAdjunto,
                r.eqc_rucComodato,
                r.eqc_codComodato,
                r.eqc_frecVisSitePlan,
                r.eqc_periodoSitePlan,
                r.eqc_observacion,
                JSON.stringify(r.Equipo),
                "SIN",
                ticket_id
            ],
        }], false, (err, results) => {
            if (err) {
                console.log("error", err);
            } else {
                console.log("results", results);
            }
        })
        resolve(true)
    })
}

export async function DeleteTicket(ticket_id) {
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `DELETE FROM equipoTicket WHERE ticket_id = ?`,
            args: [ticket_id],
        }], false, (err, results) => {
            if (err) {
                console.log("error", err);
            } else {
                console.log("results", results);
            }
        })
        resolve(true)
    })
}

/**
 * 
 * @param {*} ticket_id 
 * @returns Array de id_equio [
 *   2916,
 *   3865]
 */
export async function SelectTicket(ticket_id) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM equipoTicket WHERE ticket_id = ?`,
                [ticket_id], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        var id_equios = []
                        _array.forEach((element) => {
                            id_equios.push(element.id_equipo)
                        });
                        resolve(id_equios)
                    } else {
                        resolve(false)
                    }
                })
        });
    })
}

export const getEquipoTicketStorage = async (ticket_id) => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction((tx) => {
                tx.executeSql(
                    `SELECT * FROM equipoTicket WHERE ticket_id = ?`,
                    [ticket_id],
                    (tx, results) => {
                        const len = results.rows.length;
                        if (len > 0) {
                            let row = results.rows.item(0);
                            resolve(row);
                        } else {
                            resolve(null);
                        }
                    }
                );
            });
        })

    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}

