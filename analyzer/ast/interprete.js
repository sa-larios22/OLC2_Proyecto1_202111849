import { Entorno } from './entorno.js';
import { BaseVisitor } from './visitor.js';

export class InterpreterVisitor extends BaseVisitor {

    constructor() {
        super();
        this.entornoActual = new Entorno();
        this.salida = '';
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

        this.entornoActual.setVariable(nombreVariable, valorVariable);
    }
    
    /**
     * @type { BaseVisitor['visitReferenciaVariable'] }
     */
    visitReferenciaVariable(node) {
        const nombreVariable = node.id;
        return this.entornoActual.getVariable(nombreVariable);
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
        this.entornoActual.asignarVariable(node.id, valor);

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
        while(node.cond.accept(this)) {
            node.stmt.accept(this);
        }
    }
}