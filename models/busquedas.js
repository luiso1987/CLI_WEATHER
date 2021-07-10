const fs = require('fs');

const axios = require('axios');


class Busquedas {
    historial = [];
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

    agregarHistorial(lugar = '') {
        if(this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0, 4)
        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarBD();
    }

    guardarBD() {
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerBD() {
        if(!fs.existsSync(this.dbPath))
            return null;

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;
    }
}

module.exports = Busquedas;