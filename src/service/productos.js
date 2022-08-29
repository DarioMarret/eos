import { host } from '../utils/constantes';
import { getToken } from './usuario'

export async function listaProductoById(id){
    try {
        const token = await getToken();
        const url = `${host}/api/producto/producto/${id}`;
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