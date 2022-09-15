import { HistorialEquipoIngeniero } from "./historiaEquipo";
import { ConfiiguracionBasicas } from "./config";
import { getModeloEquipos } from "./modeloquipo";
import { GetEventosDelDia } from "./OSevento";
import { getIngenieros } from "./ingenieros";
import { getProvincias } from "./provincias";
import { getCantones } from "./cantones";
import { getClientes } from "./clientes";
import { getEquipos } from "./equipos";
import db from "./Database/model";


export const CardaUtil = async () => {
    try {
        await GetEventosDelDia()
        await time(1000)
        console.log("GetEventosDelDia fin")

        await getIngenieros();
        await time(1000)
        console.log("getIngenieros fin")

        await getEquipos();
        await time(1000)
        console.log("getEquipos fin")

        await getModeloEquipos();
        await time(1000)
        console.log("getModeloEquipos fin")

        await getClientes();
        await time(1000)
        console.log("getClientes fin")

        await getProvincias();
        await time(1000)
        console.log("getProvincias fin")

        await getCantones();
        await time(1000)
        console.log("getCantones fin")

        await ConfiiguracionBasicas();
        await time(1000)
        console.log("ConfiiguracionBasicas fin")

        await HistorialEquipoIngeniero();
        await time(1000)
        console.log("HistorialEquipoIngeniero fin")

    } catch (error) {
        console.log("CardaUtil-->", error)
        return false
    }
}

const time = time => new Promise(resolve => setTimeout(resolve, time));

export const TrucateTable = async () => {
    db.transaction(tx => {
        tx.executeSql('delete from historialEquipo', [], (_, { rows }) => {
            console.log("delete table historialEquipo", rows);
        });
    })
    db.transaction(tx => {
        tx.executeSql('delete from ingenieros', [], (_, { rows }) => {
            console.log("delete table ingenieros", rows);
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
        tx.executeSql('delete from token', [], (_, { rows }) => {
            console.log("delete table token", rows);
        });
    })
    db.transaction(tx => {
        tx.executeSql('delete from ordenesAnidadas', [], (_, { rows }) => {
            console.log("delete table ordenesAnidadas", rows);
        });
    })

}//OrdenesServicio