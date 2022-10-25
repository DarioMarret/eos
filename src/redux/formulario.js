import { createSlice } from "@reduxjs/toolkit";
import isEmpty from "just-is-empty";
import moment from "moment";
import { OS } from "../utils/constantes";

var initialState = {
    OrdenServicioID: 0,
    equipo: {
        OrdenServicioID: 0,
        equipo_id: 0,
        contrato_id: null,
        Serie: "",
        Marca: "",
        ClienteID: "",
        ClienteNombre: "",
        IdEquipoContrato: 0,
        EstadoEqPrevio: "",
        EstadoEquipo: "",
        TipoEquipo: "",
        ModeloEquipo: "",
        IngenieroID: "",
        empresa_id: 1,
        UsuarioCreacion: "",
        UsuarioModificacion: "",
        Fecha: `${moment().format("YYYY-MM-DD")}T00:00:00`,
        FechaModificacion: `${moment().format("YYYY-MM-DD")}T00:00:00`,
    },
    cliente: {
        Estado: "PROC",
        Ciudad: "",
        ClienteID: "",
        ClienteNombre: "",
        Direccion: "",
        FechaCreacion: `${moment().format("YYYY-MM-DD")}T00:00:00`,
        codOS: 0,
        ticket_id: 0,
        contrato_id: 0,
        CodigoEquipoCliente: "",
    },
    datos: {
        SitioTrabajo: "",
        tipoIncidencia: "",
        Causas: "",
        Sintomas: "",
        Diagnostico: "",
        EstadoEquipo: "",
        EstadoEqPrevio: "",
        Acciones: "",
        IncluyoUpgrade: false,
        ComentarioRestringido: "",
        ComentarioUpgrade: "",
        FechaSeguimiento: "",
        nuevaVisita: false,
        release: "",
        ObservacionIngeniero: "",
        TipoVisita: "",
        Seguimento: false,
        ObservacionCliente: "",
    },
    componente: [],
    adjuntos: [],
    tiempos: [{
        OS_OrdenServicio: null,
        IdTiempo: 0,
        OrdenServicioID: 0,
        HoraSalidaOrigen: null,
        HoraLlegadaCliente: null,
        HoraInicioTrabajo: null,
        HoraFinTrabajo: null,
        HoraSalidaCliente: null,
        TiempoEspera: 0,
        TiempoTrabajo: 0,
        TiempoViaje: 0,
        Fecha: `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
        HoraLlegadaSgteDestino: null,
        TiempoViajeSalida: 0
    }],
    firmas: [],
    checklist: [],
    ordenServicio: {},
    message: "",
    status: 0,
}
function ValidarDatos(state) {
    const { SitioTrabajo, tipoIncidencia, Causas, Sintomas, Diagnostico, TipoVisita, Acciones, EstadoEquipo } = state.datos;
    if (isEmpty(Causas) || isEmpty(Sintomas) || isEmpty(Diagnostico) || isEmpty(TipoVisita) || isEmpty(Acciones) || isEmpty(EstadoEquipo)) {
        return "hay compos vacios en Datos";
    }
    return true
}

function ValidarTiempos(state) {
    const { HoraSalidaOrigen, HoraLlegadaCliente, HoraInicioTrabajo, HoraSalidaCliente } = state.tiempos[0];
    if (isEmpty(HoraLlegadaCliente) || isEmpty(HoraInicioTrabajo) || isEmpty(HoraSalidaCliente)) {
        return "hay compos vacios en ingreso de tiempos";
    }
    return true
}

export const formularioOrdenServicio = createSlice({
    name: "formularioOrdenServicio",
    initialState,
    reducers: {
        SetByOrdenServicioID: (state, action) => {
            state.OrdenServicioID = action.payload;
        },
        setEquipoTool: (state, action) => {
            state.equipo.OrdenServicioID = action.payload.OrdenServicioID
            state.equipo.equipo_id = action.payload.equipo_id
            state.equipo.contrato_id = action.payload.contrato_id
            state.equipo.Serie = action.payload.Serie
            state.equipo.Marca = action.payload.Marca
            state.equipo.ClienteID = action.payload.ClienteID
            state.equipo.ClienteNombre = action.payload.ClienteNombre
            state.equipo.IdEquipoContrato = action.payload.IdEquipoContrato
            state.equipo.EstadoEqPrevio = action.payload.EstadoEqPrevio
            state.equipo.EstadoEquipo = action.payload.EstadoEquipo
            state.equipo.TipoEquipo = action.payload.TipoEquipo
            state.equipo.ModeloEquipo = action.payload.ModeloEquipo
            state.equipo.IngenieroID = action.payload.IngenieroID
            state.equipo.UsuarioCreacion = action.payload.UsuarioCreacion
            state.equipo.UsuarioModificacion = action.payload.UsuarioModificacion
        },
        setClienteTool: (state, action) => {
            state.cliente.codOS = action.payload.codOS
            state.cliente.contrato_id = action.payload.contrato_id
            state.cliente.ticket_id = action.payload.ticket_id
            state.cliente.evento_id = action.payload.evento_id
            state.cliente.Ciudad = action.payload.Ciudad
            state.cliente.ClienteID = action.payload.ClienteID
            state.cliente.ClienteNombre = action.payload.ClienteNombre
            state.cliente.Direccion = action.payload.Direccion
            state.cliente.CodigoEquipoCliente = action.payload.CodigoEquipoCliente
        },
        actualizarClienteTool: (state, action) => {
            const { name, value } = action.payload
            state.cliente[name] = value
        },
        setdatosTool: (state, action) => {
            state.datos.SitioTrabajo = action.payload.SitioTrabajo
            state.datos.tipoIncidencia = action.payload.tipoIncidencia
            state.datos.Causas = action.payload.Causas
            state.datos.Sintomas = action.payload.Sintomas
            state.datos.Diagnostico = action.payload.Diagnostico
            state.datos.EstadoEquipo = action.payload.EstadoEquipo
            state.datos.EstadoEqPrevio = action.payload.EstadoEqPrevio
            state.datos.Acciones = action.payload.Acciones
            state.datos.IncluyoUpgrade = action.payload.IncluyoUpgrade
            state.datos.ComentarioRestringido = action.payload.ComentarioRestringido
            state.datos.ComentarioUpgrade = action.payload.ComentarioUpgrade
            state.datos.FechaSeguimiento = action.payload.FechaSeguimiento
            state.datos.nuevaVisita = action.payload.nuevaVisita
            state.datos.release = action.payload.release
            state.datos.ObservacionIngeniero = action.payload.ObservacionIngeniero
            state.datos.FechaSeguimiento = action.payload.FechaSeguimiento
            state.datos.TipoVisita = action.payload.TipoVisita
            state.datos.Seguimento = action.payload.Seguimento
        },
        actualizarDatosTool: (state, action) => {
            const { name, value } = action.payload
            state.datos[name] = value
        },
        setComponenteTool: (state, action) => {
            state.componente = action.payload
        },
        setAdjuntosTool: (state, action) => {
            state.adjuntos = action.payload
        },
        setTiemposTool: (state, action) => {
            state.tiempos = action.payload
        },
        actualizarTiempoTool: (state, action) => {
            const { name, value } = action.payload
            state.tiempos[0][name] = value
        },
        setFirmasTool: (state, action) => {
            state.firmas = action.payload
        },
        setChecklistTool: (state, action) => {
            state.checklist = action.payload
        },
        setOrdenServicioID: (state, action) => {
            state.OrdenServicioID = action.payload
        },
        resetFormularioTool: (state, action) => {
            // state = undefined
            state.equipo = {
                OrdenServicioID: 0,
                equipo_id: 0,
                contrato_id: 0,
                Serie: "",
                Marca: "",
                ClienteID: "",
                ClienteNombre: "",
                IdEquipoContrato: 0,
                EstadoEqPrevio: "",
                EstadoEquipo: "",
                TipoEquipo: "",
                ModeloEquipo: "",
                IngenieroID: "",
                empresa_id: 1,
                UsuarioCreacion: "",
                UsuarioModificacion: "",
                Fecha: `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}`,
                FechaModificacion: `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}`,
            }
            state.cliente = {
                Estado: "PROC",
                Ciudad: "",
                ClienteID: "",
                ClienteNombre: "",
                Direccion: "",
                FechaCreacion: `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}`,
                codOS: 0,
                ticket_id: 0,
                contrato_id: 0,
                CodigoEquipoCliente: "",
            }
            state.datos = {
                SitioTrabajo: "",
                tipoIncidencia: "",
                Causas: "",
                Sintomas: "",
                Diagnostico: "",
                EstadoEquipo: "",
                EstadoEqPrevio: "",
                Acciones: "",
                IncluyoUpgrade: false,
                ComentarioRestringido: "",
                ComentarioUpgrade: "",
                FechaSeguimiento: "",
                nuevaVisita: false,
                release: "",
                ObservacionIngeniero: "",
                TipoVisita: "",
                Seguimento: false
            }
            state.componente = []
            state.adjuntos = []
            state.tiempos = [{
                OS_OrdenServicio: null,
                IdTiempo: 0,
                OrdenServicioID: 0,
                HoraSalidaOrigen: null,
                HoraLlegadaCliente: null,
                HoraInicioTrabajo: null,
                HoraFinTrabajo: null,
                HoraSalidaCliente: null,
                TiempoEspera: 0,
                TiempoTrabajo: 0,
                TiempoViaje: 0,
                Fecha: `${moment().format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`,
                HoraLlegadaSgteDestino: null,
                TiempoViajeSalida: 0
            }]
            state.firmas = []
            state.checklist = []
            state.ordenServicio = {}
            state.message = ""
            state.status = 0
            state.OrdenServicioID = 0
        },
        actualizarMessageTool: (state, action) => {
            state.message = action.payload
        },
        resetFormMessageTool: (state, action) => {
            state.message = ""
            state.status = 0
        },
        resetStatusTool: (state, action) => {
            state.status = 0
        },
        PutactualizarFormularioTool: (state, action) => {
            const datos = ValidarDatos(state)
            const tiempo = ValidarTiempos(state)
            if (datos == true) {
                if (tiempo == true) {
                    OS.OS_PartesRepuestos = state.componente
                    OS.OS_Anexos = state.adjuntos
                    OS.OS_Tiempos = state.tiempos
                    OS.OS_Firmas = state.firmas
                    OS.OS_CheckList = state.checklist
                    let OS_OrdenServicio = {
                        ...OS,
                        ...state.equipo,
                        ...state.cliente,
                        ...state.datos
                    }
                    state.ordenServicio = OS_OrdenServicio
                    // state.message = 'Orden de servicio actualizada'
                    state.status = 204
                } else {
                    state.message = tiempo
                }
            } else {
                state.message = datos
            }
        },
        PostEnviarFormularioTool: (state, action) => {
            const datos = ValidarDatos(state)
            const tiempo = ValidarTiempos(state)
            if (datos == true) {
                if (tiempo == true) {
                    OS.OS_PartesRepuestos = state.componente
                    OS.OS_Anexos = state.adjuntos
                    OS.OS_Tiempos = state.tiempos
                    OS.OS_Firmas = state.firmas
                    OS.OS_CheckList = state.checklist
                    let OS_OrdenServicio = {
                        ...OS,
                        ...state.equipo,
                        ...state.cliente,
                        ...state.datos
                    }
                    state.ordenServicio = OS_OrdenServicio
                    state.status = 200
                    // state.message = 'Orden Creada Correctamente'
                } else {
                    state.message = tiempo
                }
            } else {
                state.message = datos
            }
        },
        PutaLocalctualizarFormularioTool: (state, action) => {
            const datos = ValidarDatos(state)
            const tiempo = ValidarTiempos(state)
            if (datos == true) {
                if (tiempo == true) {
                    OS.OS_PartesRepuestos = state.componente
                    OS.OS_Anexos = state.adjuntos
                    OS.OS_Tiempos = state.tiempos
                    OS.OS_Firmas = state.firmas
                    OS.OS_CheckList = state.checklist
                    let OS_OrdenServicio = {
                        ...OS,
                        ...state.equipo,
                        ...state.cliente,
                        ...state.datos
                    }
                    OS.Estado = "PROCESO",
                        OS.OS_LOCAL = "UPDATE"
                    state.ordenServicio = OS_OrdenServicio
                    state.status = 304
                } else {
                    state.message = tiempo
                }
            } else {
                state.message = datos
            }
        },
        PostLocalFormularioTool: (state, action) => {
            const datos = ValidarDatos(state)
            const tiempo = ValidarTiempos(state)
            if (datos == true) {
                if (tiempo == true) {
                    const { ticket_id, OrdenServicioID, evento_id } = action.payload
                    OS.OS_PartesRepuestos = state.componente
                    OS.OS_Anexos = state.adjuntos
                    OS.OS_Tiempos = state.tiempos
                    OS.OS_Firmas = state.firmas
                    OS.OS_CheckList = state.checklist
                    OS.OS_LOCAL = "UPDATE"
                    let OS_OrdenServicio = {
                        ...OS,
                        ...state.equipo,
                        ...state.cliente,
                        ...state.datos
                    }
                    OS_OrdenServicio.evento_id = evento_id
                    OS_OrdenServicio.ticket_id = ticket_id
                    OS_OrdenServicio.OrdenServicioID = OrdenServicioID
                    state.ordenServicio = OS_OrdenServicio
                    state.status = 300
                } else {
                    state.message = tiempo
                }
            } else {
                state.message = datos
            }
        },
        PuTFirmaFormularioTool: (state, action) => {
            OS.OS_PartesRepuestos = state.componente
            OS.OS_Anexos = state.adjuntos
            OS.OS_Tiempos = state.tiempos
            OS.OS_Firmas = state.firmas
            OS.OS_CheckList = state.checklist
            let OS_OrdenServicio = {
                ...OS,
                ...state.equipo,
                ...state.cliente,
                ...state.datos
            }
            state.ordenServicio = OS_OrdenServicio
            state.status = 400
        }
    },
})

export const {
    setEquipoTool,
    setClienteTool,
    actualizarClienteTool,
    setdatosTool,
    actualizarDatosTool,
    setComponenteTool,
    setAdjuntosTool,
    setTiemposTool,
    actualizarTiempoTool,
    setFirmasTool,
    setChecklistTool,
    resetFormularioTool,
    resetFormMessageTool,
    PutactualizarFormularioTool,
    PostEnviarFormularioTool,
    resetStatusTool,
    setOrdenServicioID,
    SetByOrdenServicioID,
    actualizarMessageTool,
    PostLocalFormularioTool,
    PutaLocalctualizarFormularioTool,
    PuTFirmaFormularioTool,
} = formularioOrdenServicio.actions;

export default formularioOrdenServicio.reducer;