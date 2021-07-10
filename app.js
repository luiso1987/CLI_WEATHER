require('dotenv').config();

const {
    leerInput,
    inquirerMenu,
    pausa,
    listadoLugares,
    listaHistorial
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async() => {
    const busquedas = new Busquedas();
    let opt = 0;

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                // Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                // Buscar las ciudades
                const lugares = await busquedas.ciudad(termino);

                // Seleccionar el lugar
                const id = await listadoLugares(lugares);
                if(id == 0) continue;

                const lugarSeleccionado = lugares.find( l => l.id == id);
                busquedas.agregarHistorial(lugarSeleccionado);

                // Clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);

                // Mostrar resultados
                busquedas.mostrarDatos(lugarSeleccionado, clima);
                break;

            case 2:
                const hisId = await listaHistorial(busquedas.historial);

                if(hisId == 0)
                    continue;

                const lugarHisSel = busquedas.historial[hisId];
                const climaHis = await busquedas.climaLugar(lugarHisSel.lat, lugarHisSel.lng);

                busquedas.mostrarDatos(lugarHisSel, climaHis);
                break;
        }

        if(opt != 0)
            await pausa();
    } while(opt != 0)
}

main();