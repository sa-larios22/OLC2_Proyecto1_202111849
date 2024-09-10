
/**

 * @typedef {import('./nodos').Expresion} Expresion


 * @typedef {import('./nodos').OperacionBinaria} OperacionBinaria


 * @typedef {import('./nodos').OperacionUnaria} OperacionUnaria


 * @typedef {import('./nodos').Parentesis} Parentesis


 * @typedef {import('./nodos').Primitivo} Primitivo


 * @typedef {import('./nodos').DeclaracionVariable} DeclaracionVariable


 * @typedef {import('./nodos').DeclaracionArray} DeclaracionArray


 * @typedef {import('./nodos').ReferenciaVariable} ReferenciaVariable


 * @typedef {import('./nodos').ReferenciaArray} ReferenciaArray


 * @typedef {import('./nodos').Print} Print


 * @typedef {import('./nodos').ExpresionStatement} ExpresionStatement


 * @typedef {import('./nodos').Asignacion} Asignacion


 * @typedef {import('./nodos').Bloque} Bloque


 * @typedef {import('./nodos').If} If


 * @typedef {import('./nodos').Switch} Switch


 * @typedef {import('./nodos').Case} Case


 * @typedef {import('./nodos').DefaultCase} DefaultCase


 * @typedef {import('./nodos').While} While


 * @typedef {import('./nodos').For} For


 * @typedef {import('./nodos').Break} Break


 * @typedef {import('./nodos').Continue} Continue


 * @typedef {import('./nodos').Return} Return


 * @typedef {import('./nodos').Llamada} Llamada


 * @typedef {import('./nodos').DeclaracionFuncion} DeclaracionFuncion


 * @typedef {import('./nodos').DeclaracionClase} DeclaracionClase


 * @typedef {import('./nodos').Instancia} Instancia


 * @typedef {import('./nodos').Get} Get

 */


/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    
    /**
     * @param {Expresion} node
     * @returns {any}
     */
    visitExpresion(node) {
        throw new Error('Metodo visitExpresion no implementado');
    }
    

    /**
     * @param {OperacionBinaria} node
     * @returns {any}
     */
    visitOperacionBinaria(node) {
        throw new Error('Metodo visitOperacionBinaria no implementado');
    }
    

    /**
     * @param {OperacionUnaria} node
     * @returns {any}
     */
    visitOperacionUnaria(node) {
        throw new Error('Metodo visitOperacionUnaria no implementado');
    }
    

    /**
     * @param {Parentesis} node
     * @returns {any}
     */
    visitParentesis(node) {
        throw new Error('Metodo visitParentesis no implementado');
    }
    

    /**
     * @param {Primitivo} node
     * @returns {any}
     */
    visitPrimitivo(node) {
        throw new Error('Metodo visitPrimitivo no implementado');
    }
    

    /**
     * @param {DeclaracionVariable} node
     * @returns {any}
     */
    visitDeclaracionVariable(node) {
        throw new Error('Metodo visitDeclaracionVariable no implementado');
    }
    

    /**
     * @param {DeclaracionArray} node
     * @returns {any}
     */
    visitDeclaracionArray(node) {
        throw new Error('Metodo visitDeclaracionArray no implementado');
    }
    

    /**
     * @param {ReferenciaVariable} node
     * @returns {any}
     */
    visitReferenciaVariable(node) {
        throw new Error('Metodo visitReferenciaVariable no implementado');
    }
    

    /**
     * @param {ReferenciaArray} node
     * @returns {any}
     */
    visitReferenciaArray(node) {
        throw new Error('Metodo visitReferenciaArray no implementado');
    }
    

    /**
     * @param {Print} node
     * @returns {any}
     */
    visitPrint(node) {
        throw new Error('Metodo visitPrint no implementado');
    }
    

    /**
     * @param {ExpresionStatement} node
     * @returns {any}
     */
    visitExpresionStatement(node) {
        throw new Error('Metodo visitExpresionStatement no implementado');
    }
    

    /**
     * @param {Asignacion} node
     * @returns {any}
     */
    visitAsignacion(node) {
        throw new Error('Metodo visitAsignacion no implementado');
    }
    

    /**
     * @param {Bloque} node
     * @returns {any}
     */
    visitBloque(node) {
        throw new Error('Metodo visitBloque no implementado');
    }
    

    /**
     * @param {If} node
     * @returns {any}
     */
    visitIf(node) {
        throw new Error('Metodo visitIf no implementado');
    }
    

    /**
     * @param {Switch} node
     * @returns {any}
     */
    visitSwitch(node) {
        throw new Error('Metodo visitSwitch no implementado');
    }
    

    /**
     * @param {Case} node
     * @returns {any}
     */
    visitCase(node) {
        throw new Error('Metodo visitCase no implementado');
    }
    

    /**
     * @param {DefaultCase} node
     * @returns {any}
     */
    visitDefaultCase(node) {
        throw new Error('Metodo visitDefaultCase no implementado');
    }
    

    /**
     * @param {While} node
     * @returns {any}
     */
    visitWhile(node) {
        throw new Error('Metodo visitWhile no implementado');
    }
    

    /**
     * @param {For} node
     * @returns {any}
     */
    visitFor(node) {
        throw new Error('Metodo visitFor no implementado');
    }
    

    /**
     * @param {Break} node
     * @returns {any}
     */
    visitBreak(node) {
        throw new Error('Metodo visitBreak no implementado');
    }
    

    /**
     * @param {Continue} node
     * @returns {any}
     */
    visitContinue(node) {
        throw new Error('Metodo visitContinue no implementado');
    }
    

    /**
     * @param {Return} node
     * @returns {any}
     */
    visitReturn(node) {
        throw new Error('Metodo visitReturn no implementado');
    }
    

    /**
     * @param {Llamada} node
     * @returns {any}
     */
    visitLlamada(node) {
        throw new Error('Metodo visitLlamada no implementado');
    }
    

    /**
     * @param {DeclaracionFuncion} node
     * @returns {any}
     */
    visitDeclaracionFuncion(node) {
        throw new Error('Metodo visitDeclaracionFuncion no implementado');
    }
    

    /**
     * @param {DeclaracionClase} node
     * @returns {any}
     */
    visitDeclaracionClase(node) {
        throw new Error('Metodo visitDeclaracionClase no implementado');
    }
    

    /**
     * @param {Instancia} node
     * @returns {any}
     */
    visitInstancia(node) {
        throw new Error('Metodo visitInstancia no implementado');
    }
    

    /**
     * @param {Get} node
     * @returns {any}
     */
    visitGet(node) {
        throw new Error('Metodo visitGet no implementado');
    }
    
}
