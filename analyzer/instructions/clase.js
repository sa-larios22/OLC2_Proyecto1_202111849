import { Expresion } from "../ast/nodos.js";
import { FuncionForanea } from "./foranea.js";
import { Instancia } from "./instancia.js";
import { Invocable } from "./invocable.js";

export class Clase extends Invocable {

    constructor(nombre, propiedades, metodos) {
        super();

        /**
         * @type {string}
         */
        this.nombre = nombre;

        /**
         * @type {Object.<string, Expresion>}
         */
        this.propiedades = propiedades;

        /**
         * @type {Object.<string, FuncionForanea>}
         */
        this.metodos = metodos;
    }

    /**
     * 
     * @param { string } nombre 
     * @returns { FuncionForanea | null}
     */
    buscarMetodo(nombre) {
        if (this.metodos.hasOwnProperty(nombre)) {
            return this.metodos[nombre];
        }

        return null;
    }

    aridad() {
        const constructor = this.buscarMetodo('constructor');

        if (constructor) {
            return constructor.aridad();
        }

        return 0;
    }

    /**
     * @type { Invocable['invocar']}
     */
    invocar(interprete, args) {
        const nuevaInstancia = new Instancia(this);

        // Valores por defecto
        Object.entries(this.propiedades).forEach(([nombre, valor]) => {
            nuevaInstancia.set(nombre, valor.accept(interprete));
        });

        const constructor = this.buscarMetodo('constructor');
        if (constructor) {
            constructor.atar(nuevaInstancia).invocar(interprete, args);
        }

        return nuevaInstancia;
    }
}