import * as FileSystem from 'expo-file-system';
import axios from "axios";
import { equipos_ingeniero_historial, host } from "../utils/constantes";
import { getToken } from "./usuario";
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from './Database/model';

const axinst = axios.create({
    timeout: 12000
})
export const HistorialEquipoIngeniero = async () => {

    try {
        const { token, userId } = await getToken()
        const url = `${host}MSOrdenServicio/getbaseInstal247ClientesReport?ingeniero_id=${userId}`;
        const { data, status } = await axinst.get(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        data.Response.map((r) => {
            SelectExisteEquipo(r)
        })
        const delay = time => new Promise(resolveCallback => setTimeout(resolveCallback, time));
        await delay(data.Response.length)
        return true
    } catch (error) {
        console.log("errores", error);
        return false
    }
}

async function SelectExisteEquipo(r) {
    // return new Promise((resolve, reject) => {
    // db.transaction(tx => {
    //     tx.executeSql(
    //         `INSERT INTO historialEquipo (
    //                 equipo_id,
    //                 equ_tipoEquipo,
    //                 tipo,
    //                 equ_modeloEquipo,
    //                 modelo,
    //                 equ_serie,
    //                 equ_SitioInstalado,
    //                 equ_areaInstalado,
    //                 con_ClienteNombre,
    //                 marca,
    //                 equ_modalidad,
    //                 Modalidad,
    //                 equ_fechaInstalacion,
    //                 equ_fecIniGaranP,
    //                 equ_fecFinGaranP,
    //                 equ_provincia,
    //                 equ_canton,
    //                 equ_ingenieroResponsable,
    //                 equ_marca,
    //                 equ_estado,
    //                 id_equipoContrato,
    //                 localidad_id,
    //                 historial
    //                 ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    //         , [
    //             Number(r.equipo_id),
    //             Number(r.equ_tipoEquipo),
    //             String(r.tipo),
    //             Number(r.equ_modeloEquipo),
    //             String(r.modelo),
    //             String(r.equ_serie),
    //             String(r.equ_SitioInstalado),
    //             String(r.equ_areaInstalado),
    //             String(r.con_ClienteNombre),
    //             String(r.marca),
    //             String(r.equ_modalidad),
    //             String(r.Modalidad),
    //             String(r.equ_fechaInstalacion),
    //             String(r.equ_fecIniGaranP),
    //             String(r.equ_fecFinGaranP),
    //             String(r.equ_provincia),
    //             String(r.equ_canton),
    //             String(r.equ_ingenieroResponsable),
    //             String(r.equ_marca),
    //             String(r.equ_estado),
    //             String(r.id_equipoContrato),
    //             String(r.localidad_id),
    //             String(JSON.stringify(r.historial))],
    //         (tx, results) => {
    //             console.log("results", results);
    //             // resolve(results)
    //         },
    //         (tx, error) => {
    //             // axios.post(`http://192.168.101.4:3000/`, { r })
    //             console.log("error", error);
    //             // reject(error)
    //         }
    //     );
    // });
    db.exec([{
        sql: `INSERT INTO historialEquipo (
                equipo_id,
                equ_tipoEquipo,
                tipo,
                equ_modeloEquipo,
                modelo,
                equ_serie,
                equ_SitioInstalado,
                equ_areaInstalado,
                con_ClienteNombre,
                marca,
                equ_modalidad,
                Modalidad,
                equ_fechaInstalacion,
                equ_fecIniGaranP,
                equ_fecFinGaranP,
                equ_provincia,
                equ_canton,
                equ_ingenieroResponsable,
                equ_marca,
                equ_estado,
                id_equipoContrato,
                localidad_id,
                historial
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        args: [
            Number(r.equipo_id),
            Number(r.equ_tipoEquipo),
            String(r.tipo),
            Number(r.equ_modeloEquipo),
            String(r.modelo),
            String(r.equ_serie),
            String(r.equ_SitioInstalado),
            String(r.equ_areaInstalado),
            String(r.con_ClienteNombre),
            String(r.marca),
            String(r.equ_modalidad),
            String(r.Modalidad),
            String(r.equ_fechaInstalacion),
            String(r.equ_fecIniGaranP),
            String(r.equ_fecFinGaranP),
            String(r.equ_provincia),
            String(r.equ_canton),
            String(r.equ_ingenieroResponsable),
            String(r.equ_marca),
            String(r.equ_estado),
            String(r.id_equipoContrato),
            String(r.localidad_id),
            String(JSON.stringify(r.historial))]
    }], false, (err, results) => {
        if (err) {
            axios.post(`http://192.168.101.4:3000/`, { r:err })
        } else {
            console.log("results", results);
        }
        
    })
}

export const setHistorialEquiposStorage = async (data) => {
    try {
        console.log("data")
        await AsyncStorage.setItem(equipos_ingeniero_historial, data);
        return true;
    } catch (error) {
        console.log("setHistorialEquiposStorage-->", error);
        return null;
    }
}

export const getHistorialEquiposStorage = async () => {
    try {
        // console.log("getHistorialEquiposStorage-db-->", db)

        // const result = await AsyncStorage.getItem(equipos_ingeniero_historial);
        // return result ? JSON.parse(result) : null;
        db.transaction(tx => {
            tx.executeSql('select * from historialEquipo', [], (_, { rows }) =>
                console.log(JSON.stringify(rows))
            );
        })
    } catch (error) {
        console.log("getHistorialEquiposStorage-->", error);
        return null;
    }
}

