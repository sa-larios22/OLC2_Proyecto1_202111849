import { embededFunctions } from '../instructions/embededFunctions.js';
import { FuncionForanea } from '../instructions/foranea.js';
import { Invocable } from '../instructions/invocable.js';
import { BreakException, ContinueException, ReturnException } from '../instructions/transferSentences.js';
import { Entorno } from './entorno.js';
import nodos, { Expresion } from './nodos.js';
import { BaseVisitor } from './visitor.js';

export class InterpreterVisitor extends BaseVisitor {

    constructor() {
        super();
        this.entornoActual = new Entorno();

        // Funciones embedidas
        Object.entries(embededFunctions).forEach(([nombre, funcion]) => {
            this.entornoActual.set(nombre, funcion);
        });

        this.salida = '';

        /**
         * @type { Expresion | null}
         */
        this.prevContinue = null;
    }
    
    /**
     * @type { BaseVisitor['visitOperacionBinaria'] }
     */
    visitOperacionBinaria(node) {
        const izq = node.izq.accept(this);
        const der = node.der.accept(this);

        switch (node.op) {
            case '+':
                return izq + der;
            case '-':
                return izq - der;
            case '*':
                return izq * der;
            case '/':
                return izq / der;
            case '%':
                return izq % der;
            case '<=':
                return izq <= der;
            case '==':
                return izq === der;
            default:
                throw new Error('Operador no soportado');
        }
    }
    
    /**
     * @type { BaseVisitor['visitOperacionUnaria'] }
     */
    visitOperacionUnaria(node) {
        const exp = node.exp.accept(this);

        switch (node.op) {
            case '-':
                return -exp;
            default:
                throw new Error('Operador no soportado');
        }
    }
    
    /**
     * @type { BaseVisitor['visitParentesis'] }
     */
    visitParentesis(node) {
        return node.accept(this);
    }
    
    /**
     * @type { BaseVisitor['visitNumero'] }
     */
    visitNumero(node) {
        return node.valor;
    }
    
    /**
     * @type { BaseVisitor['visitDeclaracionVariable'] }
     */
    visitDeclaracionVariable(node) {
        const nombreVariable = node.id;
        const valorVariable = node.exp.accept(this);

        this.entornoActual.set(nombreVariable, valorVariable);
    }
    
    /**
     * @type { BaseVisitor['visitReferenciaVariable'] }
     */
    visitReferenciaVariable(node) {
        const nombreVariable = node.id;
        return this.entornoActual.get(nombreVariable);
    }
    
    /**
     * @type { BaseVisitor['visitPrint'] }
     */
    visitPrint(node) {
        const valor = node.exp.accept(this);
        this.salida += valor + '\n';
    }
    
    /**
     * @type { BaseVisitor['visitExpresionStatement'] }
     */
    visitExpresionStatement(node) {
        return node.exp.accept(this);
    }

    /**
     * @type { BaseVisitor['visitAsignacion'] }
     */
    visitAsignacion(node) {
        const valor = node.asgn.accept(this);
        this.entornoActual.assign(node.id, valor);

        return valor;
    }

    /**
     * @type { BaseVisitor['visitBloque'] }
     */
    visitBloque(node) {
        const entornoAnterior = this.entornoActual;
        this.entornoActual = new Entorno(entornoAnterior);

        node.dcls.forEach(dcl => dcl.accept(this));

        this.entornoActual = entornoAnterior;
    }

    /**
     * @type { BaseVisitor['visitIf']}
     */
    visitIf(node) {
        const condicion = node.cond.accept(this);

        if (condicion) {
            node.stmtTrue.accept(this);
            return;
        }
        
        if (node.stmtFalse) {
            node.stmtFalse.accept(this);
        }
    }

    /**
     * @type { BaseVisitor['visitWhile'] }
     */
    visitWhile(node) {
        const entornoInicial = this.entornoActual;

        try {
            while(node.cond.accept(this)) {
                node.stmt.accept(this);
            }
        } catch (e) {
            this.entornoActual = entornoInicial;

            if (e instanceof BreakException) {
                console.log('Break');
                return;
            }

            if (e instanceof ContinueException) {
                return this.visitWhile(node);
            }

            throw error;
        }
    }

    /**
     * @type { BaseVisitor['visitFor'] }
     */
    visitFor(node) {
        const incrementoAnterior = this.prevContinue;
        this.prevContinue = node.inc;

        const traducedFor = new nodos.Bloque (
            {
                dcls: [
                    node.init,
                    new nodos.While(
                        {
                            cond: node.cond,
                            stmt: new nodos.Bloque(
                                {
                                    dcls: [
                                        node.stmt,
                                        node.inc
                                    ]
                                }
                            )
                        }
                    )
                ]
            }
        );

        traducedFor.accept(this);

        this.prevContinue = incrementoAnterior;
    }

    /**
     * @type { BaseVisitor['visitBreak'] }
     */
    visitBreak(node) {
        throw new BreakException();
    }

    /**
     * @type { BaseVisitor['visitContinue'] }
     */
    visitContinue(node) {
        if (this.prevContinue) {
            this.prevContinue.accept(this);
        }

        throw new ContinueException();
    }

    /**
     * @type { BaseVisitor['visitReturn'] }
     */
    visitReturn(node) {
        let valor = null;
        if (node.exp) {
            valor = node.exp.accept(this);
        }
        throw new ReturnException(valor);
    }

    /**
     * @type { BaseVisitor['visitLlamada'] }
     */
    visitLlamada(node) {
        const funcion = node.callee.accept(this);

        const argumentos = node.args.map(arg => arg.accept(this));

        if (!(funcion instanceof Invocable)) {
            throw new Error('No es invocable');
        }

        if (funcion.aridad() !== argumentos.length) {
            throw new Error('Aridad incorrecta');
        }

        return funcion.invocar(this, argumentos);
    }

    /**
     * @type { BaseVisitor['visitDeclaracionFuncion'] }
     */
    visitDeclaracionFuncion(node) {
        const funcion = new FuncionForanea(node, this.entornoActual);
        this.entornoActual.set(node.id, funcion);
    }
}