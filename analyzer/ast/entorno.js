import { Error_ } from "../errors/error_.js";

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
            // console.log('post-set', this.valores);
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
}