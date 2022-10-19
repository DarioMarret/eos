import {
    configureStore
} from '@reduxjs/toolkit'


import sincronizacionReducer from "./sincronizacion";
import formularioReducer from "./formulario";


export const store = configureStore({
    reducer: {
        sincronizacion: sincronizacionReducer,
        formulario: formularioReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store