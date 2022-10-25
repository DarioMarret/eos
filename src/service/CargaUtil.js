import { ExisteHistorialEquipoClienteNombre, HistorialEquipoIngeniero, HistorialEquipoPorCliente } from "./historiaEquipo";
import { ConfiiguracionBasicas, estadoTabla } from "./config";
import { getModeloEquipos } from "./modeloquipo";
import { GetEventosByTicket, GetEventosDelDia } from "./OSevento";
import { getIngenieros } from "./ingenieros";
import { getClientes } from "./clientes";
import { getEquipos } from "./equipos";
import db from "./Database/model";
import { getTPTCKStorage } from "./catalogos";
import { EquipoTicket } from "./equipoTicketID";
import { OrdenServicioAnidadas } from "./OrdenServicioAnidadas";
import moment from "moment";
import { OSOrdenServicioID } from "./OS_OrdenServicio";
import isEmpty from "is-empty";


export const CardaUtil = async () => {
    try {
        await getIngenieros();
        console.log("getIngenieros fin")


        const existeHist = await estadoTabla('historialEquipo')
        console.log('existeHist', existeHist)
        if (existeHist == false) {
            await HistorialEquipoIngeniero();
            console.log("HistorialEquipoIngeniero fin")
        }

        const existeEquipo = await estadoTabla('tiposEquipos')
        console.log('existeEquipo', existeEquipo)
        if (existeEquipo == false) {
            await getEquipos();
            console.log("getEquipos fin")
        }

        const existeModelo = await estadoTabla('modelosEquipo')
        console.log('existeModelo', existeModelo)
        if (existeModelo == false) {
            await getModeloEquipos();
            console.log("getModeloEquipos fin")
        }

        const existetable = await estadoTabla("cliente");
        if (existetable == false) {
            await getClientes();
            console.log("getClientes fin")
        }

        await ConfiiguracionBasicas();
        console.log("ConfiiguracionBasicas fin")


        await getTPTCKStorage()

        await GetEventosDelDia()
        var ayer = moment().add(-1, 'days').format('YYYY-MM-DD');
        var hoy = moment().format('YYYY-MM-DD');
        var manana = moment().add(1, 'days').format('YYYY-MM-DD');
        const ticket_id = await GetEventosByTicket(ayer, hoy, manana)
        let id_ticket = []
        let evento_id = []
        let OrdenServicioID = []
        let tck_cliente = []
        for (let index = 0; index < ticket_id.length; index++) {
          let item = ticket_id[index];
          id_ticket.push(item.ticket_id)
          evento_id.push(item.evento_id)
          OrdenServicioID.push(item.OrdenServicioID)
          tck_cliente.push(item.tck_cliente)
        }

        console.log("id_ticket", id_ticket)
        console.log("evento_id", evento_id)
        console.log("OrdenServicioID", OrdenServicioID)

        //para guardar los equipos por ticket
        console.log("guardar equipos por ticket", id_ticket.length)
        for (let index = 0; index < id_ticket.length; index++) {
          let item = id_ticket[index];
          console.log("item", item)
          console.log("index", index)
          console.log("\n")
          await EquipoTicket(item)
        }

        //Para buscar eventos anidadas a la orden
        for (let index = 0; index < evento_id.length; index++) {
          let item = evento_id[index];
          await OrdenServicioAnidadas(item)
        }

        //para guardar lo que venga con OS
        for (let index = 0; index < OrdenServicioID.length; index++) {
          let item = OrdenServicioID[index];
          await OSOrdenServicioID(item)
        }

        var arrayRuc = ""
        //para verificar si hay evetos con cliente no registrado 247
        for (let index = 0; index < tck_cliente.length; index++) {
          let item = tck_cliente[index];
          const existe = await ExisteHistorialEquipoClienteNombre(item)
          if (existe) {
            console.log("existe", existe)
          } else {
            console.log("existe", existe)
            console.log("sacarRuc", sacarRuc[0].CustomerID)
            arrayRuc += sacarRuc[0].CustomerID + "|"
          }
        }
        if (!isEmpty(arrayRuc)) {
          console.log("arrayRuc", arrayRuc)
          await HistorialEquipoPorCliente(arrayRuc)
        }
    } catch (error) {
        console.log("CardaUtil-->", error)
        return false
    }
}

export const time = time => new Promise(resolve => setTimeout(resolve, time));


//eliminar tablas cada que cierre la app
export const TrucateTable = async () => {
    db.transaction(tx => {
        tx.executeSql('drop table ingenieros', [], (_, { rows }) => {
            console.log("delete table ingenieros", rows);
        })
    })
    db.transaction(tx => {
        tx.executeSql('drop table OrdenesServicio', [], (_, { rows }) => {
            console.log("delete table OrdenesServicio", rows);
        })
    })
    db.transaction(tx => {
        tx.executeSql('drop table equipoTicket', [], (_, { rows }) => {
            console.log("delete table equipoTicket", rows);
        })
    })

    db.transaction(tx => {
        tx.executeSql('drop table ordenesAnidadas', [], (_, { rows }) => {
            console.log("delete table ordenesAnidadas", rows);
        })
    })
    Restablecer()
}

//Truncar tablas ordenesAnidadas equipoTicket historialEquipo OrdenesServicio cada que sincronice
export const TrucateUpdate = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('drop table OrdenesServicio', [], (_, { rows }) => {
                console.log("drop table OrdenesServicio", rows);
            });
        })
        db.transaction(tx => {
            tx.executeSql('drop table equipoTicket', [], (_, { rows }) => {
                console.log("drop table equipoTicket", rows);
            });
        })
        db.transaction(tx => {
            tx.executeSql('drop table ordenesAnidadas', [], (_, { rows }) => {
                console.log("drop table ordenesAnidadas", rows);
            });
        })
        db.transaction(tx => {
            tx.executeSql('drop from OS_OrdenServicio', [], (_, { rows }) => {
                console.log("drop table OS_OrdenServicio", rows);
            });
        })
        Restablecer()
        resolve(true)
    })
}

export const TrucateUpdateHoy = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('drop table OrdenesServicio', [], (_, { rows }) => {
                console.log("drop table OrdenesServicio", rows);
            });
        })
        db.transaction(tx => {
            tx.executeSql('drop table equipoTicket', [], (_, { rows }) => {
                console.log("drop table equipoTicket", rows);
            });
        })
        db.transaction(tx => {
            tx.executeSql('drop table ordenesAnidadas', [], (_, { rows }) => {
                console.log("drop table ordenesAnidadas", rows);
            });
        })
        RestablecerHoy()
        resolve(true)
    })
}

export const RestablecerHoy = async () => {
    db.transaction(tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS OrdenesServicio 
    (
        evento_id INTEGER NULL,
        ticket_id INTEGER NULL,
        codOS TEXT NULL,
        codTicket INTEGER,
        tck_cliente TEXT NULL,
        tck_tipoTicket TEXT NULL,
        tck_tipoTicketDesc TEXT NULL,
        tck_descripcionProblema TEXT NULL,
        ev_fechaAsignadaDesde INTEGER NULL,
        ev_fechaAsignadaHasta INTEGER NULL,
        ev_horaAsignadaDesde TEXT NULL,
        ev_horaAsignadaHasta TEXT NULL,
        ev_estado TEXT NULL,
        tck_direccion TEXT NULL,
        tck_canton TEXT NULL,
        tck_provincia TEXT NULL,
        tck_reporta TEXT NULL,
        tck_telefonoReporta TEXT NULL,
        tck_usuario_creacion INTEGER NULL,
        tck_estadoTicket TEXT NULL,
        ev_descripcion TEXT NULL,
        id_contrato TEXT NULL,
        ingenieroId INTEGER NULL,
        ingeniero TEXT NULL,
        tipoIncidencia TEXT NULL,
        OrdenServicioID INTEGER NULL,
        tck_tipoTicketCod TEXT NULL,
        estado_local TEXT NULL
    );`)
    })

    db.transaction(tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS equipoTicket (
        id_equipoContrato INTEGER NULL,
        con_ClienteNombre TEXT NULL,
        id_equipo INTEGER NULL,
        id_contrato INTEGER NULL,
        empresa_id INTEGER NULL,
        eqc_conRepuesto TEXT NULL,
        eqc_frecuenciaVisita TEXT NULL,
        eqc_periodo TEXT NULL,
        eqc_tiempoVisita TEXT NULL,
        eqc_horarioAtencionDesde TEXT NULL,
        eqc_horarioAtencionHasta TEXT NULL,
        eqc_lunes TEXT NULL,
        eqc_martes TEXT NULL,
        eqc_miercoles TEXT NULL,
        eqc_jueves TEXT NULL,
        eqc_viernes TEXT NULL,
        eqc_sabado TEXT NULL,
        eqc_domingo TEXT NULL,
        eqc_monto TEXT NULL,
        eqc_usuarioCreacion INTEGER NULL,
        eqc_UsuarioModificacion TEXT NULL,
        eqc_fechaCreacion TEXT NULL,
        eqc_fechaModificacion TEXT NULL,
        localidad_id TEXT NULL,
        eqc_estado TEXT NULL,
        eqc_tiempoServicio TEXT NULL,
        eqc_frecuenciaServicio TEXT NULL,
        eqc_manoObra TEXT NULL,
        eqc_estadoProgramado TEXT NULL,
        eqc_fechaIniGaranC TEXT NULL,
        eqc_fechaFinGaranC TEXT NULL,
        eqc_fechaServicio TEXT NULL,
        eqc_fechaServicioFin TEXT NULL,
        eqc_oldContract TEXT NULL,
        eqc_tiempoRepuestos TEXT NULL,
        eqc_tiempoManoObra TEXT NULL,
        eqc_consumibles TEXT NULL,
        eqc_tiempoConsumibles TEXT NULL,
        eqc_fungibles TEXT NULL,
        eqc_tiempoFungibles TEXT NULL,
        eqc_kitMantenimiento TEXT NULL,
        eqc_fechaKitMantenimiento TEXT NULL,
        eqc_rutaAdjunto TEXT NULL,
        eqc_rucComodato TEXT NULL,
        eqc_codComodato TEXT NULL,
        eqc_frecVisSitePlan TEXT NULL,
        eqc_periodoSitePlan TEXT NULL,
        eqc_observacion TEXT NULL,
        Equipo TEXT NULL,
        estado_local TEXT NULL,
        ticket_id INTEGER NOT NULL
    );`)
    })

    db.transaction(tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS ordenesAnidadas
    (
        evento_id INTEGER,
        ticket_id INTEGER,
        codOS TEXT NULL,
        codeTicket TEXT NULL,
        tck_cliente TEXT NULL,
        tck_tipoTicket TEXT NULL,
        tck_tipoTicketDesc TEXT NULL,
        tck_descripcionProblema TEXT NULL,
        ev_fechaAsignadaDesde TEXT NULL,
        ev_fechaAsignadaHasta TEXT NULL,
        ev_horaAsignadaDesde TEXT NULL,
        ev_horaAsignadaHasta TEXT NULL,
        ev_estado TEXT NULL,
        tck_direccion TEXT NULL,
        tck_canton TEXT NULL,
        tck_provincia TEXT NULL,
        tck_reporta TEXT NULL,
        tck_telefonoReporta TEXT NULL,
        tck_usuario_creacion INTEGER NULL,
        tck_estadoTicket TEXT NULL,
        ev_descripcion TEXT NULL,
        id_contrato TEXT NULL,
        ingenieroId INTEGER NULL,
        ingeniero TEXT NULL,
        tipoIncidencia TEXT NULL,
        OrdenServicioID INTEGER NULL,
        tck_tipoTicketCod TEXT NULL
    );`)
    })
}

export const Restablecer = async () => {

    //OrdenesServicio
    db.transaction(tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS OrdenesServicio 
    (
        evento_id INTEGER NULL,
        ticket_id INTEGER NULL,
        codOS TEXT NULL,
        codTicket INTEGER,
        tck_cliente TEXT NULL,
        tck_tipoTicket TEXT NULL,
        tck_tipoTicketDesc TEXT NULL,
        tck_descripcionProblema TEXT NULL,
        ev_fechaAsignadaDesde INTEGER NULL,
        ev_fechaAsignadaHasta INTEGER NULL,
        ev_horaAsignadaDesde TEXT NULL,
        ev_horaAsignadaHasta TEXT NULL,
        ev_estado TEXT NULL,
        tck_direccion TEXT NULL,
        tck_canton TEXT NULL,
        tck_provincia TEXT NULL,
        tck_reporta TEXT NULL,
        tck_telefonoReporta TEXT NULL,
        tck_usuario_creacion INTEGER NULL,
        tck_estadoTicket TEXT NULL,
        ev_descripcion TEXT NULL,
        id_contrato TEXT NULL,
        ingenieroId INTEGER NULL,
        ingeniero TEXT NULL,
        tipoIncidencia TEXT NULL,
        OrdenServicioID INTEGER NULL,
        tck_tipoTicketCod TEXT NULL,
        estado_local TEXT NULL
    );`)
    })

    //equipo ticket
    db.transaction(tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS equipoTicket (
        id_equipoContrato INTEGER NULL,
        con_ClienteNombre TEXT NULL,
        id_equipo INTEGER NULL,
        id_contrato INTEGER NULL,
        empresa_id INTEGER NULL,
        eqc_conRepuesto TEXT NULL,
        eqc_frecuenciaVisita TEXT NULL,
        eqc_periodo TEXT NULL,
        eqc_tiempoVisita TEXT NULL,
        eqc_horarioAtencionDesde TEXT NULL,
        eqc_horarioAtencionHasta TEXT NULL,
        eqc_lunes TEXT NULL,
        eqc_martes TEXT NULL,
        eqc_miercoles TEXT NULL,
        eqc_jueves TEXT NULL,
        eqc_viernes TEXT NULL,
        eqc_sabado TEXT NULL,
        eqc_domingo TEXT NULL,
        eqc_monto TEXT NULL,
        eqc_usuarioCreacion INTEGER NULL,
        eqc_UsuarioModificacion TEXT NULL,
        eqc_fechaCreacion TEXT NULL,
        eqc_fechaModificacion TEXT NULL,
        localidad_id TEXT NULL,
        eqc_estado TEXT NULL,
        eqc_tiempoServicio TEXT NULL,
        eqc_frecuenciaServicio TEXT NULL,
        eqc_manoObra TEXT NULL,
        eqc_estadoProgramado TEXT NULL,
        eqc_fechaIniGaranC TEXT NULL,
        eqc_fechaFinGaranC TEXT NULL,
        eqc_fechaServicio TEXT NULL,
        eqc_fechaServicioFin TEXT NULL,
        eqc_oldContract TEXT NULL,
        eqc_tiempoRepuestos TEXT NULL,
        eqc_tiempoManoObra TEXT NULL,
        eqc_consumibles TEXT NULL,
        eqc_tiempoConsumibles TEXT NULL,
        eqc_fungibles TEXT NULL,
        eqc_tiempoFungibles TEXT NULL,
        eqc_kitMantenimiento TEXT NULL,
        eqc_fechaKitMantenimiento TEXT NULL,
        eqc_rutaAdjunto TEXT NULL,
        eqc_rucComodato TEXT NULL,
        eqc_codComodato TEXT NULL,
        eqc_frecVisSitePlan TEXT NULL,
        eqc_periodoSitePlan TEXT NULL,
        eqc_observacion TEXT NULL,
        Equipo TEXT NULL,
        estado_local TEXT NULL,
        ticket_id INTEGER NOT NULL
    );`)
    })

    //anidades
    db.transaction(tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS ordenesAnidadas
    (
        evento_id INTEGER,
        ticket_id INTEGER,
        codOS TEXT NULL,
        codeTicket TEXT NULL,
        tck_cliente TEXT NULL,
        tck_tipoTicket TEXT NULL,
        tck_tipoTicketDesc TEXT NULL,
        tck_descripcionProblema TEXT NULL,
        ev_fechaAsignadaDesde TEXT NULL,
        ev_fechaAsignadaHasta TEXT NULL,
        ev_horaAsignadaDesde TEXT NULL,
        ev_horaAsignadaHasta TEXT NULL,
        ev_estado TEXT NULL,
        tck_direccion TEXT NULL,
        tck_canton TEXT NULL,
        tck_provincia TEXT NULL,
        tck_reporta TEXT NULL,
        tck_telefonoReporta TEXT NULL,
        tck_usuario_creacion INTEGER NULL,
        tck_estadoTicket TEXT NULL,
        ev_descripcion TEXT NULL,
        id_contrato TEXT NULL,
        ingenieroId INTEGER NULL,
        ingeniero TEXT NULL,
        tipoIncidencia TEXT NULL,
        OrdenServicioID INTEGER NULL,
        tck_tipoTicketCod TEXT NULL
    );`)
    })

    //ingenieros
    db.transaction(tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS ingenieros
    (
        IdUsuario INTEGER NULL,
        NombreUsuario TEXT NULL,
        cedula TEXT NULL,
        adicional INTEGER NULL
    );`)
    })
}

export async function SincronizaDor() {
    return new Promise((resolve, reject) => {
        (async () => {
            await TrucateUpdate()
            // await HistorialEquipoIngeniero()
            await GetEventosDelDia()
            var ayer = moment().add(-1, 'days').format('YYYY-MM-DD');
            var hoy = moment().format('YYYY-MM-DD');
            var manana = moment().add(1, 'days').format('YYYY-MM-DD');
            const ticket_id = await GetEventosByTicket(ayer, hoy, manana)
            ticket_id.map(async (r) => {
                await EquipoTicket(r.ticket_id)
                await OrdenServicioAnidadas(r.evento_id)
            })
            resolve(true)
        })()
    })
}