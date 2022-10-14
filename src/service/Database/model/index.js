import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('eos.db', 1, 'DatabaseLocal', 200000)


function InitDB() {
        //CREATE TABLE HISTORIAL EQUIPO
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS historialEquipo 
        (
            equipo_id INTEGER NULL,
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
            checklist TEXT NULL,
            id_contrato INTEGER,
            isChecked TEXT NULL
        );`)
        })

        //CREATE TABLA CLIENTE
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS cliente 
        (
            CustomerID TEXT NULL,
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

        //CREATE TABLA ORDENES ANIDADAS
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

        //CREATE TABLA CATALOGOS
        //CREATE TABLA ACCIONES
        //CREATE TABLA ORDENES DE SERVICIO
        db.exec([{
            sql: `CREATE TABLE IF NOT EXISTS OS_OrdenServicio 
            (
                OS_CheckList TEXT NULL,
                OS_Encuesta TEXT NULL,
                OS_Firmas TEXT NULL,
                OS_PartesRepuestos TEXT NULL,
                OS_Anexos TEXT NULL,
                OS_Tiempos TEXT NULL,
                OS_Colaboradores TEXT NULL,
                provinciaId INTEGER NULL,
                cantonId INTEGER NULL,
                localidad TEXT NULL,
                tipoIncidencia TEXT NULL,
                OrdenServicioID INTEGER NULL,
                TipoVisita TEXT NULL,
                Fecha TEXT NULL,
                Estado TEXT NULL,
                Finalizado INTEGER NULL,
                evento_id INTEGER NULL,
                ticket_id INTEGER NULL,
                empresa_id INTEGER NULL,
                contrato_id INTEGER NULL,
                equipo_id INTEGER NULL,
                Serie TEXT NULL,
                TipoEquipo INTEGER NULL,
                ModeloEquipo INTEGER NULL,
                Marca TEXT NULL,
                ObservacionEquipo TEXT NULL,
                CodigoEquipoCliente TEXT NULL,
                ClienteID TEXT NULL,
                ClienteNombre TEXT NULL,
                Sintomas TEXT NULL,
                Causas TEXT NULL,
                Diagnostico TEXT NULL,
                Acciones TEXT NULL,
                SitioTrabajo TEXT NULL,
                EstadoEquipo TEXT NULL,
                ComentarioRestringido TEXT NULL,
                IncluyoUpgrade INTEGER NULL,
                ComentarioUpgrade TEXT NULL,
                Seguimento INTEGER NULL,
                FechaSeguimiento TEXT NULL,
                ObservacionCliente TEXT NULL,
                ObservacionIngeniero TEXT,
                IngenieroID INTEGER NULL,
                UsuarioCreacion INTEGER NULL,
                FechaCreacion TEXT NULL,
                UsuarioModificacion INTEGER NULL,
                FechaModificacion TEXT NULL,
                IdEquipoContrato INTEGER NULL,
                EstadoEqPrevio TEXT NULL,
                ContactoInforme TEXT NULL,
                CargoContactoInforme TEXT NULL,
                ObservacionCheckList TEXT NULL,
                Direccion TEXT NULL,
                Ciudad TEXT NULL,
                nuevaVisita INTEGER NULL,
                incidencia TEXT NULL,
                release TEXT NULL,
                OS_ASUNTO TEXT NULL,
                OS_FINALIZADA TEXT NULL,
                enviado TEXT NULL,
                codOS TEXT NULL,
                OS_LOCAL TEXT NULL
                );`,
                args: []
            }], false, (tx, results) => {
                console.log("resultado tx", tx);
                console.log("resultado al crear la tabla OS_OrdenServicio", results);
                // equ_hardware TEXT NULL,
                // ModeloEquipoDesc TEXT NULL,
                // TipoEquipoDesc TEXT NULL,
                // con_contratoLegal TEXT NULL,
                // equ_fechaFabricacion TEXT NULL,
                // equ_systemCode TEXT NULL,
        })

        //CREATE TABLA EQUIPOS
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS tiposEquipos 
        (
            tipo_id INTEGER NULL,
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
            modelo_id INTEGER NULL,
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
            IdUsuario INTEGER NULL,
            NombreUsuario TEXT NULL,
            cedula TEXT NULL,
            adicional INTEGER NULL
        );`)
        })

        //CREATE TABLA ORDENES DE SERVICIO AYER HOY Y MAÑANA (eventos)
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

        //CREATE TABLA EQUIPOTICKET
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
            tx.executeSql(`CREATE TABLE IF NOT EXISTS switch 
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                descripcion TEXT NULL,
                estado INTEGER NULL
            );`)
        })

        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS estadoEquipo 
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                descripcion TEXT NULL
            );`)
        })

        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS tipoComponente 
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                descripcion TEXT NULL
            );`)
        })

        //TABLA DE ACTUALIZACION EVENTUAL
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS actualizacion 
            (
                id INTEGER UNIQUE NOT NULL,
                fechaUltimaActualizacion TEXT NULL
            );`)
        })

        //TABLA DE ACTUALIZACION TOKEN
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS token 
            (
                username TEXT UNIQUE NOT NULL,
                password TEXT UNIQUE NOT NULL,
                token TEXT NULL,
                userId INTEGER NULL,
                IdUsuario INTEGER NULL,
                fechaUltimaActualizacion TEXT NULL
            );`)
        })

        //TABLA DE COMPONENTES ESTADO
        db.transaction(tx => {
            tx.executeSql(`CREATE TABLE IF NOT EXISTS EstadoDatos 
            (
                IdCatalogo TEXT NULL,
                IdCatalogoDetalle TEXT NULL,
                Descripcion TEXT NULL,
                Auxiliar1 TEXT NULL,
                Auxiliar2 TEXT NULL,
                Ordenamiento TEXT NULL,
                FechaCreacion TEXT NULL,
                UsuarioCreacion TEXT NULL,
                FechaModificacion TEXT NULL,
                UsuarioModificacion TEXT NULL,
                Estado TEXT NULL
            );`)
        })

        //TABLA PARA FORMULARIO
                //CREATE TABLA ORDENES DE SERVICIO
                db.exec([{
                    sql: `CREATE TABLE IF NOT EXISTS OSFORMULARIO 
                    (
                        OS_CheckList TEXT NULL,
                        OS_Encuesta TEXT NULL,
                        OS_Firmas TEXT NULL,
                        OS_PartesRepuestos TEXT NULL,
                        OS_Anexos TEXT NULL,
                        OS_Tiempos TEXT NULL,
                        OS_Colaboradores TEXT NULL,
                        provinciaId INTEGER NULL,
                        cantonId INTEGER NULL,
                        localidad TEXT NULL,
                        tipoIncidencia TEXT NULL,
                        OrdenServicioID INTEGER NULL,
                        TipoVisita TEXT NULL,
                        Fecha TEXT NULL,
                        Estado TEXT NULL,
                        Finalizado INTEGER NULL,
                        evento_id INTEGER NULL,
                        ticket_id INTEGER NULL,
                        empresa_id INTEGER NULL,
                        contrato_id INTEGER NULL,
                        equipo_id INTEGER NULL,
                        Serie TEXT NULL,
                        TipoEquipo INTEGER NULL,
                        ModeloEquipo INTEGER NULL,
                        Marca TEXT NULL,
                        ObservacionEquipo TEXT NULL,
                        CodigoEquipoCliente TEXT NULL,
                        ClienteID TEXT NULL,
                        ClienteNombre TEXT NULL,
                        Sintomas TEXT NULL,
                        Causas TEXT NULL,
                        Diagnostico TEXT NULL,
                        Acciones TEXT NULL,
                        SitioTrabajo TEXT NULL,
                        EstadoEquipo TEXT NULL,
                        ComentarioRestringido TEXT NULL,
                        IncluyoUpgrade INTEGER NULL,
                        ComentarioUpgrade TEXT NULL,
                        Seguimento INTEGER NULL,
                        FechaSeguimiento TEXT NULL,
                        ObservacionCliente TEXT NULL,
                        ObservacionIngeniero TEXT,
                        IngenieroID INTEGER NULL,
                        UsuarioCreacion INTEGER NULL,
                        FechaCreacion TEXT NULL,
                        UsuarioModificacion INTEGER NULL,
                        FechaModificacion TEXT NULL,
                        IdEquipoContrato INTEGER NULL,
                        EstadoEqPrevio TEXT NULL,
                        ContactoInforme TEXT NULL,
                        CargoContactoInforme TEXT NULL,
                        ObservacionCheckList TEXT NULL,
                        Direccion TEXT NULL,
                        Ciudad TEXT NULL,
                        nuevaVisita INTEGER NULL,
                        incidencia TEXT NULL,
                        release TEXT NULL,
                        OS_ASUNTO TEXT NULL,
                        OS_FINALIZADA TEXT NULL,
                        enviado TEXT NULL,
                        codOS TEXT NULL,
                        OS_LOCAL TEXT NULL
                        );`,
                        args: []
                    }], false, (tx, results) => {
                        console.log("resultado tx", tx);
                        console.log("resultado al crear la tabla OS_OrdenServicio", results);
                })


        //
}

InitDB()

export default db