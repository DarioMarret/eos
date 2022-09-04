import { getClientes } from "./clientes";
import { getEquipos } from "./equipos";
import { HistorialEquipoIngeniero } from "./historiaEquipo";
import { getIngenieros } from "./ingenieros";
import { getModeloEquipos } from "./modeloquipo";


export const CardaUtil = async () => {
    try {
        if(await HistorialEquipoIngeniero()){
            return true
        }else{
            return false
        }
        // await getModeloEquipos()
        // await getIngenieros()
        // await getClientes()
        // await getEquipos()
        
    } catch (error) {
        console.log("CardaUtil-->",error)
        return null;
    }
}