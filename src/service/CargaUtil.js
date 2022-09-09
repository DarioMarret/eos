import db from "./Database/model";
import { getEquipos } from "./equipos";
import { HistorialEquipoIngeniero } from "./historiaEquipo";
import { getIngenieros } from "./ingenieros";
import { getModeloEquipos } from "./modeloquipo";
import { GetEventosDelDia } from "./OSevento";


export const CardaUtil = async () => {
    try {
        await HistorialEquipoIngeniero();
        await GetEventosDelDia()
        await getIngenieros();
        await getEquipos();
        await getModeloEquipos();
        // await getClientes();
    } catch (error) {
        console.log("CardaUtil-->", error)
        return false
    }
}

export const TrucateTable = async () => {
    db.transaction(tx => {
        tx.executeSql('delete from historialEquipo', [], (_, { rows }) => {
            console.log("truncado historialEquipo", rows._array);
        });
    })
    db.transaction(tx => {
        tx.executeSql('delete from ingenieros', [], (_, { rows }) => {
            console.log("truncado ingenieros", rows._array);
        });
    })
    db.transaction(tx => {
        tx.executeSql('delete from OrdenesServicio', [], (_, { rows }) => {
            console.log("truncado OrdenesServicio", rows._array);
        });
    })
    db.transaction(tx => {
        tx.executeSql('delete from equipoTicket', [], (_, { rows }) => {
            console.log("truncado equipoTicket", rows._array);
        });
    })

}//OrdenesServicio