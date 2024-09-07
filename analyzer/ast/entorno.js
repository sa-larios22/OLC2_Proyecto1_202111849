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
        // console.log('pre-set', this.valores);
        this.valores[nombre] = valor;
        console.log('post-set', this.valores);
    }

    /**
     * @param {string} nombre
     */
    get(nombre) {
        const valorActual = this.valores[nombre];

        // if (valorActual !== undefined && (valorActual.tipo === 'int[]' || valorActual.tipo ==='float[]' || valorActual.tipo === 'string[]' || valorActual.tipo === 'boolean[]' || valorActual.tipo === 'char[]')) {
        //     const listaValores = [];
        //     for (let i = 0; i < valorActual.valor.length; i++) {
        //         listaValores.push(valorActual.valor[i]);
        //     }
        //     return { tipo: valorActual.tipo, valor: listaValores };
        // }

        if (valorActual !== undefined) { return valorActual; }

        if (!valorActual && this.padre) {
            return this.padre.get(nombre);
        }

        throw new Error(`No se pudo obtener ${nombre}, la variable no ha sido declarada`);
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

        throw new Error(`No se pudo asignar un nuevo valor a ${nombre}, la variable no ha sido declarada`);
    }
}