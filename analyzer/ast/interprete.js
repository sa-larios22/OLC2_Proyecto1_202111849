import { embededFunctions } from '../instructions/embededFunctions.js';
import { FuncionForanea } from '../instructions/foranea.js';
import { Invocable } from '../instructions/invocable.js';
import { BreakException, ContinueException, ReturnException } from '../instructions/transferSentences.js';
import { Entorno } from './entorno.js';
import nodos, { Expresion, Primitivo, ReferenciaVariable } from './nodos.js';
import { BaseVisitor } from './visitor.js';
import { Error_ } from '../errors/error_.js';
import { Clase } from '../instructions/clase.js';
import { Instancia } from '../instructions/instancia.js';

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
                                throw new Error_(`Un tipo ${izq.tipo} no se puede sumar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor + der.valor, tipo: 'float' };
                            case 'float':
                                return { valor: izq.valor + der.valor, tipo: 'float' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede sumar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'string':
                        switch (der.tipo) {
                            case 'string':
                                return { valor: izq.valor + der.valor, tipo: 'string' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede sumar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    default:
                        throw new Error_(`No se pueden sumar los tipos ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
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
                                throw new Error_(`Un tipo ${izq.tipo} no se puede restar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor - der.valor, tipo: 'float' };
                            case 'float':
                                return { valor: izq.valor - der.valor, tipo: 'float' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede restar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    default:
                        throw new Error_(`No se pueden restar los tipos ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
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
                                throw new Error_(`Un tipo ${izq.tipo} no se puede multiplicar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor * der.valor, tipo: 'float' };
                            case 'float':
                                return { valor: izq.valor * der.valor, tipo: 'float' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede multiplicar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    default:
                        throw new Error_(`No se pueden multiplicar los tipos ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                }
            case '/':

                if (der.valor === 0) {
                    throw new Error_('No se puede dividir por cero', node.der.location.start.line, node.der.location.start.column, 'Semantico');
                }

                switch (izq.tipo) {
                    case 'int':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: Math.floor(izq.valor / der.valor), tipo: 'int' };
                            case 'float':
                                return { valor: izq.valor / der.valor, tipo: 'float' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede dividir con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor / der.valor, tipo: 'float' };
                            case 'float':
                                return { valor: izq.valor / der.valor, tipo: 'float' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede dividir con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    default:
                        throw new Error_(`No se pueden dividir los tipos ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                }
            case '%':
                switch (izq.tipo) {
                    case 'int':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor % der.valor, tipo: 'int' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede dividir con un tipo ${der.tipo} para obtener su módulo`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    default:
                        throw new Error_(`No se puede obtener el módulo de los tipos ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
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
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor === der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor === der.valor, tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'boolean':
                        switch (der.tipo) {
                            case 'boolean':
                                return { valor: izq.valor === der.valor, tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'string':
                        switch (der.tipo) {
                            case 'string':
                                return { valor: izq.valor === der.valor, tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'char':
                        switch (der.tipo) {
                            case 'char':
                                return { valor: izq.valor === der.valor, tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    default:
                        throw new Error_(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
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
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor !== der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor !== der.valor, tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'boolean':
                        switch (der.tipo) {
                            case 'boolean':
                                return { valor: izq.valor !== der.valor, tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'string':
                        switch (der.tipo) {
                            case 'string':
                                return { valor: izq.valor !== der.valor, tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'char':
                        switch (der.tipo) {
                            case 'char':
                                return { valor: izq.valor !== der.valor, tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    default:
                        throw new Error_(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
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
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor > der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor > der.valor, tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'char':
                        switch (der.tipo) {
                            case 'char':
                                return { valor: izq.valor.charCodeAt(0) > der.valor.charCodeAt(0), tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    default:
                        throw new Error_(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
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
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor >= der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor >= der.valor, tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'char':
                        switch (der.tipo) {
                            case 'char':
                                return { valor: izq.valor.charCodeAt(0) >= der.valor.charCodeAt(0), tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    default:
                        throw new Error_(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
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
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor < der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor < der.valor, tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'char':
                        switch (der.tipo) {
                            case 'char':
                                return { valor: izq.valor.charCodeAt(0) < der.valor.charCodeAt(0), tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    default:
                        throw new Error_(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
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
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'float':
                        switch (der.tipo) {
                            case 'int':
                                return { valor: izq.valor <= der.valor, tipo: 'boolean' };
                            case 'float':
                                return { valor: izq.valor <= der.valor, tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    case 'char':
                        switch (der.tipo) {
                            case 'char':
                                return { valor: izq.valor.charCodeAt(0) <= der.valor.charCodeAt(0), tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    default:
                        throw new Error_(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                }
            case '&&':
                switch (izq.tipo) {
                    case 'boolean':
                        switch (der.tipo) {
                            case 'boolean':
                                return { valor: izq.valor && der.valor, tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    default:
                        throw new Error_(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                }
            case '||':
                switch (izq.tipo) {
                    case 'boolean':
                        switch (der.tipo) {
                            case 'boolean':
                                return { valor: izq.valor || der.valor, tipo: 'boolean' };
                            default:
                                throw new Error_(`Un tipo ${izq.tipo} no se puede comparar con un tipo ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                        }
                    default:
                        throw new Error_(`No se pueden comparar los tipos ${izq.tipo} y ${der.tipo}`, node.location.start.line, node.location.start.column, 'Semantico');
                }
            default:
                throw new Error_('Operador no soportado', node.location.start.line , node.location.start.column, 'Semantico');
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
                    throw new Error_('No se puede negar un tipo no numérico', node.location.start.line, node.location.start.column, 'Semantico');
                }
                return { valor: -exp.valor, tipo: exp.tipo };
            case '!':
                if (exp.tipo !== 'boolean') {
                    throw new Error_('No se puede negar un tipo no booleano', node.location.start.line, node.location.start.column, 'Semantico');
                }
                return { valor: !exp.valor, tipo: 'boolean' };
            default:
                throw new Error_('Operador no soportado', node.location.start.line , node.location.start.column, 'Semantico');
        }
    }
    
    /**
     * @type { BaseVisitor['visitParentesis'] }
     */
    visitParentesis(node) {
        return node.exp.accept(this);
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
        /**
         * @type { BaseVisitor['visitPrimitivo'] }
         */
        const valorVariable = node.exp ? node.exp.accept(this) : undefined;

        // En caso de que sea la regla
        // tipo:("int" / "float" / "string" / "boolean" / "char" / "var") _ id:Identificador _ ";" { return crearNodo('DeclaracionVariable', { tipo, id }) }
        if (valorVariable === undefined) {
            switch (tipoVariable) {
                case 'int':
                    node.exp = { valor: 0, tipo: 'int' };
                    break;
                case 'float':
                    node.exp = { valor: 0.0, tipo: 'float' };
                    break;
                case 'string':
                    node.exp = { valor: '', tipo: 'string' };
                    break;
                case 'boolean':
                    node.exp = { valor: true, tipo: 'boolean' };
                    break;
                case 'char':
                    node.exp = { valor: '', tipo: 'char' };
                    break;
                case 'var':
                    node.exp = { valor: null, tipo: 'null' };
                    break;
                default:
                    throw new Error_('Tipo de dato no soportado', node.location.start.line, node.location.start.column, 'Semantico');
            }
        } else {

        // En caso de que sea la regla
        // tipo:("int" / "float" / "string" / "boolean" / "char" / "var") _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('DeclaracionVariable', { tipo, id, exp }) }

            // Verificar si el tipo de dato de la asignación y del dato primitivo son iguales
            if ((valorVariable.tipo !== tipoVariable) && (tipoVariable !== 'var')) {
                this.entornoActual.set(nombreVariable, { valor: null, tipo: 'error' });
                throw new Error_(`Tipo de dato incorrecto en la asignación: ${valorVariable.valor} no es de tipo ${tipoVariable}`, node.location.start.line, node.exp.location.start.column, 'Semantico');
            }

            this.entornoActual.set(nombreVariable, valorVariable);
            return;
        }

        this.entornoActual.set(nombreVariable, node.exp);
    }

    /**
     * @type { BaseVisitor['visitDeclaracionArray'] }
     */
    visitDeclaracionArray(node) {
        const tipoArreglo = node.tipo;
        const id = node.id;
        const exp = node.exp;

        // Declaración reservando una cantidad de elementos
        if (!(exp instanceof Array) && (exp instanceof Primitivo) && (exp !== null || exp !== undefined)) {
            const longitud = exp.accept(this);
            const arreglo = [];
            for (let i = 0; i < longitud.valor; i++) {
                switch (tipoArreglo.slice(0, -2)) {
                    case 'int':
                        arreglo.push({ valor: 0, tipo: 'int' });
                        break;
                    case 'float':
                        arreglo.push({ valor: 0.0, tipo: 'float' });
                        break;
                    case 'string':
                        arreglo.push({ valor: '', tipo: 'string' });
                        break;
                    case 'boolean':
                        arreglo.push({ valor: true, tipo: 'boolean' });
                        break;
                    case 'char':
                        arreglo.push({ valor: '\u0000', tipo: 'char' });
                        break;
                    default:
                        throw new Error_('Tipo de dato no soportado', node.location.start.line, node.location.start.column, 'Semantico');
                }
            }
            this.entornoActual.set(id, { valor: arreglo, tipo: tipoArreglo });
            return;
        }

        // Declaración cuando se asigna una referencia a un arreglo ya existente
        if (exp instanceof ReferenciaVariable) {
            
            /**
             * @type { BaseVisitor['visitReferenciaVariable'] }
             */
            const referencia = exp.accept(this);

            this.entornoActual.set(id, referencia);
        
            return;
        }

        exp.forEach(e => {
            if (e.tipo !== tipoArreglo.slice(0, -2)) {
                throw new Error_(`Tipo de dato incorrecto en la asignación: el elemento ${e.valor} no es de tipo ${tipoArreglo.slice(0, -2)}`, node.location.start.line, e.location.start.column, 'Semantico');
            }
        })

        // Declaración con inicialización de valores
        const arregloValores = exp.map(e => e.accept(this));

        this.entornoActual.set(id, { valor: arregloValores, tipo: tipoArreglo });

    }

    /**
     * @type { BaseVisitor['visitReferenciaVariable'] }
     */
    visitReferenciaVariable(node) {
        const nombreVariable = node.id;
        return this.entornoActual.get(nombreVariable);
    }

    /**
     * @type { BaseVisitor['visitReferenciaArray'] }
     */
    visitReferenciaArray(node) {
        const id = node.id;
        /**
         * @type { BaseVisitor['visitPrimitivo']}
         */
        const index = node.num.accept(this);

        const arreglo = this.entornoActual.get(id);

        if (index.tipo !== 'int') {
            throw new Error_('El índice debe ser de tipo entero', node.location.start.line, node.num.location.start.column, 'Semantico');
        }
        
        if (index.valor < 0 || index.valor >= arreglo.valor.length) {
            throw new Error_(`Índice ${index.valor} fuera de rango, el arreglo '${node.id}' tiene únicamente ${arreglo.valor.length} elementos   `, node.location.start.line, node.num.location.start.column, 'Semantico');
        }

        // console.log(arreglo.valor[index.valor]);
        if (!(arreglo instanceof Array)) {
            return arreglo.valor[index.valor];
        } else {
            return arreglo[index.valor];
        }
    }
    
    /**
     * @type { BaseVisitor['visitFuncArray'] }
     */
    visitFuncArray(node) {
        const arreglo = node.arr.accept(this);
        const tipo = node.tipo;

        if (tipo === 'indexOf') {
            const index = node.index.accept(this);
            for (let i = 0; i < arreglo.valor.length; i++) {
                if (arreglo.valor[i].valor === index.valor) {
                    return { valor: i, tipo: 'int' };
                }
            }
            return { valor: -1, tipo: 'int' };  
        }

        if (tipo === 'length') {
            return { valor: arreglo.valor.length, tipo: 'int' };
        }

        if (tipo === 'join') {
            const arregloJoin = arreglo.valor.map((v) => {
                return v.valor;
            });
            return { valor: arregloJoin.toString(), tipo: 'string' };
        }
    }

    /**
     * @type { BaseVisitor['visitPrint'] }
     */
    visitPrint(node) {
        node.expList.forEach(exp => {
            /**
             * @type { BaseVisitor['visitExpresion'] }
             */
            const valor = exp.accept(this);

            if (valor === undefined) {
                return;
            }

            if (valor.tipo === 'float') {
                this.salida += valor.valor.toFixed(4) + '\n';
                return;
            }

            if (valor.valor instanceof Array) {
                const arrayPrint = []
                valor.valor.forEach((v) => {
                    arrayPrint.push(v.valor)
                })
                this.salida += arrayPrint + '\n';
                return;
            }

            this.salida += valor.valor;
        });

        this.salida += '\n';
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

        // En caso que num sea un número, se trata de una asignación a un elemento de un arreglo
        if (node.index !== undefined) {
            const index = node.index.accept(this);
            const arreglo = this.entornoActual.get(node.id);

            const nuevoArreglo = arreglo.valor.map((v, i) => {

                if (v.tipo !== valor.tipo) {
                    throw new Error_(`Tipo de dato incorrecto en la asignación: el elemento ${v.valor} no es de tipo ${valor.tipo}`, node.location.start.line, node.asgn.location.start.column, 'Semantico');
                }
                
                if (i === index.valor) {
                    return valor;
                }

                return v;
            });
            
            this.entornoActual.assign(node.id, nuevoArreglo);
            return valor;
        }

        const valorActual = this.entornoActual.get(node.id);
        if (valorActual.tipo !== valor.tipo) {
            this.entornoActual.assign(node.id, { valor: null, tipo: 'error' } );

            throw new Error_(`Tipo de dato incorrecto en la asignación: ${valor.valor} no es de tipo ${valorActual.tipo}`, node.location.start.line, node.asgn.location.start.column, 'Semantico');
        }

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
            throw new Error_('La condición no es booleana', node.location.start.line, node.cond.location.start.column, 'Semantico');
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
     * @type { BaseVisitor['visitSwitch']}
     */
    visitSwitch(node) {
        /**
         * @type { BaseVisitor['visitExpresion'] }
         */
        const expresion = node.exp.accept(this);

        let casoEjecutado = false;

        for (const caso of node.caseList) {
            /**
             * @type { BaseVisitor['visitCase'] }
             */
            const valorCase = caso.cond.accept(this);

            if (expresion.tipo !== valorCase.tipo) {
                throw new Error_('Los tipos de la expresión y el case no coinciden', node.exp.location.start.line, node.exp.location.start.column, 'Semantico');
            }

            if (expresion.valor === valorCase.valor) {
                console.log("AAAA")
                try {
                    caso.dcls.forEach(dcl => dcl.accept(this));
                    casoEjecutado = true;
                    break;
                } catch (error) {
                    if (error instanceof BreakException) {
                        casoEjecutado = true;
                        break;
                    }
                    throw error;
                }
            }
        }

        if (!casoEjecutado && node.defaultCase) {
            node.defaultCase.dcls.forEach(dcl => dcl.accept(this));
        }
    }

    /**
     * @type { BaseVisitor['visitCase']}
     */
    visitCase(node) {
        /**
         * @type { BaseVisitor['visitExpresion'] }
         */
        const condicionCase = node.cond.accept(this);

        if (condicionCase.tipo !== 'boolean') {
            throw new Error_('La condición no es booleana', node.cond.location.start.line, node.cond.location.start.column, 'Semantico');
        }

        if (condicionCase.valor === true) {
            node.stmt.accept(this);
            return;
        }
    }

    /**
     * @type { BaseVisitor['visitDefaultCase']}
     */
    visitDefaultCase(node) {
        node.dcls.map(dcl => dcl.accept(this));
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
            throw new Error_('No es invocable', node.callee.location.start.line, node.callee.location.start.column, 'Semantico');
        }

        if (funcion.aridad() !== argumentos.length) {
            throw new Error_('Aridad incorrecta', node.args[0].location.start.line, node.args[0].location.start.column, 'Semantico');
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

    /**
     * @type { BaseVisitor['visitDeclaracionClase'] }
     */
    visitDeclaracionClase(node) {
        const metodos = {};
        const propiedades = {};

        node.dcls.forEach(dcl => {
            if (dcl instanceof nodos.DeclaracionFuncion) {
                metodos[dcl.id] = new FuncionForanea(dcl, this.entornoActual);
            } else if (dcl instanceof nodos.DeclaracionVariable) {
                propiedades[dcl.id] = dcl.exp;
            }
        });

        const clase = new Clase(node.id, propiedades, metodos);

        this.entornoActual.set(node.id, clase);
    }

    /**
     * @type { BaseVisitor['visitInstancia'] }
     */
    visitInstancia(node) {
        const clase = this.entornoActual.get(node.id);

        if (!(clase instanceof Clase)) {
            throw new Error_('No es una clase', node.location.start.line, node.location.start.column, 'Semantico');
        }

        return clase.invocar(this, node.args);
    }

    /**
     * @type { BaseVisitor['visitGet'] }
     */
    visitGet(node) {
        /**
         * @type { Instancia}
         */
        const instancia = node.objetivo.accept(this);

        if (!(instancia instanceof Instancia)) {
            throw new Error_('No es una instancia', node.location.start.line, node.location.start.column, 'Semantico');
        }

        return instancia.get(node.propiedad);
    }
}