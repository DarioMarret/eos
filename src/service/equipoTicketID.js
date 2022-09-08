import axios from "axios";
import { host } from "../utils/constantes";
import { getToken } from "./usuario";
import db from './Database/model';

const axinst = axios.create({
    timeout: 12000
})

export const EquipoTicket = async (ticket_id) => {

    try {
        const { token } = await getToken()
        const url = `${host}MSOrdenServicio/equipoTicket?ticketId=${ticket_id}`;
        const { data, status } = await axinst.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return new Promise((resolve, reject) => {
            data.Response.map(async (r, i) => {
                await SelectEquipoTicket(r)
            })
            resolve(true);
        });
    } catch (error) {
        console.log("errores", error);
        return false
    }
}

async function SelectEquipoTicket(r) {
    return new Promise((resolve, reject) => {
        try {
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
                    estado_local
                             ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                args: [
                    Number(r.id_equipoContrato),
                    String(r.con_ClienteNombre),
                    Number(r.id_equipo),
                    Number(r.id_contrato),
                    Number(r.empresa_id),
                    String(r.eqc_conRepuesto),
                    String(r.eqc_frecuenciaVisita),
                    String(r.eqc_periodo),
                    String(r.eqc_tiempoVisita),
                    String(r.eqc_horarioAtencionDesde),
                    String(r.eqc_horarioAtencionHasta),
                    String(r.eqc_lunes),
                    String(r.eqc_martes),
                    String(r.eqc_miercoles),
                    String(r.eqc_jueves),
                    String(r.eqc_viernes),
                    String(r.eqc_sabado),
                    String(r.eqc_domingo),
                    String(r.eqc_monto),
                    Number(r.eqc_usuarioCreacion),
                    String(r.eqc_UsuarioModificacion),
                    String(r.eqc_fechaCreacion),
                    String(r.eqc_fechaModificacion),
                    String(r.localidad_id),
                    String(r.eqc_estado),
                    String(r.eqc_tiempoServicio),
                    String(r.eqc_frecuenciaServicio),
                    String(r.eqc_manoObra),
                    String(r.eqc_estadoProgramado),
                    String(r.eqc_fechaIniGaranC),
                    String(r.eqc_fechaFinGaranC),
                    String(r.eqc_fechaServicio),
                    String(r.eqc_fechaServicioFin),
                    String(r.eqc_oldContract),
                    String(r.eqc_tiempoRepuestos),
                    String(r.eqc_tiempoManoObra),
                    String(r.eqc_consumibles),
                    String(r.eqc_tiempoConsumibles),
                    String(r.eqc_fungibles),
                    String(r.eqc_tiempoFungibles),
                    String(r.eqc_kitMantenimiento),
                    String(r.eqc_fechaKitMantenimiento),
                    String(r.eqc_rutaAdjunto),
                    String(r.eqc_rucComodato),
                    String(r.eqc_codComodato),
                    String(r.eqc_frecVisSitePlan),
                    String(r.eqc_periodoSitePlan),
                    String(r.eqc_observacion),
                    String(JSON.stringify(r.Equipo)),
                    "SIN"
                ],
            }], false, (err, results) => {
                if (err) {
                    console.log("error", err);
                } else {
                    resolve(true)
                    const { error } = results[0];
                    if (error) {

                        console.log("results historialEquipo", results);
                        console.log("iterador", i);
                    }
                }
            })
        } catch (error) {
            console.log("error al insertar--->", error);
        }
    })
}

export const getEquipoTicketStorage = async (ticket_id) => {
    try {
        const result = await db.select({
            table: "equipoTicket",
            where: {
                id_equipoContrato: ticket_id
            }
        })
        return result;

    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}

