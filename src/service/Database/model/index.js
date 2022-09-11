import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('eos.db', 1, 'DatabaseLocal', 200000)


function InitDB() {
    return new Promise((resolve, reject) => {
        //CREATE TABLE HISTORIAL EQUIPO
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS historialEquipo 
        (
            equipo_id INTEGER UNIQUE NOT NULL,
            equ_tipoEquipo INTEGER,
            tipo TEXT NULL,
            equ_modeloEquipo INTEGER,
            modelo TEXT NULL,
            equ_serie TEXT NULL,
            equ_SitioInstalado TEXT NULL,
            equ_areaInstalado TEXT NULL,
            con_ClienteNombre TEXT NULL,
            marca TEXT NULL,
            equ_modalidad TEXT NULL,
            Modalidad TEXT NULL,
            equ_fechaInstalacion TEXT NULL,
            equ_fecIniGaranP TEXT NULL,
            equ_fecFinGaranP TEXT NULL,
            equ_provincia TEXT NULL,
            equ_canton TEXT NULL,
            equ_ingenieroResponsable TEXT NULL,
            equ_marca TEXT NULL,
            equ_estado TEXT NULL,
            id_equipoContrato TEXT NULL,
            localidad_id TEXT NULL,
            historial TEXT NULL,
            isChecked TEXT NULL
        );`)
        })

        //CREATE TABLA CLIENTE
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS cliente 
        (
            CustomerID TEXT UNIQUE,
            CustomerName TEXT,
            ProvinciaID TEXT NULL,
            CantonID TEXT NULL,
            Direccion TEXT NULL,
            grupo TEXT NULL,
            Sucursal TEXT NULL
        );`)
        })

        //CREATE TABLA PROVINCIAS
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS provincias
        (
            id INTEGER UNIQUE NOT NULL,
            descripcion TEXT
        );`)
        })

        //CREATE TABLA CANTONES
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS cantones
        (
            id INTEGER UNIQUE NOT NULL,
            descripcion TEXT
        );`)
        })

        //CREATE TABLA CATALOGOS

        //CREATE TABLA ACCIONES


        //CREATE TABLA ORDENES DE SERVICIO
        // db.exec([{
        //     sql: `CREATE TABLE IF NOT EXISTS ordenes 
        //     (
        //         local_id INTEGER PRIMARY KEY AUTOINCREMENT,
        //         id INTEGER,
        //         local_event_id INTEGER,
        //         OS_CheckList TEXT,
        //         OS_Encuesta TEXT,
        //         OS_Firmas TEXT,
        //         OS_PartesRepuestos TEXT,
        //         OS_Anexos TEXT,
        //         OS_Tiempos TEXT,
        //         OS_Colaboradores TEXT,
        //         provinciaId INTEGER,
        //         cantonId INTEGER,
        //         tipoIncidencia TEXT,
        //         localidad TEXT,
        //         equ_hardware TEXT,
        //         con_contratoLegal TEXT,
        //         equ_fechaFabricacion TEXT,
        //         equ_systemCode TEXT,
        //         OrdenServicioID INTEGER,
        //         TipoVisita TEXT,
        //         Fecha TEXT,
        //         Estado TEXT,
        //         Finalizado INTEGER,
        //         evento_id INTEGER,
        //         ticket_id INTEGER,
        //         empresa_id INTEGER,
        //         contrato_id INTEGER,
        //         equipo_id INTEGER,
        //         Serie TEXT,
        //         TipoEquipo INTEGER,
        //         TipoEquipoDesc TEXT,
        //         ModeloEquipo INTEGER,
        //         ModeloEquipoDesc TEXT,
        //         Marca TEXT,
        //         ObservacionEquipo TEXT,
        //         CodigoEquipoCliente TEXT,
        //         ClienteID TEXT,
        //         ClienteNombre TEXT,
        //         Sintomas TEXT,
        //         Causas TEXT,
        //         Diagnostico TEXT,
        //         Acciones TEXT,
        //         SitioTrabajo TEXT,
        //         EstadoEquipo TEXT,
        //         ComentarioRestringido TEXT,
        //         IncluyoUpgrade INTEGER,
        //         ComentarioUpgrade TEXT,
        //         Seguimento INTEGER,
        //         FechaSeguimiento TEXT,
        //         ObservacionCliente TEXT,
        //         ObservacionIngeniero TEXT,
        //         IngenieroID INTEGER,
        //         UsuarioCreacion INTEGER,
        //         FechaCreacion TEXT,
        //         UsuarioModificacion INTEGER,
        //         FechaModificacion TEXT,
        //         IdEquipoContrato INTEGER,
        //         EstadoEqPrevio TEXT,
        //         ContactoInforme TEXT,
        //         CargoContactoInforme TEXT,
        //         ObservacionCheckList TEXT,
        //         Direccion TEXT,
        //         Ciudad TEXT,
        //         nuevaVisita INTEGER,
        //         incidencia TEXT,
        //         release TEXT,
        //         OS_ASUNTO TEXT,
        //         OS_FINALIZADA TEXT,
        //         enviado INTEGER,
        //         local_emails TEX
        //     );`,
        //     args: []
        // }], false, (tx, results) => {
        //     console.log("resultado tx", tx);
        //     console.log("resultado al crear la tabla ordenesServicio", results);
        // })

        //CREATE TABLA EQUIPOS
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS tiposEquipos 
        (
            tipo_id INTEGER UNIQUE NOT NULL,
            empresa_id INTEGER,
            tipo_descripcion TEXT NULL,
            tipo_estado TEXT NULL,
            tipo_usuarioCreacion INTEGER NULL,
            tipo_usuarioModificacion INTEGER NULL,
            tipo_fechaCreacion TEXT NULL,
            tipo_fechaModificacion TEXT NULL,
            MO TEXT NULL,
            CONTCREPTO TEXT NULL,
            CONTSREPTO TEXT NULL,
            modalidad_id INTEGER NULL
        );`)
        })

        //CREATE TABLA MODELOS
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS modelosEquipo 
        (
            modelo_id INTEGER UNIQUE NOT NULL,
            tipo_id INTEGER,
            tipoEquipo TEXT NULL,
            empresa_id INTEGER,
            modelo_descripcion TEXT NULL,
            modelo_tiempoprom_inst TEXT NULL,
            modelo_tiempoprom_mant TEXT NULL,
            modelo_estado TEXT NULL,
            modelo_usuarioCreacion INTEGER,
            modelo_usuarioModificacion INTEGER,
            modelo_fechaCreacion TEXT NULL,
            modelo_fechaModificacion TEXT NULL
        );`)
        })


        //CREATE TABLA INGENIEROS 
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS ingenieros
        (
            IdUsuario INTEGER UNIQUE NOT NULL,
            NombreUsuario TEXT NULL,
            cedula TEXT NULL,
            adicional INTEGER NULL
        );`)
        })

        //CREATE TABLA ORDENES DE SERVICIO AYER HOY Y MAÑANA (eventos)
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS OrdenesServicio 
        (
            evento_id INTEGER UNIQUE NOT NULL,
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
            estado_local TEXT NULL
        );`)
        })

        //CREATE TABLA EQUIPOTICKET
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS equipoTicket (
            id_equipoContrato INTEGER NOT NULL,
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
            ticket_id INTEGER UNIQUE NOT NULL
        );`)
        })
    })
}

InitDB()

export default db