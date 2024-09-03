import { InterpreterVisitor } from "../ast/interprete.js";

export class Invocable {

    // La aridad es la cantidad de parámetros o argumentos necesarios para que una función corra
    aridad() {
        throw new Error('Aridad - Not implemented');
    }

    /**
     * @param interprete { InterpreterVisitor }
     * @param args { any[] }
     */
    invocar(interprete, args) {
        throw new Error('Invocar - Not implemented');
    }
}