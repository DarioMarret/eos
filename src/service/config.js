import { Canton, componente, diagnoctico, estadoSwitch, Provincia } from "../utils/constantes"
import db from "./Database/model"
import moment from "moment"


export const ConfiiguracionBasicas = async () => {
    try {
        return new Promise((resolve, reject) => {
            estadoSwitch.map((item) => {
                db.exec([{
                    sql: `INSERT INTO switch (id, descripcion, estado) VALUES (?, ?, ?)`,
                    args: [item.id, item.description, item.estado]
                }], false, (err, results) => {
                    if (err) {
                        console.log("error", err);
                    } else {
                        console.log("insert switch", results);
                    }
                })
            })
            componente.map((item) => {
                db.exec([{
                    sql: `INSERT INTO tipoComponente (id, descripcion) VALUES (?, ?)`,
                    args: [item.id, item.description]
                }], false, (err, results) => {
                    if (err) {
                        console.log("error", err);
                    } else {
                        console.log("insert tipoComponente", results);
                    }
                })
            })
            diagnoctico.map((item) => {
                db.exec([{
                    sql: `INSERT INTO estadoEquipo (id, descripcion) VALUES (?, ?)`,
                    args: [item.id, item.description]
                }], false, (err, results) => {
                    if (err) {
                        console.log("error", err);
                    } else {
                        console.log("insert estadoEquipo", results);
                    }
                })
            })

            let fechaUltimaActualizacion = moment().format('YYYY-MM-DD HH:mm:ss')
            db.exec([{
                sql: `INSERT INTO actualizacion (id, fechaUltimaActualizacion) VALUES (?, ?)`,
                args: [1, fechaUltimaActualizacion]
            }], false, (err, results) => {
                if (err) {
                    console.log("error", err);
                } else {
                    console.log("insert config", results);
                }

            })

            Provincia.map((r) => {
                db.exec([{
                    sql: `INSERT INTO provincias (id,descripcion) VALUES (?,?)`,
                    args: [String(r.id), String(r.descripcion)]
                }], false, (err, results) => {
                    if (err) {
                        console.log("error", err);
                    } else {
                        console.log("results provincias", results);
                    }
                })

            })

            Canton.map((r) => {
                db.exec([{
                    sql: `INSERT INTO cantones (id,descripcion) VALUES (?,?)`,
                    args: [r.id, r.descripcion]
                }], false, (err, results) => {
                    if (err) {
                        console.log("error", err);
                    } else {
                        console.log("results cantones", results);
                    }
                })
            })

            resolve(true)
        })
    } catch (error) {
        console.log("ConfiiguracionBasicas-->", error)
        return false
    }
}

export const EstadoSwitch = async (id) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM switch WHERE id = ?', [id], (_, { rows }) => {
                console.log("EstadoSwitch", rows._array[0]);
                resolve(rows._array[0])
            });
        })
    })
}

export const CambieEstadoSwitch = async (id, estado) => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('UPDATE switch SET estado = ? WHERE id = ?', [estado, id], (_, { rows }) => {
                tx.executeSql('SELECT * FROM switch WHERE id = ?', [id], (_, { rows }) => {
                    resolve(rows._array[0])
                })
            });
        })
    })
}

export const ListaComponentes = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM tipoComponente', [], (_, { rows }) => {
                resolve(rows._array)
            });
        })
    })
}

export const ListaDiagnostico = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM estadoEquipo', [], (_, { rows }) => {
                console.log("ListaDiagnostico", rows._array);
                resolve(rows._array)
            });
        })
    })
}

export const ConsultarFechaUltimaActualizacion = async () => {
    return new Promise((resolve, reject) => {
        var horaActual = moment().format('YYYY-MM-DD HH:mm:ss')
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM actualizacion', [], (_, { rows }) => {
                let ultimActu = rows._array[0].fechaUltimaActualizacion
                console.log("ultimActu", ultimActu);
                var a = moment(horaActual);
                var b = moment(ultimActu);
                let minuto = a.diff(b, 'minutes')
                if (minuto > 5) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            });
        })
    })
}
export const ActualizarFechaUltimaActualizacion = async () => {
    return new Promise((resolve, reject) => {
        var horaActual = moment().format('YYYY-MM-DD HH:mm:ss')
        db.transaction(tx => {
            tx.executeSql('UPDATE actualizacion SET fechaUltimaActualizacion = ? WHERE id = ?', [horaActual, 1], (_, { rows }) => {
                resolve(true)
            });
        })
    })
}