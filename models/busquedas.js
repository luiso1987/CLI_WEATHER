const fs = require('fs');

const axios = require('axios');


class Busquedas {
    historial = {};
    dbPath = './db/database.json';

    constructor() {
        this.leerBD();
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsOpenWeather() {
        return {
            'appid': process.env.OPEN_WEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    get historialCapitalizado() {
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        });
    }

    async ciudad(lugar = '') {
        try {
            // peticion HTTP
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?`,
                params: this.paramsMapBox
            });

            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        } catch(err) {
            console.error(err);
            return [];
        }
    }

    async climaLugar(lat, lon) {
        try {
            let params_weather = { ...this.paramsOpenWeather, lat, lon };

            const instanceOW = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: params_weather
            });

            const resp = await instanceOW.get();
            const { weather, main } = resp.data;
            return {
                descripcion: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            };
        } catch(err) {
            console.log(err);
        }
    }

    agregarHistorial(lugar = {}) {
        this.historial[lugar.id] = lugar;
        this.guardarBD();
    }

    guardarBD() {
        fs.writeFileSync(this.dbPath, JSON.stringify(this.historial));
    }

    leerBD() {
        if(!fs.existsSync(this.dbPath))
            return null;

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data;
    }

    mostrarDatos(lugar, clima) {
        console.clear();
        console.log('\nInformación de la ciudad\n'.green);
        console.log('Ciudad:', lugar.nombre.green);
        console.log('Latitud:', lugar.lat);
        console.log('Longitud:', lugar.lng);
        console.log('Temperatura:', clima.temp);
        console.log('Mínima:', clima.min);
        console.log('Máxima:', clima.max);
        console.log('Como está el clima:', clima.descripcion.green);
    }
}

module.exports = Busquedas;