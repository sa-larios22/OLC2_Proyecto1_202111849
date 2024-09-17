import { Invocable } from "./invocable.js";
import { DeclaracionFuncion } from "../ast/nodos.js";
import { Entorno } from "../ast/entorno.js";
import { ReturnException } from "./transferSentences.js";
import { Error_ } from "../errors/error_.js";

export class FuncionForanea extends Invocable {
    constructor(nodo, clousure) {
        super();
        /**
         * @type { DeclaracionFuncion }
         */
        this.nodo = nodo;

        /**
         * @type { Entorno }
         */
        this.clousure = clousure;
    }

    aridad() {
        return this.nodo.params.length;
    }

    /**
     * @type { Invocable['invocar']}
     */
    invocar(interprete, args) {

        if (this.nodo.tipoFunc === 'void' && this.nodo.dims.length > 0) {
            throw new Error_(`La función ${this.nodo.id} es de tipo '${this.nodo.tipoFunc}', no puede tener dimensiones`, this.nodo.linea, this.nodo.columna, 'Semántico');
        }

        if (args.length !== this.nodo.params.length) {
            throw new Error_(`La función ${this.nodo.id} requiere ${this.nodo.params.length} argumentos, pero se le pasaron ${args.length}`, this.nodo.linea, this.nodo.columna, 'Semántico');
        }

        this.nodo.params.forEach((param, index) => {
            if (param.tipo !== args[index].tipo) {
                throw new Error_(`El argumento ${index + 1} de la función ${this.nodo.id} es de tipo ${args[index].tipo}, pero se esperaba un tipo ${param.tipo}`, this.nodo.linea, this.nodo.columna, 'Semántico');
            }
        });

        const entornoNuevo = new Entorno(this.clousure);

        this.nodo.params.forEach((param, index) => {
            entornoNuevo.set(param.id, { valor: args[index].valor, tipo: args[index].tipo });
        });

        const entornoAnterior = interprete.entornoActual;
        interprete.entornoActual = entornoNuevo;

        try {
            this.nodo.bloque.accept(interprete);
        } catch (error) {
            interprete.entornoActual = entornoAnterior;

            if (error instanceof ReturnException) {
                if (this.nodo.tipoFunc === 'void' && error.valor !== null) {
                    throw new Error_(`La función ${this.nodo.id} es de tipo 'void', no puede retornar un valor`, this.nodo.linea, this.nodo.columna, 'Semántico');
                }

                if (this.nodo.tipoFunc !== 'void' && error.valor === null) {
                    throw new Error_(`La función ${this.nodo.id} es de tipo '${this.nodo.tipoFunc}', debe retornar un valor`, this.nodo.linea, this.nodo.columna, 'Semántico');
                }

                if (this.nodo.tipoFunc !== 'void' && error.value.tipo !== this.nodo.tipoFunc) {
                    throw new Error_(`La función ${this.nodo.id} es de tipo '${this.nodo.tipoFunc}', pero se retornó un valor de tipo ${error.valor.tipo}`, this.nodo.linea, this.nodo.columna, 'Semántico');
                }
                
                return error.value;
            }

            throw error;
        }

        interprete.entornoActual = entornoAnterior;
        return null;
    }

    atar(instancia) {
        const entornoOculto = new Entorno(this.clousure);

        entornoOculto.set('this', instancia);

        return new FuncionForanea(this.nodo, entornoOculto);
    }
}