import db from "../sqlite";


db.transaction((tx) => {
    tx.executeSql('CREATE TABLE acciones(id INTEGER PRIMARY KEY, accion TEXT, payload TEXT, optional_id INTEGER)')
    tx.executeSql('CREATE TABLE catalogos(IdCatalogo TEXT,IdCatalogoDetalle TEXT, Descripcion TEXT, Ordenamiento INTEGER,Estado TEXT, UNIQUE(IdCatalogo, IdCatalogoDetalle))')
    tx.executeSql('CREATE TABLE provincias(local_id INTEGER PRIMARY KEY AUTOINCREMENT,id TEXT, descripcion TEXT, UNIQUE(id))')
    tx.executeSql('CREATE TABLE cantones(id TEXT, local_id_provincia INTEGER,descripcion TEXT, UNIQUE(id, local_id_provincia),FOREIGN KEY(local_id_provincia) REFERENCES provincias(local_id))');
    tx.executeSql(`CREATE TABLE clientes(CustomerID TEXT,'
    'CustomerName TEXT, ProvinciaID TEXT, CantonID TEXT, Direccion TEXT,'
    'Sucursal TEXT, UNIQUE(CustomerID))`)
    tx.executeSql(`CREATE TABLE equipos('
    'equipo_id INTEGER PRIMARY KEY,'
    'equ_tipoEquipo INTEGER,'
    'tipo TEXT,'
    'equ_modeloEquipo INTEGER,'
    'modelo TEXT,'
    'equ_serie TEXT,'
    'equ_SitioInstalado TEXT,'
    'equ_areaInstalado TEXT,'
    'con_ClienteNombre TEXT,'
    'marca TEXT,'
    'equ_modalidad TEXT,'
    'Modalidad TEXT,'
    'equ_fechaInstalacion TEXT,'
    'equ_fecIniGaranP TEXT,'
    'equ_fecFinGaranP TEXT,'
    'equ_provincia TEXT,'
    'equ_canton TEXT,'
    'equ_ingenieroResponsable TEXT,'
    'equ_marca TEXT,'
    'equ_estado TEXT,'
    'id_equipoContrato TEXT,'
    'localidad_id TEXT,'
    'historial TEXT)`)
    tx.executeSql(`CREATE TABLE eventos('
    'local_id INTEGER PRIMARY KEY AUTOINCREMENT,'
    'evento_id INTEGER,'
    'ticket_id INTEGER,'
    'tck_cliente TEXT,'
    'tck_tipoTicket TEXT,'
    'tck_tipoTicketDesc TEXT,'
    'tck_descripcionProblema TEXT,'
    'id_equipo TEXT,'
    'ev_fechaAsignadaDesde TEXT,'
    'ev_fechaAsignadaHasta TEXT,'
    'ev_horaAsignadaDesde TEXT,'
    'ev_horaAsignadaHasta TEXT,'
    'ev_estado TEXT,'
    'ev_descripcion TEXT,'
    'tck_direccion TEXT,'
    'tck_canton TEXT,'
    'tck_provincia TEXT,'
    'tck_reporta TEXT,'
    'tck_telefonoReporta TEXT,'
    'incidencia TEXT,'
    'tipoIncidencia TEXT,'
    'tck_usuario_creacion INTEGER,'
    'tck_estadoTicket TEXT,'
    'id_contrato TEXT,'
    'ingenieroId INTEGER,'
    'ingeniero TEXT,'
    'OrdenServicioID INTEGER,'
    'local_equipos_contrato TEXT,'
    'local_ticket_id INTEGER,'
    'local_contrato_id TEXT,'
    'local_evento_id INTEGER,'
    'local_ev_estado TEXT,'
    'local_ingeniero TEXT)`)
    tx.executeSql(`CREATE TABLE ordenes('
    'local_id INTEGER PRIMARY KEY AUTOINCREMENT,'
    'id INTEGER,'
    'local_event_id INTEGER,'
    'OS_CheckList TEXT,'
    'OS_Encuesta TEXT,'
    'OS_Firmas TEXT,'
    'OS_PartesRepuestos TEXT,'
    'OS_Anexos TEXT,'
    'OS_Tiempos TEXT,'
    'OS_Colaboradores TEXT,'
    'provinciaId INTEGER,'
    'cantonId INTEGER,'
    'tipoIncidencia TEXT,'
    'localidad TEXT,'
    'equ_hardware TEXT,'
    'con_contratoLegal TEXT,'
    'equ_fechaFabricacion TEXT,'
    'equ_systemCode TEXT,'
    'OrdenServicioID INTEGER,'
    'TipoVisita TEXT,'
    'Fecha TEXT,'
    'Estado TEXT,'
    'Finalizado INTEGER,'
    'evento_id INTEGER,'
    'ticket_id INTEGER,'
    'empresa_id INTEGER,'
    'contrato_id INTEGER,'
    'equipo_id INTEGER,'
    'Serie TEXT,'
    'TipoEquipo INTEGER,'
    'TipoEquipoDesc TEXT,'
    'ModeloEquipo INTEGER,'
    'ModeloEquipoDesc TEXT,'
    'Marca TEXT,'
    'ObservacionEquipo TEXT,'
    'CodigoEquipoCliente TEXT,'
    'ClienteID TEXT,'
    'ClienteNombre TEXT,'
    'Sintomas TEXT,'
    'Causas TEXT,'
    'Diagnostico TEXT,'
    'Acciones TEXT,'
    'SitioTrabajo TEXT,'
    'EstadoEquipo TEXT,'
    'ComentarioRestringido TEXT,'
    'IncluyoUpgrade INTEGER,'
    'ComentarioUpgrade TEXT,'
    'Seguimento INTEGER,'
    'FechaSeguimiento TEXT,'
    'ObservacionCliente TEXT,'
    'ObservacionIngeniero TEXT,'
    'IngenieroID INTEGER,'
    'UsuarioCreacion INTEGER,'
    'FechaCreacion TEXT,'
    'UsuarioModificacion INTEGER,'
    'FechaModificacion TEXT,'
    'IdEquipoContrato INTEGER,'
    'EstadoEqPrevio TEXT,'
    'ContactoInforme TEXT,'
    'CargoContactoInforme TEXT,'
    'ObservacionCheckList TEXT,'
    'Direccion TEXT,'
    'Ciudad TEXT,'
    'nuevaVisita INTEGER,'
    'incidencia TEXT,'
    'release TEXT,'
    'OS_ASUNTO TEXT,'
    'OS_FINALIZADA TEXT,'
    'enviado INTEGER,'
    'local_emails TEXT,'
    'FOREIGN KEY(local_event_id) REFERENCES eventos(local_id)'
    ')`)

    tx.executeSql('CREATE TABLE login(id INTEGER PRIMARY KEY, username TEXT, password TEXT, activo INTEGER)')

    // tx.executeSql('CREATE TABLE login(id INTEGER PRIMARY KEY, username TEXT, password TEXT, activo INTEGER)')
})