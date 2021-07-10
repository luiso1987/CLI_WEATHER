require('colors')

const inquirer = require('inquirer');


const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desa hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            }
        ]
    }
];
const inquirerMenu = async() => {

    console.clear();

    console.log('=========================='.green);
    console.log('  Seleccione una opción'.white);
    console.log('==========================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
}

const pausa = async() => {
    await inquirer.prompt([
        {
            type: 'input',
            name: 'enter',
            message: `\n\nPresione ${ 'Enter'.green } para continuar\n`
        }
    ]);
}

const leerInput = async( message ) => {

    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if(value.length === 0)
                    return 'Por favor ingrese un valor';

                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(question);
    return desc;

}

const listadoLugares = async( lugares = []) => {
    const choices = lugares.map((lugar, i) => {
        const idx = `${i + 1}.`.green;

        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: 0,
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar',
            choices
        }
    ];

    const { id } = await inquirer.prompt(preguntas);
    return id;
}

const listaHistorial = async( historial = []) => {
    const choices = historial.map((his, i) => {
        const idx = `${i + 1}.`.green;

        return {
            value: his,
            name: `${idx} ${his}`
        }
    });

    choices.unshift({
        value: 0,
        name: '0'.red + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'lugar',
            message: 'Historial',
            choices
        }
    ];

    const { lugar } = await inquirer.prompt(preguntas);
    return lugar;
}


module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listadoLugares,
    listaHistorial,
}