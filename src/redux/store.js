import {
    configureStore
} from '@reduxjs/toolkit'


import sincronizacionReducer from "./sincronizacion";


export const store = configureStore({
    reducer: {
        sincronizacion: sincronizacionReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export default store