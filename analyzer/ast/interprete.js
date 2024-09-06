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
        /**
         * @type { BaseVisitor['visitExpresion'] }
         */
        const izq = node.izq.accept(this);

        /**
         * @type { BaseVisitor['visitExpresion'] }
         */
        const der = node.der.accept(this);
        
        switch (node.op) {
            case '+':
                switch (izq.tipo) {
                    case 'int':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor + der.valor, tipo: 'int' };
                            case 'float':
                                return { valor: izq.valor + der.valor, tipo: 'float' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede sumar con un tipo ${der.tipo}`);
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor + der.valor, tipo: 'float' };
                            case 'float':
                                return { valor: izq.valor + der.valor, tipo: 'float' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede sumar con un tipo ${der.tipo}`);
                        }
                    case 'string':
                        switch (der.tipo) {
                            case 'string':
                                return { valor: izq.valor + der.valor, tipo: 'string' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede sumar con un tipo ${der.tipo}`);
                        }
                    default:
                        throw new Error(`No se pueden sumar los tipos ${izq.tipo} y ${der.tipo}`);
                }
            case '-':
                switch (izq.tipo) {
                    case 'int':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor - der.valor, tipo: 'int' };
                            case 'float':
                                return { valor: izq.valor - der.valor, tipo: 'float' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede restar con un tipo ${der.tipo}`);
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor - der.valor, tipo: 'float' };
                            case 'float':
                                return { valor: izq.valor - der.valor, tipo: 'float' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede restar con un tipo ${der.tipo}`);
                        }
                    default:
                        throw new Error(`No se pueden restar los tipos ${izq.tipo} y ${der.tipo}`);
                }
            case '*':
                switch (izq.tipo) {
                    case 'int':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor * der.valor, tipo: 'int' };
                            case 'float':
                                return { valor: izq.valor * der.valor, tipo: 'float' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede multiplicar con un tipo ${der.tipo}`);
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor * der.valor, tipo: 'float' };
                            case 'float':
                                return { valor: izq.valor * der.valor, tipo: 'float' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede multiplicar con un tipo ${der.tipo}`);
                        }
                    default:
                        throw new Error(`No se pueden multiplicar los tipos ${izq.tipo} y ${der.tipo}`);
                }
            case '/':

                if (der.valor === 0) {
                    throw new Error('No se puede dividir por cero');
                }

                switch (izq.tipo) {
                    case 'int':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: Math.floor(izq.valor / der.valor), tipo: 'int' };
                            case 'float':
                                return { valor: izq.valor / der.valor, tipo: 'float' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede dividir con un tipo ${der.tipo}`);
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor / der.valor, tipo: 'float' };
                            case 'float':
                                return { valor: izq.valor / der.valor, tipo: 'float' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede dividir con un tipo ${der.tipo}`);
                        }
                    default:
                        throw new Error(`No se pueden dividir los tipos ${izq.tipo} y ${der.tipo}`);
                }
            case '%':
                switch (izq.tipo) {
                    case 'int':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor % der.valor, tipo: 'int' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede dividir con un tipo ${der.tipo} para obtener su módulo`);
                        }
                    default:
                        throw new Error(`No se puede obtener el módulo de los tipos ${izq.tipo} y ${der.tipo}`);
                }
            case '==':
                switch (izq.tipo) {
                    case 'int':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor === der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor === der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor === der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor === der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'boolean':
                        switch (der.tipo) {
                            case 'boolean':
                                return { valor: izq.valor === der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'string':
                        switch (der.tipo) {
                            case 'string':
                                return { valor: izq.valor === der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'char':
                        switch (der.tipo) {
                            case 'char':
                                return { valor: izq.valor === der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    default:
                        throw new Error(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`);
                }
            case '!=':
                switch (izq.tipo) {
                    case 'int':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor !== der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor !== der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor !== der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor !== der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'boolean':
                        switch (der.tipo) {
                            case 'boolean':
                                return { valor: izq.valor !== der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'string':
                        switch (der.tipo) {
                            case 'string':
                                return { valor: izq.valor !== der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'char':
                        switch (der.tipo) {
                            case 'char':
                                return { valor: izq.valor !== der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    default:
                        throw new Error(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`);
                }
            case '>':
                switch (izq.tipo) {
                    case 'int':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor > der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor > der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor > der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor > der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'char':
                        switch (der.tipo) {
                            case 'char':
                                return { valor: izq.valor.charCodeAt(0) > der.valor.charCodeAt(0), tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    default:
                        throw new Error(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`);
                }
            case '>=':
                switch (izq.tipo) {
                    case 'int':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor >= der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor >= der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor >= der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor >= der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'char':
                        switch (der.tipo) {
                            case 'char':
                                return { valor: izq.valor.charCodeAt(0) >= der.valor.charCodeAt(0), tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    default:
                        throw new Error(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`);
                }
            case '<':
                switch (izq.tipo) {
                    case 'int':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor < der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor < der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor < der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor < der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'char':
                        switch (der.tipo) {
                            case 'char':
                                return { valor: izq.valor.charCodeAt(0) < der.valor.charCodeAt(0), tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    default:
                        throw new Error(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`);
                }
            case '<=':
                switch (izq.tipo) {
                    case 'int':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor <= der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor <= der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor <= der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor <= der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    case 'char':
                        switch (der.tipo) {
                            case 'char':
                                return { valor: izq.valor.charCodeAt(0) <= der.valor.charCodeAt(0), tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    default:
                        throw new Error(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`);
                }
            case '&&':
                switch (izq.tipo) {
                    case 'boolean':
                        switch (der.tipo) {
                            case 'boolean':
                                return { valor: izq.valor && der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    default:
                        throw new Error(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`);
                }
            case '||':
                switch (izq.tipo) {
                    case 'boolean':
                        switch (der.tipo) {
                            case 'boolean':
                                return { valor: izq.valor || der.valor, tipo: 'boolean' };
                            default:
                                throw new Error(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`);
                        }
                    default:
                        throw new Error(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`);
                }
            default:
                throw new Error('Operador no soportado');
        }
    }
    
    /**
     * @type { BaseVisitor['visitOperacionUnaria'] }
     */
    visitOperacionUnaria(node) {
        /**
         * @type { BaseVisitor['visitExpresion'] }
         */
        const exp = node.exp.accept(this);

        switch (node.op) {
            case '-':
                if (exp.tipo !== 'int' && exp.tipo !== 'float') {
                    throw new Error('No se puede negar un tipo no numérico');
                }
                return { valor: -exp.valor, tipo: exp.tipo };
            case '!':
                if (exp.tipo !== 'boolean') {
                    throw new Error('No se puede negar un tipo no booleano');
                }
                return { valor: !exp.valor, tipo: 'boolean' };
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
     * @type { BaseVisitor['visitPrimitivo'] }
     */
    visitPrimitivo(node) {
        return { valor: node.valor, tipo: node.tipo }
    }
    
    /**
     * @type { BaseVisitor['visitDeclaracionVariable'] }
     */
    visitDeclaracionVariable(node) {
        const tipoVariable = node.tipo;
        const nombreVariable = node.id;
        // const valorVariable = node.exp.accept(this);
        /**
         * @type { BaseVisitor['visitPrimitivo'] }
         */
        const valorVariable = node.exp ? node.exp.accept(this) : null;

        // En caso de que sea la regla
        // tipo:("int" / "float" / "string" / "boolean" / "char" / "var") _ id:Identificador _ ";" { return crearNodo('DeclaracionVariable', { tipo, id }) }
        if (valorVariable === null) {
            switch (tipoVariable) {
                case 'int':
                    valorVariable = 0;
                    break;
                case 'float':
                    valorVariable = 0.0;
                    break;
                case 'string':
                    valorVariable = '';
                    break;
                case 'boolean':
                    valorVariable = true;
                    break;
                case 'char':
                    valorVariable = '';
                    break;
                case 'var':
                    throw new Error('No se puede declarar una variable de tipo var sin valor');
                default:
                    throw new Error('Tipo de dato no soportado');
            }
        } else {

        // En caso de que sea la regla
        // tipo:("int" / "float" / "string" / "boolean" / "char" / "var") _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('DeclaracionVariable', { tipo, id, exp }) }

            // Verificar si el tipo de dato de la asignación y del dato primitivo son iguales
            if (valorVariable.tipo !== tipoVariable) {
                throw new Error('Tipo de dato incorrecto en la asignación');
            }
        }

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
        /**
         * @type { BaseVisitor['visitExpresion'] }
         */
        const valor = node.exp.accept(this);

        if (valor.tipo === 'float') {
            this.salida += valor.valor.toFixed(4) + '\n';
            return;
        }

        this.salida += valor.valor + '\n';
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
        /**
         * @type { BaseVisitor['visitExpresion'] }
         */
        const condicion = node.cond.accept(this);

        if (condicion.tipo !== 'boolean') {
            throw new Error('La condición no es booleana');
        }

        if (condicion.valor === true) {
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