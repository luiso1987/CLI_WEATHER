require('dotenv').config();

const {
    leerInput,
    inquirerMenu,
    pausa,
    listadoLugares
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
                busquedas.agregarHistorial(lugarSeleccionado.nombre);

                // Clima
                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);

                // Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre.green);
                console.log('Latitud:', lugarSeleccionado.lat);
                console.log('Longitud:', lugarSeleccionado.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Mínima:', clima.min);
                console.log('Máxima:', clima.max);
                console.log('Como está el clima:', clima.descripcion.green);
                break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx} ${lugar}`);
                });
        }

        if(opt != 0)
            await pausa();
    } while(opt != 0)
}

main();