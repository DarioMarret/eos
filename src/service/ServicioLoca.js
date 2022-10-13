import AsyncStorage from "@react-native-async-storage/async-storage";
import { OS, OS_Anexos, OS_CheckList, OS_Firmas, OS_PartesRepuestos, OS_Tiempos } from "../utils/constantes";
import { time } from "./CargaUtil";
import db from "./Database/model";


/**
 * 
 * @param {*} id_equipo 
 * @param {*} id_contrato 
 * @param {*} ticket_id 
 * @returns 
 */
export const registartEquipoTicket = async (id_equipo, id_contrato, ticket_id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`INSERT INTO equipoTicket (
                    id_equipo,
                    id_contrato,
                    ticket_id
                ) VALUES (?,?,?)`, [
                id_equipo,
                id_contrato,
                ticket_id
            ], (tx, results) => {
                console.log("results -- registartEquipoTicket", results.rowsAffected);
            })
        })
        resolve(true)
    })
}



/**
 * 
 * @param {*} ev_estado 
 * @param {*} OrdenServicioID 
 * @returns 
 */
export const EditareventoLocal = async (ev_estado, OrdenServicioID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`UPDATE OrdenesServicio SET ev_estado = ? WHERE OrdenServicioID = ?`, [
                ev_estado,
                OrdenServicioID
            ], (tx, results) => {
                console.log("results -- EditareventoLocal", results.rowsAffected);
            })
        })
        resolve(true)
    })
}

/**
 * 
 * @param {*} OrdenServicioID 
 */
export const EditarOrdenServicioLocal = async (OS, OrdenServicioID) => {
    await EliminarOrdenServicioLocal(OrdenServicioID)
    await time(2000)
    await InserOSOrdenServicioIDLocal(OS)
}

export const FinalizarOSLocal = async (OrdenServicioID) => {
    return new Promise((resolve, reject) => {
        OrdenServicioID.map(async (id) => {
            db.transaction((tx) => {
                tx.executeSql(`UPDATE OrdenesServicio SET ev_estado = ? WHERE OrdenServicioID = ?`, [
                    "FINALIZADO",
                    OrdenServicioID
                ], (tx, results) => {
                    console.log("results -- FinalizarOSLocal", results.rowsAffected);
                })
            })
        })
        OrdenServicioID.map(async (id) => {
            db.transaction((tx) => {
                tx.executeSql(`UPDATE OS_OrdenServicio SET Estado = ?, OS_LOCAL = ? WHERE OrdenServicioID = ?`, [
                    "FINA",
                    "UPDATE",
                    OrdenServicioID,
                ], (tx, results) => {
                    console.log("results -- FinalizarOSLocal", results.rowsAffected);
                })
            })
        })
        resolve(true)
    })
}

export const ActualizarFirmaLocal = async (OrdenServicioID, Firma) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`UPDATE OrdenesServicio SET Firma = ?, OS_LOCAL = ? WHERE OrdenServicioID = ?`, [
                JSON.stringify(Firma),
                "UPDATE",
                OrdenServicioID
            ], (tx, results) => {
                console.log("results -- ActualizarFirmaLocal", results.rowsAffected);
            })
        })
        resolve(true)
    })
}
/**
 * 
 * @param {} OrdenServicioID 
 * @returns 
 */
async function EliminarOrdenServicioLocal(OrdenServicioID) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`DELETE FROM OrdenesServicio WHERE OrdenServicioID = ?`, [
                OrdenServicioID
            ], (tx, results) => {
                console.log("results -- EliminarOrdenServicioLocal", results.rowsAffected);
            })
        })
        resolve(true)
    })
}


export const BuscarOrdenServicioLocales = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM OS_OrdenServicio WHERE OS_LOCAL = ?`,
                ['UPDATE'],
                (tx, results) => {
                    if (results.rows._array.length > 0) {
                        resolve(results.rows._array)
                    } else {
                        resolve(false)
                    }
                }
            )
        })
    })
}


/**
 * 
 * @param {*} OS 
 * @returns 
 */
const InserOSOrdenServicioIDLocal = async (OS) => {
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `INSERT INTO OS_OrdenServicio (
                    OS_CheckList,
                    OS_Encuesta,
                    OS_Firmas,
                    OS_PartesRepuestos,
                    OS_Anexos,
                    OS_Tiempos,
                    OS_Colaboradores,
                    provinciaId,
                    cantonId,
                    localidad,
                    tipoIncidencia ,
                    OrdenServicioID,
                    TipoVisita,
                    Fecha,
                    Estado,
                    Finalizado,
                    evento_id,
                    ticket_id,
                    empresa_id,
                    contrato_id,
                    equipo_id,
                    Serie,
                    TipoEquipo,
                    ModeloEquipo,
                    Marca,
                    ObservacionEquipo,
                    CodigoEquipoCliente,
                    ClienteID,
                    ClienteNombre,
                    Sintomas,
                    Causas,
                    Diagnostico,
                    Acciones,
                    SitioTrabajo,
                    EstadoEquipo,
                    ComentarioRestringido,
                    IncluyoUpgrade,
                    ComentarioUpgrade,
                    Seguimento,
                    FechaSeguimiento,
                    ObservacionCliente ,
                    ObservacionIngeniero,
                    IngenieroID,
                    UsuarioCreacion,
                    FechaCreacion,
                    UsuarioModificacion,
                    FechaModificacion,
                    IdEquipoContrato,
                    EstadoEqPrevio,
                    ContactoInforme,
                    CargoContactoInforme,
                    ObservacionCheckList,
                    Direccion,
                    Ciudad,
                    nuevaVisita,
                    incidencia,
                    release,
                    OS_ASUNTO,
                    OS_FINALIZADA,
                    enviado,
                    codOS,
                    OS_LOCAL
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
            , args: [
                JSON.stringify(OS.OS_CheckList),
                JSON.stringify(OS.OS_Encuesta),
                JSON.stringify(OS.OS_Firmas),
                JSON.stringify(OS.OS_PartesRepuestos),
                JSON.stringify(OS.OS_Anexos),
                JSON.stringify(OS.OS_Tiempos),
                JSON.stringify(OS.OS_Colaboradores),
                OS.provinciaId,
                OS.cantonId,
                OS.localidad,
                OS.tipoIncidencia,
                OS.OrdenServicioID,
                OS.TipoVisita,
                OS.Fecha,
                OS.Estado,
                OS.Finalizado,
                OS.evento_id,
                OS.ticket_id,
                OS.empresa_id,
                OS.contrato_id,
                OS.equipo_id,
                OS.Serie,
                OS.TipoEquipo,
                OS.ModeloEquipo,
                OS.Marca,
                OS.ObservacionEquipo,
                OS.CodigoEquipoCliente,
                OS.ClienteID,
                OS.ClienteNombre,
                OS.Sintomas,
                OS.Causas,
                OS.Diagnostico,
                OS.Acciones,
                OS.SitioTrabajo,
                OS.EstadoEquipo,
                OS.ComentarioRestringido,
                OS.IncluyoUpgrade,
                OS.ComentarioUpgrade,
                OS.Seguimento,
                OS.FechaSeguimiento,
                OS.ObservacionCliente,
                OS.ObservacionIngeniero,
                OS.IngenieroID,
                OS.UsuarioCreacion,
                OS.FechaCreacion,
                OS.UsuarioModificacion,
                OS.FechaModificacion,
                OS.IdEquipoContrato,
                OS.EstadoEqPrevio,
                OS.ContactoInforme,
                OS.CargoContactoInforme,
                OS.ObservacionCheckList,
                OS.Direccion,
                OS.Ciudad,
                OS.nuevaVisita,
                OS.incidencia,
                OS.release,
                OS.OS_ASUNTO,
                OS.OS_FINALIZADA,
                OS.enviado,
                OS.codOS,
                "UPDATE"
            ],
        }], false, (err, results) => {
            if (err) {
                console.log("error", err);
            } else {
                console.log("results OS_OrdenServicio -->", results);
            }
        })
        resolve(true)
    });
}

/**
 * 
 * @param {*} OS 
 * @returns 
 */
export const ActualizarOrdenServicioLocal = async (OS) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`UPDATE OS_OrdenServicio SET 
                OS_CheckList = ?,
                OS_Encuesta = ?,
                OS_Firmas = ?,
                OS_PartesRepuestos = ?,
                OS_Anexos = ?,
                OS_Tiempos = ?,
                OS_Colaboradores = ?,
                provinciaId = ?,
                cantonId = ?,
                localidad = ?,
                tipoIncidencia = ?,
                OrdenServicioID = ?,
                TipoVisita = ?,
                Fecha = ?,
                Estado = ?,
                Finalizado = ?,
                evento_id = ?,
                ticket_id = ?,
                empresa_id = ?,
                contrato_id = ?,
                equipo_id = ?,
                Serie = ?,
                TipoEquipo = ?,
                ModeloEquipo = ?,
                Marca = ?,
                ObservacionEquipo = ?,
                CodigoEquipoCliente = ?,
                ClienteID = ?,
                ClienteNombre = ?,
                Sintomas = ?,
                Causas = ?,
                Diagnostico = ?,
                Acciones = ?,
                SitioTrabajo = ?,
                EstadoEquipo = ?,
                ComentarioRestringido = ?,
                IncluyoUpgrade = ?,
                ComentarioUpgrade = ?,
                Seguimento = ?,
                FechaSeguimiento = ?,
                ObservacionCliente = ?,
                ObservacionIngeniero = ?,
                IngenieroID = ?,
                UsuarioCreacion = ?,
                FechaCreacion = ?,
                UsuarioModificacion = ?,
                FechaModificacion = ?,
                IdEquipoContrato = ?,
                EstadoEqPrevio = ?,
                ContactoInforme = ?,
                CargoContactoInforme = ?,
                ObservacionCheckList = ?,
                Direccion = ?,
                Ciudad = ?,
                nuevaVisita = ?,
                incidencia = ?,
                release = ?,
                OS_ASUNTO = ?,
                OS_FINALIZADA = ?,
                enviado = ?,
                codOS = ?,
                OS_LOCAL = ?
                WHERE OrdenServicioID = ?`, [
                JSON.stringify(OS.OS_CheckList),
                JSON.stringify(OS.OS_Encuesta),
                JSON.stringify(OS.OS_Firmas),
                JSON.stringify(OS.OS_PartesRepuestos),
                JSON.stringify(OS.OS_Anexos),
                JSON.stringify(OS.OS_Tiempos),
                JSON.stringify(OS.OS_Colaboradores),
                OS.provinciaId,
                OS.cantonId,
                OS.localidad,
                OS.tipoIncidencia,
                OS.OrdenServicioID,
                OS.TipoVisita,
                OS.Fecha,
                OS.Estado,
                OS.Finalizado,
                OS.evento_id,
                OS.ticket_id,
                OS.empresa_id,
                OS.contrato_id,
                OS.equipo_id,
                OS.Serie,
                OS.TipoEquipo,
                OS.ModeloEquipo,
                OS.Marca,
                OS.ObservacionEquipo,
                OS.CodigoEquipoCliente,
                OS.ClienteID,
                OS.ClienteNombre,
                OS.Sintomas,
                OS.Causas,
                OS.Diagnostico,
                OS.Acciones,
                OS.SitioTrabajo,
                OS.EstadoEquipo,
                OS.ComentarioRestringido,
                OS.IncluyoUpgrade,
                OS.ComentarioUpgrade,
                OS.Seguimento,
                OS.FechaSeguimiento,
                OS.ObservacionCliente,
                OS.ObservacionIngeniero,
                OS.IngenieroID,
                OS.UsuarioCreacion,
                OS.FechaCreacion,
                OS.UsuarioModificacion,
                OS.FechaModificacion,
                OS.IdEquipoContrato,
                OS.EstadoEqPrevio,
                OS.ContactoInforme,
                OS.CargoContactoInforme,
                OS.ObservacionCheckList,
                OS.Direccion,
                OS.Ciudad,
                OS.nuevaVisita,
                OS.incidencia,
                OS.release,
                OS.OS_ASUNTO,
                OS.OS_FINALIZADA,
                OS.enviado,
                OS.codOS,
                "UPDATE",
                OS.OrdenServicioID
            ], (tx, results) => {
                console.log("results OS_OrdenServicio -->", results);
                resolve(true)
            }
            );
        });
    });
}


export const RestablecerLocalStore = async () => {
    await AsyncStorage.removeItem("OS_PartesRepuestos")
    await AsyncStorage.removeItem("OS_CheckList")
    await AsyncStorage.removeItem("OS_Tiempos")
    await AsyncStorage.removeItem("OS_Firmas")
    await AsyncStorage.removeItem("OS_Anexos")
    await AsyncStorage.removeItem("OS")
    await AsyncStorage.setItem("OS_PartesRepuestos", JSON.stringify(OS_PartesRepuestos))
    await AsyncStorage.setItem("OS_CheckList", JSON.stringify(OS_CheckList))
    await AsyncStorage.setItem("OS_Tiempos", JSON.stringify(OS_Tiempos))
    await AsyncStorage.setItem("OS_Firmas", JSON.stringify(OS_Firmas))
    await AsyncStorage.setItem("OS_Anexos", JSON.stringify(OS_Anexos))
    await AsyncStorage.setItem("OS", JSON.stringify({
        provinciaId: null,
        cantonId: null,
        tipoIncidencia: "",
        localidad: null,
        equ_hardware: null,
        con_contratoLegal: "",
        equ_fechaFabricacion: null,
        equ_systemCode: null,
        OrdenServicioID: 0,
        TipoVisita: "",
        Fecha: "",
        Estado: "ACTI",
        Finalizado: null,
        evento_id: 0,
        ticket_id: 0,
        empresa_id: 1,
        contrato_id: 0,
        equipo_id: 0,
        Serie: null,
        TipoEquipo: null,
        ModeloEquipo: null,
        Marca: "",
        ObservacionEquipo: null,
        CodigoEquipoCliente: "",
        ClienteID: "",
        ClienteNombre: "",
        Sintomas: "",
        Causas: "",
        Diagnostico: " ",
        Acciones: "",
        SitioTrabajo: "",
        EstadoEquipo: "",
        ComentarioRestringido: "",
        IncluyoUpgrade: true,
        ComentarioUpgrade: "",
        Seguimento: true,
        FechaSeguimiento: "",
        ObservacionCliente: "",
        ObservacionIngeniero: "",
        IngenieroID: null,
        UsuarioCreacion: null,
        UsuarioModificacion: null,
        FechaCreacion: "",
        FechaModificacion: "",
        IdEquipoContrato: 0,
        EstadoEqPrevio: "",
        ContactoInforme: "",
        CargoContactoInforme: "",
        ObservacionCheckList: "",
        Direccion: "",
        Ciudad: "",
        incidencia: "",
        nuevaVisita: true,
        release: "",
        OS_Anexos: [],
        OS_CheckList: [],
        OS_Colaboradores: [],
        OS_Encuesta: [],
        OS_Firmas: [],
        OS_PartesRepuestos: [],
        OS_Tiempos: [],
        OS_LOCAL: 'ENVIADO'
    }))
}