export const hostBase = "https://technical.eos.med.ec/webApiSegura/api";
export const host = "https://technical.eos.med.ec/"
//AsyncStorange
export const token = "datos_usuario:";
export const datos_ingenieros = "datos_ingenieros:";

//VALUES FOR LOGIN
export const USER = "user:";

//VALUES DATAS EQUIPOS
export const equipos = "equipos:"
export const modelo = "modelo:"
export const clientes = "clientes:"
export const ingenieros = "ingenieros:"
export const equipos_ingeniero_historial = "equipos_ingeniero_historial:"
export const ticketID = "ticket_id:"

//DATOS QUE SE VAN GUARDANDO EN LOS TAV EQUIPO CLINETE DATOS COMPONETES ADJUNTOS TIEMPOS
export const equipo = "1-equipo:"
export const CLIENTE_ = "2-cliente:"
export const DATOS_ = "3-datos:"
export const COMPONENTE_ = "4-componentes:"
export const adjuntos = "5-adjuntos:"
export const tiempos = "6-tiempos:"

export const componente = [
    {
        id: 1,
        description: "Parte Soliciada",
    },
    {
        id: 2,
        description: "Parte Instalada",
    }
]

export const diagnoctico = [
    {
        id: 1,
        description: "Down"
    },
    {
        id: 2,
        description: "Operativo"
    },
    {
        id: 3,
        description: "Pendiente Instalacion"
    },
    {
        id: 4,
        description: "Restringido"
    }
]

export const estadoSwitch = [
    {
        id: 1,
        description: "CLIENTE",
        estado: 0
    },
    {
        id: 2,
        description: "DATOS",
        estado: 0
    },
    {
        id: 3,
        description: "COMPONENTES",
        estado: 0
    },
    {
        id: 4,
        description: "ADJUNTOS",
        estado: 0
    },
    {
        id: 5,
        description: "TIEMPOS",
        estado: 0
    }
]

export const OS = {
    provinciaId: null,
    cantonId: null,
    tipoIncidencia: "",
    localidad: null,
    equ_hardware: null,
    con_contratoLegal: "",
    equ_fechaFabricacion: null,
    equ_systemCode: null,
    OrdenServicioID: 0,
    TipoVisita: "04",
    Fecha: "",
    Estado: "ACTI",
    Finalizado: null,
    evento_id: 0,
    ticket_id: 0,
    empresa_id: 1,
    contrato_id: 0,
    equipo_id: 0,
    Serie: null,
    TipoEquipo: null,
    ModeloEquipo: null,
    Marca: "",
    ObservacionEquipo: null,
    CodigoEquipoCliente: "",
    ClienteID: "",
    ClienteNombre: "",
    Sintomas: "",
    Causas: "",
    Diagnostico: " ",
    Acciones: "",
    SitioTrabajo: "",
    EstadoEquipo: "",
    ComentarioRestringido: "",
    IncluyoUpgrade: true,
    ComentarioUpgrade: "",
    Seguimento: true,
    FechaSeguimiento: "",
    ObservacionCliente: "",
    ObservacionIngeniero: "",
    IngenieroID: null,
    UsuarioCreacion: null,
    UsuarioModificacion: null,
    FechaCreacion: "",
    FechaModificacion: "",
    IdEquipoContrato: 0,
    EstadoEqPrevio: "",
    ContactoInforme: "",
    CargoContactoInforme: "",
    ObservacionCheckList: "",
    Direccion: "",
    Ciudad: "",
    incidencia: "",
    nuevaVisita: true,
    release: "",
    OS_Anexos: [],
    OS_CheckList: [],
    OS_Colaboradores: [],
    OS_Encuesta: [],
    OS_Firmas: [],
    OS_PartesRepuestos: [],
}
console.log("constantes.js", Object.keys(OS).length);
export const OS_CheckList = []
export const OS_Firmas = []
export const OS_PartesRepuestos = []
export const OS_Anexos = []

export const OS_Tiempos = []

export const OS_Colaboradores = []

export const Provincia = [
    {
        "id": "01",
        "descripcion": "Azuay"
    },
    {
        "id": "02",
        "descripcion": "Bolívar"
    },
    {
        "id": "03",
        "descripcion": "Cañar"
    },
    {
        "id": "04",
        "descripcion": "Carchi"
    },
    {
        "id": "06",
        "descripcion": "Chimborazo"
    },
    {
        "id": "05",
        "descripcion": "Cotopaxi"
    },
    {
        "id": "07",
        "descripcion": "El Oro"
    },
    {
        "id": "08",
        "descripcion": "Esmeraldas"
    },
    {
        "id": "20",
        "descripcion": "Galápagos"
    },
    {
        "id": "09",
        "descripcion": "Guayas"
    },
    {
        "id": "10",
        "descripcion": "Imbabura"
    },
    {
        "id": "11",
        "descripcion": "Loja"
    },
    {
        "id": "12",
        "descripcion": "Los Ríos"
    },
    {
        "id": "13",
        "descripcion": "Manabi"
    },
    {
        "id": "14",
        "descripcion": "Morona Santiago"
    },
    {
        "id": "15",
        "descripcion": "Napo"
    },
    {
        "id": "22",
        "descripcion": "Orellana"
    },
    {
        "id": "16",
        "descripcion": "Pastaza"
    },
    {
        "id": "17",
        "descripcion": "Pichincha"
    },
    {
        "id": "24",
        "descripcion": "Santa Elena"
    },
    {
        "id": "23",
        "descripcion": "Santo Domingo de los Tsachilas"
    },
    {
        "id": "99",
        "descripcion": "SIN PROVINCIA"
    },
    {
        "id": "21",
        "descripcion": "Sucumbíos"
    },
    {
        "id": "18",
        "descripcion": "Tungurahua"
    },
    {
        "id": "19",
        "descripcion": "Zamora Chinchipe"
    }
]

export const Canton = [
    {
        "id": "9999",
        "descripcion": " "
    },
    {
        "id": "1316",
        "descripcion": "24 DE MAYO "
    },
    {
        "id": "2202",
        "descripcion": "AGUARICO "
    },
    {
        "id": "0602",
        "descripcion": "ALAUSI "
    },
    {
        "id": "0902",
        "descripcion": "ALFREDO BAQUERIZO MORENO (JUJAN) "
    },
    {
        "id": "1801",
        "descripcion": "AMBATO "
    },
    {
        "id": "1002",
        "descripcion": "ANTONIO ANTE "
    },
    {
        "id": "1604",
        "descripcion": "ARAJUNO "
    },
    {
        "id": "1503",
        "descripcion": "ARCHIDONA "
    },
    {
        "id": "0702",
        "descripcion": "ARENILLAS "
    },
    {
        "id": "0806",
        "descripcion": "ATACAMES "
    },
    {
        "id": "0703",
        "descripcion": "ATAHUALPA "
    },
    {
        "id": "0301",
        "descripcion": "AZOGUES "
    },
    {
        "id": "1202",
        "descripcion": "BABA "
    },
    {
        "id": "1201",
        "descripcion": "BABAHOYO "
    },
    {
        "id": "0903",
        "descripcion": "BALAO "
    },
    {
        "id": "0704",
        "descripcion": "BALSAS "
    },
    {
        "id": "0904",
        "descripcion": "BALZAR "
    },
    {
        "id": "1802",
        "descripcion": "BAÑOS DE AGUA SANTA "
    },
    {
        "id": "0302",
        "descripcion": "BIBLIAN "
    },
    {
        "id": "0402",
        "descripcion": "BOLIVAR "
    },
    {
        "id": "1302",
        "descripcion": "BOLIVAR "
    },
    {
        "id": "1210",
        "descripcion": "BUENA FE "
    },
    {
        "id": "0206",
        "descripcion": "CALUMA "
    },
    {
        "id": "1102",
        "descripcion": "CALVAS "
    },
    {
        "id": "0115",
        "descripcion": "CAMILO PONCE ENRIQUEZ "
    },
    {
        "id": "0303",
        "descripcion": "CAÑAR "
    },
    {
        "id": "1509",
        "descripcion": "CARLOS JULIO AROSEMENA TOLA "
    },
    {
        "id": "2106",
        "descripcion": "CASCALES "
    },
    {
        "id": "1103",
        "descripcion": "CATAMAYO "
    },
    {
        "id": "1702",
        "descripcion": "CAYAMBE "
    },
    {
        "id": "1104",
        "descripcion": "CELICA "
    },
    {
        "id": "1907",
        "descripcion": "CENTINELA DEL CONDOR "
    },
    {
        "id": "1803",
        "descripcion": "CEVALLOS "
    },
    {
        "id": "1105",
        "descripcion": "CHAGUARPAMBA "
    },
    {
        "id": "0604",
        "descripcion": "CHAMBO "
    },
    {
        "id": "0705",
        "descripcion": "CHILLA "
    },
    {
        "id": "0202",
        "descripcion": "CHILLANES "
    },
    {
        "id": "0203",
        "descripcion": "CHIMBO "
    },
    {
        "id": "1902",
        "descripcion": "CHINCHIPE "
    },
    {
        "id": "1303",
        "descripcion": "CHONE "
    },
    {
        "id": "0111",
        "descripcion": "CHORDELEG "
    },
    {
        "id": "0605",
        "descripcion": "CHUNCHI "
    },
    {
        "id": "0905",
        "descripcion": "COLIMES "
    },
    {
        "id": "0603",
        "descripcion": "COLTA "
    },
    {
        "id": "0923",
        "descripcion": "CORONEL MARCELINO MARIDUEÑA "
    },
    {
        "id": "1003",
        "descripcion": "COTACACHI "
    },
    {
        "id": "0101",
        "descripcion": "CUENCA "
    },
    {
        "id": "0610",
        "descripcion": "CUMANDA "
    },
    {
        "id": "2107",
        "descripcion": "CUYABENO "
    },
    {
        "id": "0906",
        "descripcion": "DAULE "
    },
    {
        "id": "0306",
        "descripcion": "DEELEG "
    },
    {
        "id": "0907",
        "descripcion": "DURAN "
    },
    {
        "id": "0204",
        "descripcion": "ECHEANDIA "
    },
    {
        "id": "1304",
        "descripcion": "EL CARMEN "
    },
    {
        "id": "1504",
        "descripcion": "EL CHACO "
    },
    {
        "id": "0908",
        "descripcion": "EL EMPALME "
    },
    {
        "id": "0706",
        "descripcion": "EL GUABO "
    },
    {
        "id": "0112",
        "descripcion": "EL PAN "
    },
    {
        "id": "1906",
        "descripcion": "EL PANGUI "
    },
    {
        "id": "0305",
        "descripcion": "EL TAMBO "
    },
    {
        "id": "0909",
        "descripcion": "EL TRIUNFO "
    },
    {
        "id": "0802",
        "descripcion": "ELOY ALFARO "
    },
    {
        "id": "0801",
        "descripcion": "ESMERALDAS "
    },
    {
        "id": "0403",
        "descripcion": "ESPEJO "
    },
    {
        "id": "1106",
        "descripcion": "ESPINDOLA "
    },
    {
        "id": "1305",
        "descripcion": "FLAVIO ALFARO "
    },
    {
        "id": "0927",
        "descripcion": "GENERAL ANTONIO ELIZALDE (BUCAY) "
    },
    {
        "id": "0102",
        "descripcion": "GIRON "
    },
    {
        "id": "2102",
        "descripcion": "GONZALO PIZARRO "
    },
    {
        "id": "1107",
        "descripcion": "GONZANAMA "
    },
    {
        "id": "0114",
        "descripcion": "GUACHAPALA "
    },
    {
        "id": "0103",
        "descripcion": "GUALACEO "
    },
    {
        "id": "1402",
        "descripcion": "GUALAQUIZA "
    },
    {
        "id": "0606",
        "descripcion": "GUAMOTE "
    },
    {
        "id": "0607",
        "descripcion": "GUANO "
    },
    {
        "id": "0201",
        "descripcion": "GUARANDA "
    },
    {
        "id": "0901",
        "descripcion": "GUAYAQUIL "
    },
    {
        "id": "1407",
        "descripcion": "HUAMBOYA "
    },
    {
        "id": "0707",
        "descripcion": "HUAQUILLAS "
    },
    {
        "id": "1001",
        "descripcion": "IBARRA "
    },
    {
        "id": "2002",
        "descripcion": "ISABELA "
    },
    {
        "id": "0928",
        "descripcion": "ISIDRO AYORA "
    },
    {
        "id": "1320",
        "descripcion": "JAMA "
    },
    {
        "id": "1321",
        "descripcion": "JARAMIJO "
    },
    {
        "id": "1306",
        "descripcion": "JIPIJAPA "
    },
    {
        "id": "1307",
        "descripcion": "JUNIN "
    },
    {
        "id": "0808",
        "descripcion": "LA CONCORDIA "
    },
    {
        "id": "2203",
        "descripcion": "LA JOYA DE LOS SACHAS "
    },
    {
        "id": "2402",
        "descripcion": "LA LIBERTAD "
    },
    {
        "id": "0502",
        "descripcion": "LA MANA "
    },
    {
        "id": "0304",
        "descripcion": "LA TRONCAL "
    },
    {
        "id": "2101",
        "descripcion": "LAGO AGRIO "
    },
    {
        "id": "0714",
        "descripcion": "LAS LAJAS "
    },
    {
        "id": "0207",
        "descripcion": "LAS NAVES "
    },
    {
        "id": "0501",
        "descripcion": "LATACUNGA "
    },
    {
        "id": "1403",
        "descripcion": "LIMON INDANZA "
    },
    {
        "id": "1410",
        "descripcion": "LOGROÑO "
    },
    {
        "id": "1101",
        "descripcion": "LOJA "
    },
    {
        "id": "0924",
        "descripcion": "LOMAS DE SARGENTILLO "
    },
    {
        "id": "2204",
        "descripcion": "LORETO "
    },
    {
        "id": "1108",
        "descripcion": "MACARA "
    },
    {
        "id": "0701",
        "descripcion": "MACHALA "
    },
    {
        "id": "1308",
        "descripcion": "MANTA "
    },
    {
        "id": "0708",
        "descripcion": "MARCABELI "
    },
    {
        "id": "1703",
        "descripcion": "MEJIA "
    },
    {
        "id": "1602",
        "descripcion": "MERA "
    },
    {
        "id": "0910",
        "descripcion": "MILAGRO "
    },
    {
        "id": "0404",
        "descripcion": "MIRA "
    },
    {
        "id": "1212",
        "descripcion": "MOCACHE "
    },
    {
        "id": "1804",
        "descripcion": "MOCHA "
    },
    {
        "id": "1203",
        "descripcion": "MONTALVO "
    },
    {
        "id": "1309",
        "descripcion": "MONTECRISTI "
    },
    {
        "id": "0405",
        "descripcion": "MONTUFAR "
    },
    {
        "id": "1401",
        "descripcion": "MORONA "
    },
    {
        "id": "0803",
        "descripcion": "MUISNE "
    },
    {
        "id": "0104",
        "descripcion": "NABON "
    },
    {
        "id": "1903",
        "descripcion": "NANGARITZA "
    },
    {
        "id": "0911",
        "descripcion": "NARANJAL "
    },
    {
        "id": "0912",
        "descripcion": "NARANJITO "
    },
    {
        "id": "0925",
        "descripcion": "NOBOL "
    },
    {
        "id": "1116",
        "descripcion": "OLMEDO "
    },
    {
        "id": "1318",
        "descripcion": "OLMEDO "
    },
    {
        "id": "0110",
        "descripcion": "OÑA "
    },
    {
        "id": "2201",
        "descripcion": "ORELLANA "
    },
    {
        "id": "1004",
        "descripcion": "OTAVALO "
    },
    {
        "id": "1411",
        "descripcion": "PABLO SEXTO "
    },
    {
        "id": "1310",
        "descripcion": "PAJAN "
    },
    {
        "id": "1908",
        "descripcion": "PALANDA "
    },
    {
        "id": "1209",
        "descripcion": "PALENQUE "
    },
    {
        "id": "0913",
        "descripcion": "PALESTINA "
    },
    {
        "id": "0608",
        "descripcion": "PALLATANGA "
    },
    {
        "id": "1404",
        "descripcion": "PALORA "
    },
    {
        "id": "1109",
        "descripcion": "PALTAS "
    },
    {
        "id": "0503",
        "descripcion": "PANGUA "
    },
    {
        "id": "1909",
        "descripcion": "PAQUISHA "
    },
    {
        "id": "0709",
        "descripcion": "PASAJE "
    },
    {
        "id": "1601",
        "descripcion": "PASTAZA "
    },
    {
        "id": "1805",
        "descripcion": "PATATE "
    },
    {
        "id": "0105",
        "descripcion": "PAUTE "
    },
    {
        "id": "1317",
        "descripcion": "PEDERNALES "
    },
    {
        "id": "0914",
        "descripcion": "PEDRO CARBO "
    },
    {
        "id": "1704",
        "descripcion": "PEDRO MONCAYO "
    },
    {
        "id": "1708",
        "descripcion": "PEDRO VICENTE MALDONADO "
    },
    {
        "id": "0609",
        "descripcion": "PENIPE "
    },
    {
        "id": "1311",
        "descripcion": "PICHINCHA "
    },
    {
        "id": "1005",
        "descripcion": "PIMAMPIRO "
    },
    {
        "id": "0710",
        "descripcion": "PIÑAS "
    },
    {
        "id": "1114",
        "descripcion": "PINDAL "
    },
    {
        "id": "0921",
        "descripcion": "PLAYAS "
    },
    {
        "id": "0711",
        "descripcion": "PORTOVELO "
    },
    {
        "id": "1301",
        "descripcion": "PORTOVIEJO "
    },
    {
        "id": "1390",
        "descripcion": "PORTOVIEJO "
    },
    {
        "id": "1391",
        "descripcion": "PORTOVIEJO "
    },
    {
        "id": "0106",
        "descripcion": "PUCARA "
    },
    {
        "id": "1204",
        "descripcion": "PUEBLOVIEJO "
    },
    {
        "id": "1319",
        "descripcion": "PUERTO LOPEZ "
    },
    {
        "id": "1709",
        "descripcion": "PUERTO QUITO "
    },
    {
        "id": "0504",
        "descripcion": "PUJILI "
    },
    {
        "id": "2103",
        "descripcion": "PUTUMAYO "
    },
    {
        "id": "1110",
        "descripcion": "PUYANGO "
    },
    {
        "id": "1806",
        "descripcion": "QUERO "
    },
    {
        "id": "1205",
        "descripcion": "QUEVEDO "
    },
    {
        "id": "1507",
        "descripcion": "QUIJOS "
    },
    {
        "id": "1115",
        "descripcion": "QUILANGA "
    },
    {
        "id": "0804",
        "descripcion": "QUININDE "
    },
    {
        "id": "1213",
        "descripcion": "QUINSALOMA "
    },
    {
        "id": "1701",
        "descripcion": "QUITO "
    },
    {
        "id": "0601",
        "descripcion": "RIOBAMBA "
    },
    {
        "id": "0807",
        "descripcion": "RIOVERDE "
    },
    {
        "id": "1312",
        "descripcion": "ROCAFUERTE "
    },
    {
        "id": "1705",
        "descripcion": "RUMIÑAHUI "
    },
    {
        "id": "0505",
        "descripcion": "SALCEDO "
    },
    {
        "id": "2403",
        "descripcion": "SALINAS "
    },
    {
        "id": "0919",
        "descripcion": "SALITRE (URBINA JADO) "
    },
    {
        "id": "0916",
        "descripcion": "SAMBORONDON "
    },
    {
        "id": "2001",
        "descripcion": "SAN CRISTOBAL "
    },
    {
        "id": "0107",
        "descripcion": "SAN FERNANDO "
    },
    {
        "id": "0920",
        "descripcion": "SAN JACINTO DE YAGUACHI "
    },
    {
        "id": "1408",
        "descripcion": "SAN JUAN BOSCO "
    },
    {
        "id": "0805",
        "descripcion": "SAN LORENZO "
    },
    {
        "id": "0205",
        "descripcion": "SAN MIGUEL "
    },
    {
        "id": "1707",
        "descripcion": "SAN MIGUEL DE LOS BANCOS "
    },
    {
        "id": "1006",
        "descripcion": "SAN MIGUEL DE URCUQUI "
    },
    {
        "id": "0406",
        "descripcion": "SAN PEDRO DE HUACA "
    },
    {
        "id": "1807",
        "descripcion": "SAN PEDRO DE PELILEO "
    },
    {
        "id": "1322",
        "descripcion": "SAN VICENTE "
    },
    {
        "id": "1313",
        "descripcion": "SANTA ANA "
    },
    {
        "id": "1603",
        "descripcion": "SANTA CLARA "
    },
    {
        "id": "2003",
        "descripcion": "SANTA CRUZ "
    },
    {
        "id": "2401",
        "descripcion": "SANTA ELENA "
    },
    {
        "id": "0108",
        "descripcion": "SANTA ISABEL "
    },
    {
        "id": "0918",
        "descripcion": "SANTA LUCIA "
    },
    {
        "id": "0712",
        "descripcion": "SANTA ROSA "
    },
    {
        "id": "1405",
        "descripcion": "SANTIAGO "
    },
    {
        "id": "1808",
        "descripcion": "SANTIAGO DE PILLARO "
    },
    {
        "id": "2301",
        "descripcion": "SANTO DOMINGO "
    },
    {
        "id": "0506",
        "descripcion": "SAQUISILI "
    },
    {
        "id": "1111",
        "descripcion": "SARAGURO "
    },
    {
        "id": "0113",
        "descripcion": "SEVILLA DE ORO "
    },
    {
        "id": "2104",
        "descripcion": "SHUSHUFINDI "
    },
    {
        "id": "0507",
        "descripcion": "SIGCHOS "
    },
    {
        "id": "0109",
        "descripcion": "SIGSIG "
    },
    {
        "id": "0922",
        "descripcion": "SIMON BOLIVAR "
    },
    {
        "id": "1112",
        "descripcion": "SOZORANGA "
    },
    {
        "id": "1314",
        "descripcion": "SUCRE "
    },
    {
        "id": "1406",
        "descripcion": "SUCUA "
    },
    {
        "id": "2105",
        "descripcion": "SUCUMBIOS "
    },
    {
        "id": "0307",
        "descripcion": "SUSCAL "
    },
    {
        "id": "1409",
        "descripcion": "TAISHA "
    },
    {
        "id": "1501",
        "descripcion": "TENA "
    },
    {
        "id": "1809",
        "descripcion": "TISALEO "
    },
    {
        "id": "1412",
        "descripcion": "TIWINTZA "
    },
    {
        "id": "1315",
        "descripcion": "TOSAGUA "
    },
    {
        "id": "0401",
        "descripcion": "TULCAN "
    },
    {
        "id": "1206",
        "descripcion": "URDANETA "
    },
    {
        "id": "1211",
        "descripcion": "VALENCIA "
    },
    {
        "id": "1207",
        "descripcion": "VENTANAS "
    },
    {
        "id": "1208",
        "descripcion": "VINCES "
    },
    {
        "id": "1904",
        "descripcion": "YACUAMBI "
    },
    {
        "id": "1905",
        "descripcion": "YANTZAZA "
    },
    {
        "id": "1901",
        "descripcion": "ZAMORA "
    },
    {
        "id": "1113",
        "descripcion": "ZAPOTILLO "
    },
    {
        "id": "0713",
        "descripcion": "ZARUMA "
    }
]




/// EXAMPLE 2
export const os_checklist = {
    OS_OrdenServicio: 0,
    CheckListID: 0,
    OrdenServicioID: 0,
    empresa_id: 1,
    IdCheckList: null,
    Checked: true,
    UsuarioCreacion: null,
    FechaCreacion: null,
    UsuarioModificacion: null,
    FechaModificacion: null,
    Estado: "ACTI",
    Observacion: null
}
export const os_firma ={
    OS_OrdenServicio: null,
    IdFirma: 0,
    OrdenServicioID: 0,
    Ruta: null,
    FechaCreacion: null,
    UsuarioCreacion: null,
    FechaModificacion: null,
    UsuarioModificacion: null,
    Estado: "ACTI",
    Cargo: null,
    Nombre: null,
    Cedula: null,
    Longitud: null,
    Latitud: null,
    Correo: null,
    archivo: ""
}
export const ParteRespuestos = {
    IdParte: 0,
    OrdenServicioID: 0,
    Tipo: null,
    Codigo: null,
    Descripcion: null,
    Cantidad: null,
    Doa: null,
    Exchange: null,
    FechaCreacion: null,
    UsuarioCreacion: null,
    FechaModificacion: null,
    UsuarioModificacion: null,
    Estado: "ACTI",
    Garantia: null,
    componente_id: null,
    serie: "",
    modelo: "",
    fabricante: "",
    tamano: "",
    fechaFabricacion: "",
    fechaInstalacion: "",
    voltaje: "",
    ubicacion: "",
    potencia: "",
    numero: "",
    sistemaOperativo: "",
    release: "",
    OS_OrdenServicio: null,
}

export const anexos = {
    OS_OrdenServicio: null,
    IdAnexo: 0,
    OrdenServicioID: 0,
    Ruta: null,
    FechaCreacion: null,
    UsuarioCreacion: null,
    FechaModificacion: null,
    UsuarioModificacion: null,
    Estado: "ACTI",
    Descripcion: null,
    esOSFisica: false,
    archivo: null,
    switch: false,
}

export const timpo = {
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
    Fecha: null,
    HoraLlegadaSgteDestino: null,
    TiempoViajeSalida: 0
}