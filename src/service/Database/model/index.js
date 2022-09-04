import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('eos.db', 1, 'DatabaseLocal', 10000, (result) => {
    console.log("result", result);
})

db.exec([{
    sql: `CREATE TABLE IF NOT EXISTS historialEquipo 
    (
        equipo_id INTEGER PRIMARY KEY AUTOINCREMENT ,
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
        historial TEXT NULL
    );`,
    args: []
}], false, (tx, results) => {
    console.log("resultado tx", tx);
    console.log("resultado al crear la tabla historialEquipo", results);
})

//CREATE TABLA CLIENTE
db.exec([{
    sql: `CREATE TABLE IF NOT EXISTS clientes 
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT ,
        CustomerID TEXT UNIQUE(customerID),
        CustomerName TEXT,
        ProvinciaID TEXT NULL,
        CantonID INTEGER,
        Direccion TEXT NULL,
        grupo TEXT NULL,
        Sucursal TEXT NULL
    );`,
    args: []
}], false, (tx, results) => {
    console.log("resultado tx", tx);
    console.log("resultado al crear la tabla clientes", results);
})

//CREATE TABLA PROVINCIAS


//CREATE TABLA CANTONES


//CREATE TABLA CATALOGOS


//CREATE TABLA ACCIONES



//CREATE TABLA EVENTOS

//CREATE TABLA ORDENES

export default db