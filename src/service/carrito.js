import { local_carrito } from '../utils/constantes'
import AsyncStorage from '@react-native-async-storage/async-storage';

let CarritoProducto = [];
export const AgregarAlCarrito = async(id, producto, precio, cantidad, selectedGuarnicion1, selectedGuarnicion2, foto) => {
  await VerCarritoItn();
  let info = {
    id: id,
    cantidad: cantidad,
    precio: precio,
    producto: producto,
    selectedGuarnicion1: selectedGuarnicion1,
    selectedGuarnicion2: selectedGuarnicion2,
    foto:foto
  };
  const existe = CarritoProducto.some(producto => producto.id === info.id);
  if (existe) {
    //Actualizamos la cantidad
    const productos = CarritoProducto.map(iten => {
      if (iten.id === info.id && iten.selectedGuarnicion1 === info.selectedGuarnicion1 && iten.selectedGuarnicion2 === info.selectedGuarnicion2) {
        iten.cantidad++;
        return iten; //retorna la cantidad actualizada
      } else {
        return iten; // retorna los objetos que no son actualizado
      }
    });
    CarritoProducto = [...productos];
    await AsyncStorage.setItem(`${local_carrito}`, JSON.stringify(CarritoProducto));
  } else {
    // Agregamosn al carrito
    CarritoProducto = [...CarritoProducto, info];
    await AsyncStorage.setItem(`${local_carrito}`, JSON.stringify(CarritoProducto));
  }
};

const VerCarritoItn = async() => {
  let iten = JSON.parse(await AsyncStorage.getItem(`${local_carrito}`));
  if (iten !== null) {;
    CarritoProducto = [];
    CarritoProducto = iten;
  }
};

//optener los productos y la cantidad
export const getProductoLocalStora = async () =>{
    let iten = JSON.parse(await AsyncStorage.getItem(`${local_carrito}`));
    if (iten){
        return iten
    }else{
        return null;
    }
}
//eliminar del carrito de compra por id
export const EliminarId=async(id)=>{
  let array = await AsyncStorage.getItem(`${local_carrito}`);
  let CarritoProducto = []
  CarritoProducto = JSON.parse(array).filter(carrito=> carrito.id !== id)
  await AsyncStorage.setItem(`${local_carrito}`,JSON.stringify(CarritoProducto));
  return true;
}
//actualizar la contidades de productos elegidos
export const ActualizarCantidadM=async(id,cantidad)=>{
  let array = JSON.parse(await AsyncStorage.getItem(`${local_carrito}`));
  const existe = array.some(iten => iten.id === id)
  if(existe){
    const producto = array.map(iten =>{
      if(iten.id === id){
        iten.cantidad++;
        return iten;
      }else{
        return iten;
      }
    });
    let NCarrito = [];
    NCarrito = [...producto]
    await AsyncStorage.setItem(`${local_carrito}`,JSON.stringify(NCarrito))
  }
}
//decrementar la cantidad de los productos ya elegidos
export const DisminurCantidadMenos=async(id,cantidad)=>{
  if(cantidad !== 1){
    let array = JSON.parse(await AsyncStorage.getItem(`${local_carrito}`));
    const existe = array.some(iten => iten.id === id)
    if(existe){
      const producto = array.map(iten =>{
        if(iten.id === id){
          iten.cantidad--;
          return iten;
        }else{
          return iten;
        }
      });
      let NCarrito = [];
      NCarrito = [...producto]
      await AsyncStorage.setItem(`${local_carrito}`,JSON.stringify(NCarrito))
    }
  }
}
//limpiar el carro de compra despues de aver pagado
export const LimpiarAsyncStorage=async()=>{
  await AsyncStorage.removeItem(`${local_carrito}`)
  CarritoProducto = [];
}