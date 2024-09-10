import { Invocable } from "./invocable.js";
import { DeclaracionFuncion } from "../ast/nodos.js";
import { Entorno } from "../ast/entorno.js";
import { ReturnException } from "./transferSentences.js";

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
        const entornoNuevo = new Entorno(this.clousure);

        this.nodo.params.forEach((param, index) => {
            entornoNuevo.set(param, args[index]);
        });

        const entornoAnterior = interprete.entornoActual;
        interprete.entornoActual = entornoNuevo;

        try {
            this.nodo.bloque.accept(interprete);
        } catch (error) {
            interprete.entornoActual = entornoAnterior;

            if (error instanceof ReturnException) {
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