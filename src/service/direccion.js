import { host, token } from '../utils/constantes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getToken } from './usuario'
import jwtDecode from 'jwt-decode';

//para listar mis direcciones
export async function listaDireccion(){
    try {
        const token = await getToken();
        var id = jwtDecode(token).user.id
        const url = `${host}/direccion/${id}`;
        const params ={
            headers:{ 
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`, 
            }
        }
        const response = await fetch(url,params)
        const resultado = await response.json();
        if(resultado)return resultado;
        return null;
    } catch (error) {
        console.log(error)
    }
}
export async function createDreccion(formData){
    
    try {
        const token = await getToken();
        var direccion_id = jwtDecode(token).user.id;
        const url = `${host}/direccion`;
        const params ={
            method:"POST",
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${token}`,    
            },
            body:JSON.stringify({direccion_id, ...formData})
        }
        const response = await fetch(url,params)
        const resultado = await response.json();
        if(resultado){
            return true;
        }
    } catch (error) {
        console.log(error);
    }
}