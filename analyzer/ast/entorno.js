import { Error_ } from "../errors/error_.js";
import { Simbolo } from "./simbolo.js";
import { listaSimbolos } from "../../js/index.js";

export class Entorno {

    /**
     * @param {Entorno} padre
     */
    constructor(padre = undefined) {
        this.valores = {};
        this.padre = padre;
    }

    /**
     * @param {string} nombre
     * @param {any} valor
     */
    set(nombre, valor) {
        if (this.valores.hasOwnProperty(nombre)) {
            throw new Error_(`El valor ${nombre} ya ha sido asignado en este entorno`, 0, 0, 'Semántico');
        }

        this.valores[nombre] = valor;

        // const simbolo = new Simbolo(nombre, 'variable', typeof valor, 0, 0);
        // listaSimbolos.push(simbolo);
    }

    /**
     * @param {string} nombre
     */
    get(nombre) {
        const valorActual = this.valores[nombre];

        if (valorActual !== undefined) { return valorActual; }

        if (!valorActual && this.padre) {
            return this.padre.get(nombre);
        }

        throw new Error_(`No se pudo obtener ${nombre}, la variable no ha sido declarada`, 0, 0, 'Semántico');
    }

    assign(nombre, valor) {
        const valorActual = this.valores[nombre];

        if (valorActual !== undefined) {
            this.valores[nombre] = valor;
            return;
        }

        if (!valorActual && this.padre) {
            this.padre.assign(nombre, valor);
            return;
        }

        throw new Error_(`No se pudo asignar un nuevo valor a ${nombre}, la variable no ha sido declarada`, 0, 0, 'Semántico');
    }

    delete(nombre) {
        if (this.valores.hasOwnProperty(nombre)) {
            delete this.valores[nombre];
            return;
        }

        if (!this.valores.hasOwnProperty(nombre) && this.padre) {
            this.padre.delete(nombre);
            return;
        }

        throw new Error_(`No se pudo eliminar ${nombre}, la variable no ha sido declarada`, 0, 0, 'Semántico');
    }
}