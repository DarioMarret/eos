import { host } from "../utils/constantes";
import { getToken } from "./usuario";
import db from './Database/model';
import isEmpty from "is-empty";

//Consulta Orden de servicio por ID (CONSULTA SOLO SI EL ID ES MAYOR A 0)
export const OSOrdenServicioID = async (OrdenServicioID) => {
    if (OrdenServicioID != 0) {
        try {
            const { token, userId } = await getToken()
            console.log("----> ", token, "\n", userId)
            const url = `${host}MSOrdenServicio/api/OS_OrdenServicio/${OrdenServicioID}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            const resultado = await response.json()
            const { Response } = resultado
            if (!isEmpty(Response)) {
                await InserOSOrdenServicioID(Response)
                return true
            }
        } catch (error) {
            console.log("errores OSOrdenServicioID--->", error);
            return false
        }
    } else {
        return true
    }
}
/**
 * 
 * @param {
 * "OrdenServicioID": [int],
 * } OrdenServicioID 
 */
export const UpdateOSOrdenServicioID = async (OrdenServicioID) => {
    try {
        const { token, userId } = await getToken()
        OrdenServicioID.map(async (item) => {
            const url = `${host}MSOrdenServicio/api/OS_OrdenServicio/${item}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            const resultado = await response.json()
            const { Response } = resultado
            console.log("UpdateOSOrdenServicioID-->", Response)
            await InserOSOrdenServicioID(Response)
            return true
        })
    } catch (error) {
        console.log("errores OSOrdenServicioID--->", error);
    }
}

export const InserOSOrdenServicioID = async (r) => {
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
                        codOS
                    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
            , args: [
                JSON.stringify(r.OS_CheckList),
                JSON.stringify(r.OS_Encuesta),
                JSON.stringify(r.OS_Firmas),
                JSON.stringify(r.OS_PartesRepuestos),
                JSON.stringify(r.OS_Anexos),
                JSON.stringify(r.OS_Tiempos),
                JSON.stringify(r.OS_Colaboradores),
                r.provinciaId,
                r.cantonId,
                r.localidad,
                r.tipoIncidencia,
                r.OrdenServicioID,
                r.TipoVisita,
                r.Fecha,
                r.Estado,
                r.Finalizado,
                r.evento_id,
                r.ticket_id,
                r.empresa_id,
                r.contrato_id,
                r.equipo_id,
                r.Serie,
                r.TipoEquipo,
                r.ModeloEquipo,
                r.Marca,
                r.ObservacionEquipo,
                r.CodigoEquipoCliente,
                r.ClienteID,
                r.ClienteNombre,
                r.Sintomas,
                r.Causas,
                r.Diagnostico,
                r.Acciones,
                r.SitioTrabajo,
                r.EstadoEquipo,
                r.ComentarioRestringido,
                r.IncluyoUpgrade,
                r.ComentarioUpgrade,
                r.Seguimento,
                r.FechaSeguimiento,
                r.ObservacionCliente,
                r.ObservacionIngeniero,
                r.IngenieroID,
                r.UsuarioCreacion,
                r.FechaCreacion,
                r.UsuarioModificacion,
                r.FechaModificacion,
                r.IdEquipoContrato,
                r.EstadoEqPrevio,
                r.ContactoInforme,
                r.CargoContactoInforme,
                r.ObservacionCheckList,
                r.Direccion,
                r.Ciudad,
                r.nuevaVisita,
                r.incidencia,
                r.release,
                r.OS_ASUNTO,
                r.OS_FINALIZADA,
                r.enviado,
                r.codOS

                // r.equ_hardware,
                // r.con_contratoLegal,
                // r.equ_fechaFabricacion,
                // r.equ_systemCode,
                // r.TipoEquipoDesc,
                // r.ModeloEquipoDesc,
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


export const ConsultaOSOrdenServicioID = async (OrdenServicioID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT 
            OS_CheckList,
            OS_Firmas,
            OS_PartesRepuestos,
            OS_Tiempos,
            OS_Anexos,
            provinciaId,
            cantonId,
            localidad,
            tipoIncidencia,
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
            ObservacionCliente,
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
            enviado,
            codOS,
            OS_LOCAL
             FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    console.log("OS_OrdenServicioID-->", OrdenServicioID);
                    console.log("OS_OrdenServicioID-->", _array);
                    if (_array.length > 0) {
                        resolve(_array)
                    } else {
                        resolve(false)
                    }
                })
        })
    });
}

export async function SelectOSOrdenServicioIDEquipo(OrdenServicioID) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT equipo_id FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        console.log("existe OS_OrdenServicioID-->", _array)
                        resolve(_array[0].equipo_id)
                    } else {
                        resolve(false)
                    }
                })
        })
    })
}

export async function SelectOSOrdenServicioID(OrdenServicioID) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT * FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        console.log("existe OS_OrdenServicioID-->", _array[0].OrdenServicioID)
                        resolve(_array)
                    } else {
                        resolve(false)
                    }
                })
        })
    })
}

export async function DeleteOrdenServicioID(OrdenServicioID) {
    return new Promise((resolve, reject) => {
        OrdenServicioID.map((item) => {
            db.transaction((tx) => {
                tx.executeSql(`DELETE FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                    [item], (_, { rows: { _array } }) => {
                        if (_array.length > 0) {
                            console.log("existe OS_OrdenServicioID-->", _array)
                            resolve(_array)
                        } else {
                            resolve(false)
                        }
                    })
            })

        })
    })
}

export async function SelectObservacionClienteID(OrdenServicioID) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT ObservacionCliente FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(_array[0].ObservacionCliente)
                    } else {
                        resolve(false)
                    }
                })
        })
    })
}
//esta funcion vizualizar el pdf
export async function PDFVisializar(OrdenServicioID) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT OS_FINALIZADA FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(_array[0].OS_FINALIZADA)
                    } else {
                        resolve(false)
                    }
                })
        });
    })
}
//esta funcion sacar OS_ASUNTO, OS_Firmas, enviado
export async function SacarOSasunto(OrdenServicioID) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT OS_ASUNTO, OS_Firmas, OS_FINALIZADA, ClienteNombre FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve({
                            OS_ASUNTO: _array[0].OS_ASUNTO,
                            OS_FINALIZADA: _array[0].OS_FINALIZADA,
                            OS_Firmas: _array[0].OS_Firmas,
                            ClienteNombre: _array[0].ClienteNombre
                        })
                    } else {
                        resolve(false)
                    }
                })
        });
    })
}

export async function getRucCliente(OrdenServicioID) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT ClienteID, UsuarioCreacion FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve({ ClienteID: _array[0].ClienteID, UsuarioCreacion: _array[0].UsuarioCreacion })
                    } else {
                        resolve(false)
                    }
                })
        });
    })
}

//esta funcion la vamos a llamra cuendo estemos en el tab de los Equipo
export async function DatosEquipo(OrdenServicioID) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT 
            equipo_id, Serie, ModeloEquipo
            FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(_array)
                    } else {
                        resolve(false)
                    }
                })
        });
    })
}

//esta funcion la vamos a llamra cuendo estemos en el tab de los tiempo
export async function TiempoOSOrdenServicioID(OrdenServicioID) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT OS_Tiempos FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(_array)
                    } else {
                        resolve(false)
                    }
                })
        });
    })
}

//esta funcion la vamos a llamra cuendo estemos en el tab de los cliente
export async function datosClienteOSOrdenServicioID(OrdenServicioID) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT 
            ClienteNombre,
            codOS,Ciudad,Direccion,FechaCreacion, contrato_id, CodigoEquipoCliente,
            Estado, ticket_id
             FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(_array)
                    } else {
                        resolve(false)
                    }
                })
        });
    })
}

//esta funcion la vamos a llamara cuendo estemos en el tab de los datos
export async function DatosOSOrdenServicioID(OrdenServicioID) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT 
            Diagnostico,
            tipoIncidencia,
            Sintomas,
            Causas,
            Acciones, 
            SitioTrabajo, 
            IncluyoUpgrade,
            EstadoEquipo,
            EstadoEqPrevio,
            FechaSeguimiento, ObservacionIngeniero, FechaSeguimiento,
            OS_CheckList,ObservacionCheckList, ticket_id, TipoVisita
             FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(_array)
                    } else {
                        resolve(false)
                    }
                })
        });
    })
}

//esta funcion la vamos a llamra cuendo estemos en el tab de los componente
export async function ComponenteOSOrdenServicioID(OrdenServicioID) {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT OS_PartesRepuestos FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(_array)
                    } else {
                        resolve(false)
                    }
                })
        });
    })
}

export const EstadoOSLOCAL = (OrdenServicioID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT OS_LOCAL FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(_array[0].OS_LOCAL)
                    } else {
                        resolve(false)
                    }
                })
        });
    })
}

export const SacarDatosClienteOS = (OrdenServicioID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT ClienteNombre, Direccion, Ciudad, CodigoEquipoCliente, ClienteID FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(_array[0])
                    } else {
                        resolve(false)
                    }
                })
        });
    })
}


export const InserOSOrdenServicioIDLocal = async (r, rando) => {
    console.log("InserOSOrdenServicioIDLocal-->", r.OrdenServicioID)
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
                    OS_LOCAL,
                    es
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
            , args: [
                JSON.stringify(r.OS_CheckList),
                JSON.stringify(r.OS_Encuesta),
                JSON.stringify(r.OS_Firmas),
                JSON.stringify(r.OS_PartesRepuestos),
                JSON.stringify(r.OS_Anexos),
                JSON.stringify(r.OS_Tiempos),
                JSON.stringify(r.OS_Colaboradores),
                r.provinciaId,
                r.cantonId,
                r.localidad,
                r.tipoIncidencia,
                rando,
                r.TipoVisita,
                r.Fecha,
                r.Estado,
                r.Finalizado,
                r.evento_id,
                r.ticket_id,
                r.empresa_id,
                r.contrato_id,
                r.equipo_id,
                r.Serie,
                r.TipoEquipo,
                r.ModeloEquipo,
                r.Marca,
                r.ObservacionEquipo,
                r.CodigoEquipoCliente,
                r.ClienteID,
                r.ClienteNombre,
                r.Sintomas,
                r.Causas,
                r.Diagnostico,
                r.Acciones,
                r.SitioTrabajo,
                r.EstadoEquipo,
                r.ComentarioRestringido,
                r.IncluyoUpgrade,
                r.ComentarioUpgrade,
                r.Seguimento,
                r.FechaSeguimiento,
                r.ObservacionCliente,
                r.ObservacionIngeniero,
                r.IngenieroID,
                r.UsuarioCreacion,
                r.FechaCreacion,
                r.UsuarioModificacion,
                r.FechaModificacion,
                r.IdEquipoContrato,
                r.EstadoEqPrevio,
                r.ContactoInforme,
                r.CargoContactoInforme,
                r.ObservacionCheckList,
                r.Direccion,
                r.Ciudad,
                r.nuevaVisita,
                r.incidencia,
                r.release,
                r.OS_ASUNTO,
                r.OS_FINALIZADA,
                r.enviado,
                r.codOS,
                "UPDATE",
                r.es
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

export const ListarOrdenServicioLocal = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM OS_OrdenServicio WHERE OS_LOCAL = ?`,
                ['UPDATE'],
                (tx, results) => {
                    if (results.rows.length > 0) {
                        resolve(results.rows._array)
                    } else {
                        resolve(false)
                    }
                }
            );
        });
    })
}

export const ListarFirmas = async (OrdenServicioID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT OS_Firmas FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(_array[0].OS_Firmas)
                    } else {
                        resolve(false)
                    }
                })
        })
    })
}

export const SacarClienteID = async (OrdenServicioID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT ClienteID FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(_array[0].ClienteID)
                    } else {
                        resolve([])
                    }
                })
        })
    })
}
export const SacarFirmas = async (OrdenServicioID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT OS_Firmas FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(JSON.parse(_array[0].OS_Firmas))
                    } else {
                        resolve([])
                    }
                })
        })
    })
}
export const SacarCheckList = async (OrdenServicioID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT OS_CheckList FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(JSON.parse(_array[0].OS_CheckList))
                    } else {
                        resolve([])
                    }
                })
        })
    })
}

export const SacarAnexo = async (OrdenServicioID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT OS_Anexos FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(JSON.parse(_array[0].OS_Anexos))
                    } else {
                        resolve([])
                    }
                })
        })
    })
}

export const SacarParte = async (OrdenServicioID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT OS_PartesRepuestos FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(JSON.parse(_array[0].OS_PartesRepuestos))
                    } else {
                        resolve([])
                    }
                })
        })
    })
}

export const SacarTiempos = async (OrdenServicioID) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(`SELECT OS_Tiempos FROM OS_OrdenServicio WHERE OrdenServicioID = ?`,
                [OrdenServicioID], (_, { rows: { _array } }) => {
                    if (_array.length > 0) {
                        resolve(JSON.parse(_array[0].OS_Tiempos))
                    } else {
                        resolve([])
                    }
                })
        })
    })
}

//para actualizarla firma
export async function ActualizarOrdenServicioFirmas(Firmas, OrdenServicioID) {
    console.log("ActualizarOrdenServicioFirmas", OrdenServicioID)
    db.transaction((tx) => {
        tx.executeSql(
            `UPDATE OS_OrdenServicio SET
            OS_Firmas = ?,
            OS_LOCAL = ?
            WHERE OrdenServicioID = ?`,
            [JSON.stringify(Firmas), 'UPDATE', OrdenServicioID], (_, { rowsAffected }) => {
                if (rowsAffected > 0) {
                    console.log("actualizado", rowsAffected)
                    return true
                } else {
                    return false
                }
            })
    });
}
export async function ActualizarOrdenServicioTiempo(Tiempos, OrdenServicioID) {
    console.log("ActualizarOrdenServicioTiempo", Tiempos, OrdenServicioID)
    db.transaction((tx) => {
        tx.executeSql(
            `UPDATE OS_OrdenServicio SET
            OS_Tiempos = ?,
            OS_LOCAL = ?
            WHERE OrdenServicioID = ?`,
            [JSON.stringify(Tiempos), 'UPDATE',
                OrdenServicioID,
            ], (_, { rowsAffected }) => {
                if (rowsAffected > 0) {
                    console.log("actualizado", rowsAffected)
                    return true
                } else {
                    return false
                }
            })
    })
}
export async function ActualizarOrdenServicioPartesRepuestos(PartesRepuestos, OrdenServicioID) {
    console.log("ActualizarOrdenServicioPartesRepuestos", PartesRepuestos, OrdenServicioID)
    db.transaction((tx) => {
        tx.executeSql(
            `UPDATE OS_OrdenServicio SET
            OS_PartesRepuestos = ?,
            OS_LOCAL = ?
            WHERE OrdenServicioID = ?`,
            [JSON.stringify(PartesRepuestos), 'UPDATE',
                OrdenServicioID,
            ], (_, { rowsAffected }) => {
                if (rowsAffected > 0) {
                    console.log("actualizado", rowsAffected)
                    return true
                } else {
                    return false
                }
            })
    })
}

export async function ActualizarOrdenServicioAnexos(Anexos, OrdenServicioID) {
    console.log("ActualizarOrdenServicioAnexos", Anexos, OrdenServicioID)
    db.transaction((tx) => {
        tx.executeSql(
            `UPDATE OS_OrdenServicio SET
            OS_Anexos = ?,
            OS_LOCAL = ?
            WHERE OrdenServicioID = ?`,
            [JSON.stringify(Anexos), 'UPDATE',
                OrdenServicioID,
            ], (_, { rowsAffected }) => {
                if (rowsAffected > 0) {
                    console.log("actualizado", rowsAffected)
                    return true
                } else {
                    return false
                }
            })
    })
}

export async function ActualizarOrdenServicioCheckList(CheckList, OrdenServicioID) {
    console.log("ActualizarOrdenServicioCheckList", CheckList, OrdenServicioID)
    db.transaction((tx) => {
        tx.executeSql(
            `UPDATE OS_OrdenServicio SET
            OS_CheckList = ?,
            OS_LOCAL = ?
            WHERE OrdenServicioID = ?`,
            [JSON.stringify(CheckList), 'UPDATE',
                OrdenServicioID,
            ], (_, { rowsAffected }) => {
                if (rowsAffected > 0) {
                    console.log("actualizado", rowsAffected)
                    return true
                } else {
                    return false
                }
            })
    })
}

/**
 * 
 * @param {*} OS objecto de la orden de servicio
 * @param {*} OrdenServicioID 
 */
export async function ActualizarOrdenServicioOS(OS, OrdenServicioID) {
    console.log("ActualizarOrdenServicioOS", OS, OrdenServicioID)
    db.transaction((tx) => {
        tx.executeSql(
            `UPDATE OS_OrdenServicio SET
            OS_OS = ?,
            OS_LOCAL = ?
            WHERE OrdenServicioID = ?`,
            [JSON.stringify(OS), 'UPDATE',
                OrdenServicioID,
            ], (_, { rowsAffected }) => {
                if (rowsAffected > 0) {
                    console.log("actualizado", rowsAffected)
                    return true
                } else {
                    return false
                }
            })
    })
}

/**
 * 
 * @param {*} OrdenServicioID 
 * @param {*} Estado 
 */
export async function ActualizarEstadoOS(OrdenServicioID, Estado) {
    console.log("ActualizarEstadoOS", OrdenServicioID, Estado)
    db.exec([{
        sql: `UPDATE OS_OrdenServicio SET Estado = ?, OS_LOCAL = ? WHERE OrdenServicioID = ?`,
        args: [Estado, 'UPDATE', OrdenServicioID]
    }], false, (err, results) => {
        if (err) {
            console.log("ActualizaEstadoOrdenServicioAnidadas", err)
        } else {
            console.log("ActualizaEstadoOrdenServicioAnidadas", results)
        }
    })
}


export async function ActualizarObservacioCliente(OrdenServicioID, ObservacionCliente) {
    console.log("ActualizarObservacioCliente", OrdenServicioID, ObservacionCliente)
    db.exec([{
        sql: `UPDATE OS_OrdenServicio SET ObservacionCliente = ?, OS_LOCAL = ? WHERE OrdenServicioID = ?`,
        args: [ObservacionCliente, 'UPDATE', OrdenServicioID]
    }], false, (err, results) => {
        if (err) {
            console.log("ActualizarObservacioCliente", err)
        } else {
            console.log("ActualizarObservacioCliente", results)
        }
    })
}
/**
 * 
 * @param {*} OrdenServicioID 
 * @param {*} EstadoEquipo 
 * @param {*} OS_FINALIZADA 
 * @param {*} Estado 
 * @param {*} id 
 */
export const ActualizarOrdenServicioRespuesta = async (OrdenServicioID, EstadoEquipo, OS_FINALIZADA, Estado, id) => {
    console.log("ActualizarOrdenServicioRespuesta", OrdenServicioID, EstadoEquipo, Estado, id)
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `UPDATE OS_OrdenServicio SET 
            EstadoEquipo = ?, 
            OS_FINALIZADA = ?, 
            Estado = ?, 
            OS_LOCAL = ?, 
            OrdenServicioID = ?, 
            codOS = ? 
            WHERE id = ?`,
            args: [EstadoEquipo, OS_FINALIZADA, Estado, 'SIN', OrdenServicioID, `OSO${OrdenServicioID}`, id]
        }], false, (err, results) => {
            if (err) {
                console.log("ActualizaEstadoOrdenServicioAnidadas", err)
                resolve(err)
            } else {
                console.log("ActualizaEstadoOrdenServicioAnidadas", results)
                resolve(results)
            }
        })
    })
}

/**
 * 
 * @param {*} OrdenServicioID 
 * @param {*} EstadoEquipo 
 * @param {*} OS_FINALIZADA 
 * @param {*} Estado 
 * @param {*} id 
 */
 export const ActualizarOrdenServicioRespuestaPUT = async (OrdenServicioID, EstadoEquipo, OS_FINALIZADA, Estado) => {
    console.log("ActualizarOrdenServicioRespuesta", OrdenServicioID, EstadoEquipo, Estado)
    return new Promise((resolve, reject) => {
        db.exec([{
            sql: `UPDATE OS_OrdenServicio SET 
            EstadoEquipo = ?, 
            OS_FINALIZADA = ?, 
            Estado = ?, 
            OS_LOCAL = ?
            WHERE OrdenServicioID = ?`,
            args: [EstadoEquipo, OS_FINALIZADA, Estado, 'SIN', OrdenServicioID]
        }], false, (err, results) => {
            if (err) {
                console.log("ActualizarOrdenServicioRespuestaPUT", err)
                resolve(err)
            } else {
                console.log("ActualizarOrdenServicioRespuestaPUT", results)
                resolve(results)
            }
        })
    })
}