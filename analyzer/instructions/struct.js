import { Instancia } from "./instancia.js";
import { Invocable } from "./invocable.js";

export class Struct extends Invocable {
    constructor(nombre, propiedades) {
        super();

        /**
         * @type {string}
         */
        this.nombre = nombre;

        /**
         * @type {Object.<string, Expresion>}
         */
        this.propiedades = propiedades;
    }


    aridad() {
        return Object.keys(this.propiedades).length;
    }

    /**
     * @type { Invocable['invocar']}
     */
    invocar(interprete, args) {
        const nuevaInstancia = new Instancia(this);

        // Valores por defecto
        Object.entries(this.propiedades).forEach(([nombre, tipo]) => {
            // nuevaInstancia.set(nombre, tipo);
            const valor = args.find(arg => arg.id === nombre);
            if (!(valor)) {
                throw new Error(`No se ha encontrado el valor para la propiedad ${nombre}`);
            }

            const valorFinal = valor.exp.accept(interprete);
            if (valorFinal.tipo !== tipo) {
                throw new Error(`El valor para la propiedad ${nombre} no es del tipo esperado`);
            }

            nuevaInstancia.set(nombre, valorFinal);
        });

        return nuevaInstancia;
    }
}