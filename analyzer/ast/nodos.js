
/**
 * @typedef {Object} Location
 * @property {Object} start
 * @property {number} start.offset
 * @property {number} start.line
 * @property {number} start.column
 * @property {Object} end
 * @property {number} end.offset
 * @property {number} end.line
 * @property {number} end.column
*/
    

/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */

export class Expresion  {

    /**
    * @param {Object} options
    * @param {Location|null} options.location Ubicacion del nodo en el codigo fuente
    */
    constructor() {
        
        
        /**
         * Ubicacion del nodo en el codigo fuente
         * @type {Location|null}
        */
        this.location = null;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresion(this);
    }
}
    
export class OperacionBinaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.izq Expresion izquierda de la operacion
 * @param {Expresion} options.der Expresion derecha de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ izq, der, op }) {
        super();
        
        /**
         * Expresion izquierda de la operacion
         * @type {Expresion}
        */
        this.izq = izq;


        /**
         * Expresion derecha de la operacion
         * @type {Expresion}
        */
        this.der = der;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionBinaria(this);
    }
}
    
export class OperacionUnaria extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion de la operacion
 * @param {string} options.op Operador de la operacion
    */
    constructor({ exp, op }) {
        super();
        
        /**
         * Expresion de la operacion
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Operador de la operacion
         * @type {string}
        */
        this.op = op;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitOperacionUnaria(this);
    }
}
    
export class Parentesis extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion agrupada por paréntesis
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion agrupada por paréntesis
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitParentesis(this);
    }
}
    
export class Primitivo extends Expresion {

    /**
    * @param {Object} options
    * @param {number} options.valor Valor del número
 * @param {string} options.tipo Tipo del dato primitivo
    */
    constructor({ valor, tipo }) {
        super();
        
        /**
         * Valor del número
         * @type {number}
        */
        this.valor = valor;


        /**
         * Tipo del dato primitivo
         * @type {string}
        */
        this.tipo = tipo;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitPrimitivo(this);
    }
}
    
export class DeclaracionVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la variable
 * @param {string} options.id Identificador de la variable
 * @param {Expresion} options.exp Expresion de la variable
    */
    constructor({ tipo, id, exp }) {
        super();
        
        /**
         * Tipo de la variable
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion de la variable
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionVariable(this);
    }
}
    
export class DeclaracionArray extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la variable
 * @param {string} options.id Identificador de la variable
 * @param {Expresion|Expresion[]} options.exp Expresion de la variable
    */
    constructor({ tipo, id, exp }) {
        super();
        
        /**
         * Tipo de la variable
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Expresion de la variable
         * @type {Expresion|Expresion[]}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionArray(this);
    }
}
    
export class ReferenciaVariable extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
    */
    constructor({ id }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReferenciaVariable(this);
    }
}
    
export class ReferenciaArray extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador del arreglo
 * @param {Expresion} options.num Indice del arreglo
    */
    constructor({ id, num }) {
        super();
        
        /**
         * Identificador del arreglo
         * @type {string}
        */
        this.id = id;


        /**
         * Indice del arreglo
         * @type {Expresion}
        */
        this.num = num;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReferenciaArray(this);
    }
}
    
export class Print extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.expList Expresion a imprimir
    */
    constructor({ expList }) {
        super();
        
        /**
         * Expresion a imprimir
         * @type {Expresion[]}
        */
        this.expList = expList;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitPrint(this);
    }
}
    
export class ExpresionStatement extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a evaluar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a evaluar
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitExpresionStatement(this);
    }
}
    
export class Asignacion extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la variable
 * @param {Expresion|undefined} options.index Indice del arreglo
 * @param {Expresion} options.asgn Expresion a asignar
    */
    constructor({ id, index, asgn }) {
        super();
        
        /**
         * Identificador de la variable
         * @type {string}
        */
        this.id = id;


        /**
         * Indice del arreglo
         * @type {Expresion|undefined}
        */
        this.index = index;


        /**
         * Expresion a asignar
         * @type {Expresion}
        */
        this.asgn = asgn;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitAsignacion(this);
    }
}
    
export class Bloque extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.dcls Lista de expresiones
    */
    constructor({ dcls }) {
        super();
        
        /**
         * Lista de expresiones
         * @type {Expresion[]}
        */
        this.dcls = dcls;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBloque(this);
    }
}
    
export class If extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del if
 * @param {Expresion} options.stmtTrue Cuerpo del If
 * @param {Expresion|undefined} options.stmtFalse Cuerpo del Else
    */
    constructor({ cond, stmtTrue, stmtFalse }) {
        super();
        
        /**
         * Condicion del if
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Cuerpo del If
         * @type {Expresion}
        */
        this.stmtTrue = stmtTrue;


        /**
         * Cuerpo del Else
         * @type {Expresion|undefined}
        */
        this.stmtFalse = stmtFalse;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitIf(this);
    }
}
    
export class Switch extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.exp Expresion a evaluar
 * @param {Expresion[]} options.caseList Lista de cases
 * @param {Expresion|undefined} options.defaultCase Case por defecto
    */
    constructor({ exp, caseList, defaultCase }) {
        super();
        
        /**
         * Expresion a evaluar
         * @type {Expresion}
        */
        this.exp = exp;


        /**
         * Lista de cases
         * @type {Expresion[]}
        */
        this.caseList = caseList;


        /**
         * Case por defecto
         * @type {Expresion|undefined}
        */
        this.defaultCase = defaultCase;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitSwitch(this);
    }
}
    
export class Case extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del case
 * @param {Expresion[]} options.dcls Lista de expresiones
    */
    constructor({ cond, dcls }) {
        super();
        
        /**
         * Condicion del case
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Lista de expresiones
         * @type {Expresion[]}
        */
        this.dcls = dcls;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitCase(this);
    }
}
    
export class DefaultCase extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion[]} options.dcls Lista de expresiones
    */
    constructor({ dcls }) {
        super();
        
        /**
         * Lista de expresiones
         * @type {Expresion[]}
        */
        this.dcls = dcls;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDefaultCase(this);
    }
}
    
export class While extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.cond Condicion del while
 * @param {Expresion} options.stmt Cuerpo del while
    */
    constructor({ cond, stmt }) {
        super();
        
        /**
         * Condicion del while
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Cuerpo del while
         * @type {Expresion}
        */
        this.stmt = stmt;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitWhile(this);
    }
}
    
export class For extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.init Inicializacion de la variable del ciclo for
 * @param {Expresion} options.cond Condicion del for
 * @param {Expresion} options.inc Incremento del for
 * @param {Expresion} options.stmt Cuerpo del for
    */
    constructor({ init, cond, inc, stmt }) {
        super();
        
        /**
         * Inicializacion de la variable del ciclo for
         * @type {Expresion}
        */
        this.init = init;


        /**
         * Condicion del for
         * @type {Expresion}
        */
        this.cond = cond;


        /**
         * Incremento del for
         * @type {Expresion}
        */
        this.inc = inc;


        /**
         * Cuerpo del for
         * @type {Expresion}
        */
        this.stmt = stmt;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFor(this);
    }
}
    
export class Break extends Expresion {

    /**
    * @param {Object} options
    * 
    */
    constructor() {
        super();
        
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitBreak(this);
    }
}
    
export class Continue extends Expresion {

    /**
    * @param {Object} options
    * 
    */
    constructor() {
        super();
        
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitContinue(this);
    }
}
    
export class Return extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion|undefined} options.exp Expresion a retornar
    */
    constructor({ exp }) {
        super();
        
        /**
         * Expresion a retornar
         * @type {Expresion|undefined}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitReturn(this);
    }
}
    
export class Llamada extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.callee Expresion a llamar
 * @param {Expresion[]} options.args Argumentos de la llamada
    */
    constructor({ callee, args }) {
        super();
        
        /**
         * Expresion a llamar
         * @type {Expresion}
        */
        this.callee = callee;


        /**
         * Argumentos de la llamada
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitLlamada(this);
    }
}
    
export class DeclaracionFuncion extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la funcion
 * @param {string[]} options.params Parametros de la funcion
 * @param {Bloque} options.bloque Cuerpo de la funcion
    */
    constructor({ id, params, bloque }) {
        super();
        
        /**
         * Identificador de la funcion
         * @type {string}
        */
        this.id = id;


        /**
         * Parametros de la funcion
         * @type {string[]}
        */
        this.params = params;


        /**
         * Cuerpo de la funcion
         * @type {Bloque}
        */
        this.bloque = bloque;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionFuncion(this);
    }
}
    
export class DeclaracionStruct extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la estructura
 * @param {Expresion[]} options.atbs Atributos de la estructura
    */
    constructor({ id, atbs }) {
        super();
        
        /**
         * Identificador de la estructura
         * @type {string}
        */
        this.id = id;


        /**
         * Atributos de la estructura
         * @type {Expresion[]}
        */
        this.atbs = atbs;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionStruct(this);
    }
}
    
export class DeclaracionClase extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la clase
 * @param {Expresion[]} options.dcls Cuerpo de la clase
    */
    constructor({ id, dcls }) {
        super();
        
        /**
         * Identificador de la clase
         * @type {string}
        */
        this.id = id;


        /**
         * Cuerpo de la clase
         * @type {Expresion[]}
        */
        this.dcls = dcls;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitDeclaracionClase(this);
    }
}
    
export class Instancia extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.id Identificador de la clase
 * @param {Expresion[]} options.args Argumentos de la instancia
    */
    constructor({ id, args }) {
        super();
        
        /**
         * Identificador de la clase
         * @type {string}
        */
        this.id = id;


        /**
         * Argumentos de la instancia
         * @type {Expresion[]}
        */
        this.args = args;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitInstancia(this);
    }
}
    
export class Get extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.objetivo Objeto de la propiedad
 * @param {string} options.propiedad Identificador de la propiedad
    */
    constructor({ objetivo, propiedad }) {
        super();
        
        /**
         * Objeto de la propiedad
         * @type {Expresion}
        */
        this.objetivo = objetivo;


        /**
         * Identificador de la propiedad
         * @type {string}
        */
        this.propiedad = propiedad;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitGet(this);
    }
}
    
export class FuncArray extends Expresion {

    /**
    * @param {Object} options
    * @param {Expresion} options.arr Referencia al arreglo unidimensional
 * @param {string} options.tipo Tipo de la funcion
 * @param {Expresion|undefined} options.index Expresion del indice
    */
    constructor({ arr, tipo, index }) {
        super();
        
        /**
         * Referencia al arreglo unidimensional
         * @type {Expresion}
        */
        this.arr = arr;


        /**
         * Tipo de la funcion
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Expresion del indice
         * @type {Expresion|undefined}
        */
        this.index = index;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFuncArray(this);
    }
}
    
export class FuncionEmbedida extends Expresion {

    /**
    * @param {Object} options
    * @param {string} options.tipo Tipo de la funcion
 * @param {Expresion} options.exp Expresion de la funcion
    */
    constructor({ tipo, exp }) {
        super();
        
        /**
         * Tipo de la funcion
         * @type {string}
        */
        this.tipo = tipo;


        /**
         * Expresion de la funcion
         * @type {Expresion}
        */
        this.exp = exp;

    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visitFuncionEmbedida(this);
    }
}
    
export default { Expresion, OperacionBinaria, OperacionUnaria, Parentesis, Primitivo, DeclaracionVariable, DeclaracionArray, ReferenciaVariable, ReferenciaArray, Print, ExpresionStatement, Asignacion, Bloque, If, Switch, Case, DefaultCase, While, For, Break, Continue, Return, Llamada, DeclaracionFuncion, DeclaracionStruct, DeclaracionClase, Instancia, Get, FuncArray, FuncionEmbedida }
