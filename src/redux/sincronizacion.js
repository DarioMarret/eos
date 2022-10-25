import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetEventos } from "../service/OSevento";



const initialState = [];

export const getEventosByDate = createAsyncThunk(
    'sincronizacion',
    async (date) => {
        const response = await GetEventos(date)
        return response
    }
)
export const sincronizacionSlice = createSlice({

    name: "sincronizacion",
    initialState: {
        eventos_hoy: [],
        eventos_ayer: [],
        eventos_mnn: [],
        loading: false,
        sincronizador: false,
    },
    reducers: {
        listarEventoHoy: (state, action) => {
            state.eventos_hoy = action.payload
        },
        listarEventoAyer: (state, action) => {
            state.eventos_ayer = action.payload
        },
        listarEventoMnn: (state, action) => {
            state.eventos_mnn = action.payload
        },
        loadingCargando: (state, action) => {
            console.log("loadingCargando", action.payload)
            state.loading = action.payload
        },
        loadingProcesando: (state, action) => {
            console.log("loadingProcesando", action.payload)
            state.sincronizador = action.payload
        }
    },

});

export const { 
    listarEventoHoy, 
    listarEventoAyer, 
    listarEventoMnn,
    loadingCargando,
    loadingProcesando,
 } = sincronizacionSlice.actions;

export default sincronizacionSlice.reducer;

