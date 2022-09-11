import { getCantones } from "./cantones";
import { getClientes } from "./clientes";
import db from "./Database/model";
import { getEquipos } from "./equipos";
import { getIngenieros } from "./ingenieros";
import { getModeloEquipos } from "./modeloquipo";
import { getProvincias } from "./provincias";


export const CardaUtil = async () => {
    try {
        await getIngenieros();
        await getEquipos();
        await getModeloEquipos();
        await getClientes();
        await getProvincias();
        await getCantones();
    } catch (error) {
        console.log("CardaUtil-->", error)
        return false
    }
}

export const TrucateTable = async () => {
    db.transaction(tx => {
        tx.executeSql('delete from historialEquipo', [], (_, { rows }) => {
            console.log("delete table historialEquipo", rows._array);
        });
    })
    db.transaction(tx => {
        tx.executeSql('delete from ingenieros', [], (_, { rows }) => {
            console.log("delete table ingenieros", rows._array);
        });
    })
    db.transaction(tx => {
        tx.executeSql('delete from OrdenesServicio', [], (_, { rows }) => {
            console.log("delete table OrdenesServicio", rows._array);
        });
    })
    db.transaction(tx => {
        tx.executeSql('delete from equipoTicket', [], (_, { rows }) => {
            console.log("delete table equipoTicket", rows._array);
        });
    })

}//OrdenesServicio