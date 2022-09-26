import { HistorialEquipoIngeniero } from "./historiaEquipo";
import { ConfiiguracionBasicas } from "./config";
import { getModeloEquipos } from "./modeloquipo";
import { GetEventosDelDia } from "./OSevento";
import { getIngenieros } from "./ingenieros";
import { getClientes } from "./clientes";
import { getEquipos } from "./equipos";
import db from "./Database/model";


export const CardaUtil = async () => {
    try {
        await GetEventosDelDia()
        await time(500)
        console.log("GetEventosDelDia fin")

        await getIngenieros();
        await time(500)
        console.log("getIngenieros fin")

        await getEquipos();
        await time(500)
        console.log("getEquipos fin")

        await getModeloEquipos();
        await time(500)
        console.log("getModeloEquipos fin")

        await getClientes();
        await time(500)
        console.log("getClientes fin")

        await ConfiiguracionBasicas();
        await time(500)
        console.log("ConfiiguracionBasicas fin")

        await HistorialEquipoIngeniero();
        await time(500)
        console.log("HistorialEquipoIngeniero fin")

    } catch (error) {
        console.log("CardaUtil-->", error)
        return false
    }
}

export const time = time => new Promise(resolve => setTimeout(resolve, time));


//eliminar tablas cada que cierre la app
export const TrucateTable = async () => {
    db.transaction(tx => {
        tx.executeSql('delete from historialEquipo', [], (_, { rows }) => {
            console.log("delete table historialEquipo", rows);
        })
    })
    db.transaction(tx => {
        tx.executeSql('delete from ingenieros', [], (_, { rows }) => {
            console.log("delete table ingenieros", rows);
        })
    })
    db.transaction(tx => {
        tx.executeSql('delete from OrdenesServicio', [], (_, { rows }) => {
            console.log("delete table OrdenesServicio", rows);
        })
    })
    db.transaction(tx => {
        tx.executeSql('delete from equipoTicket', [], (_, { rows }) => {
            console.log("delete table equipoTicket", rows);
        })
    })
    db.transaction(tx => {
        tx.executeSql('delete from token', [], (_, { rows }) => {
            console.log("delete table token", rows);
        })
    })
    db.transaction(tx => {
        tx.executeSql('delete from ordenesAnidadas', [], (_, { rows }) => {
            console.log("delete table ordenesAnidadas", rows);
        })
    })
}

//Truncar tablas ordenesAnidadas equipoTicket historialEquipo OrdenesServicio cada que sincronice
export const TrucateUpdate = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('delete from historialEquipo', [], (_, { rows }) => {
                console.log("delete table historialEquipo", rows);
            });
        })
        db.transaction(tx => {
            tx.executeSql('delete from OrdenesServicio', [], (_, { rows }) => {
                console.log("delete table OrdenesServicio", rows);
            });
        })
        db.transaction(tx => {
            tx.executeSql('delete from equipoTicket', [], (_, { rows }) => {
                console.log("delete table equipoTicket", rows);
            });
        })
        db.transaction(tx => {
            tx.executeSql('delete from ordenesAnidadas', [], (_, { rows }) => {
                console.log("delete table ordenesAnidadas", rows);
            });
        })
        resolve(true)
    })
}