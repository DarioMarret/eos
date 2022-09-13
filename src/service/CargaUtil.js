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
        await getIngenieros();
        await getEquipos();
        await getModeloEquipos();
        await getClientes();
        await getProvincias();
        await getCantones();
        await ConfiiguracionBasicas();
        await HistorialEquipoIngeniero();
    } catch (error) {
        console.log("CardaUtil-->", error)
        return false
    }
}

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