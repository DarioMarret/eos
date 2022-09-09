import axios from "axios";
import { host } from "../utils/constantes";
import { getToken } from "./usuario";
import db from './Database/model';

export const GetEventosDelDia = async () => {

    try {
        const { token, userId } = await getToken()
        const url = `${host}MSOrdenServicio/api/OS_OrdenServicio?idUsuario=${userId}`;
        const { data, status } = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return new Promise((resolve, reject) => {
            data.Response.map(async (r) => {
                await InserEventosDiarios(r)
            })
            resolve(true);
        })

    } catch (error) {
        console.log("errores", error);
        return false
    }
}

async function InserEventosDiarios(r) {
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
                estado_local
                    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
                "SIN"]
        }], false, (err, results) => {
            if (err) {
                console.log("error", err);
            } else {
                resolve(true);
                console.log("results OrdenesServicio", results);
            }

        })
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
            ev_fechaAsignadaDesde
            console.log("ev_fechaAsignadaDesde", ev_fechaAsignadaDesde);
            return new Promise((resolve, reject) => {
                db.transaction(tx => {
                    tx.executeSql('select * from OrdenesServicio where ev_fechaAsignadaDesde = ?', [ev_fechaAsignadaDesde], (_, { rows }) => {
                        console.log("rows", rows._array);
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

export const GetEventosByTicket = async (ticket_id) => {
    try {
        return new Promise((resolve, reject) => {
            db.transaction(tx => {
                tx.executeSql('select ticket_id from OrdenesServicio where ev_estado != "FINALIZADO"', [], (_, { rows }) => {
                    resolve(rows._array)
                });
            })
        })
    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}