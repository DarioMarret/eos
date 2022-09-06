import { getClientes } from "./clientes";
import { getEquipos } from "./equipos";
import { HistorialEquipoIngeniero } from "./historiaEquipo";
import { getIngenieros } from "./ingenieros";
import { getModeloEquipos } from "./modeloquipo";
import { GetEventosDelDia } from "./OSevento";
import { getToken } from "./usuario";


export const CardaUtil = async () => {
    try {
        const { token } = await getToken()
        if (token) {
            return new Promise( async (resolve, reject) => {
                await GetEventosDelDia()
                await HistorialEquipoIngeniero();
                await getEquipos();
                await getModeloEquipos();
                await getClientes();
                // await getIngenieros();
                resolve(true);
            })
        }
    } catch (error) {
        console.log("CardaUtil-->", error)
        return false
    }
}