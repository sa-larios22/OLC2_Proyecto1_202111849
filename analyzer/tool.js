/**
 * DISCLAIMER:
 * Este código fue desarrollado con fines puramente didácticos.
 * Su objetivo principal es demostrar la implementación del patrón de diseño Visitor 
 * utilizando peggy.js como generador de analizadores y agregando anotaciones JSDoc 
 * para mejorar la comprensión y la documentación del código.
 * 
 * La estructura y los conceptos presentados en este archivo tienen la intención de 
 * facilitar el aprendizaje y la enseñanza de patrones de diseño y documentación en 
 * JavaScript. No se recomienda su uso en entornos de producción.
 * 
 * @autor: @damianpeaf
 * 
 */

// import fs from 'fs';
const fs = require('fs')

const types = [
    `
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
    `
]

const configuracionNodos = [
    // Configuracion del nodo inicial
    {
        name: 'Expresion',
        base: true,
        props: [
            {
                name: 'location',
                type: 'Location|null',
                description: 'Ubicacion del nodo en el codigo fuente',
                default: 'null'
            }
        ]
    },
    // Configuracion de los nodos secundarios
    {
        name: 'OperacionBinaria',
        extends: 'Expresion',
        props: [
            {
                name: 'izq',
                type: 'Expresion',
                description: 'Expresion izquierda de la operacion'
            },
            {
                name: 'der',
                type: 'Expresion',
                description: 'Expresion derecha de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion'
            }
        ]
    },
    {
        name: 'OperacionUnaria',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion de la operacion'
            },
            {
                name: 'op',
                type: 'string',
                description: 'Operador de la operacion'
            }
        ]
    },
    {
        name: 'Parentesis',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion agrupada por paréntesis'
            }
        ]
    },
    {
        name: 'Primitivo',
        extends: 'Expresion',
        props: [
            {
                name: 'valor',
                type: 'number',
                description: 'Valor del número'
            },
            {
                name: 'tipo',
                type: 'string',
                description: 'Tipo del dato primitivo'
            }
        ]
    },
    // DeclaracionVariable
    // declaracionVariable = "var" _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('DeclaracionVariable', { id, exp }) }
    {
        name: 'DeclaracionVariable',
        extends: 'Expresion',
        props: [
            {
                name: 'tipo',
                type: 'string',
                description: 'Tipo de la variable'
            },
            {
                name: 'id',
                type: 'string',
                description: 'Identificador de la variable'
            },
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion de la variable'
            }
        ]
    },
    // DeclaracionArray
    // declaracionArray = tipo:("int[]" / "float[]" / "string[]" / "boolean[]" / "char[]") _ id:Identificador _ "=" _ "{" _ exp:arrayValores _ "}" _ ";" { return crearNodo('DeclaracionArray', { tipo, id, exp }) }
    //            / tipo:("int[]" / "float[]" / "string[]" / "boolean[]" / "char[]") _ id:Identificador _ "=" _ "new" _ tipoArray:("int" / "float" / "string" / "boolean" / "char") _ "[" _ exp:Expresion _ "]" _ ";" { return crearNodo('DeclaracionArray', { tipo, id, exp }) }
    //            / tipo:("int[]" / "float[]" / "string[]" / "boolean[]" / "char[]") _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('DeclaracionArray', { tipo, id, exp }) }
    {
        name: 'DeclaracionArray',
        extends: 'Expresion',
        props: [
            {
                name: 'tipo',
                type: 'string',
                description: 'Tipo de la variable'
            },
            {
                name: 'id',
                type: 'string',
                description: 'Identificador de la variable'
            },
            {
                name: 'exp',
                type: 'Expresion|Expresion[]',
                description: 'Expresion de la variable'
            }
        ]
    },
    // ReferenciaVariable
    // Numero = Identificador { return crearNodo('ReferenciaVariable', { id: text() }) }
    {
        name: 'ReferenciaVariable',
        extends: 'Expresion',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Identificador de la variable'
            }
        ]
    },
    // ReferenciaArray
    // Numero = id:Identificador _ "[" _ num:Numero _ "]" { return crearNodo('ReferenciaArray', { id, num } ); }
    {
        name: 'ReferenciaArray',
        extends: 'Expresion',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Identificador del arreglo'
            },
            {
                name: 'num',
                type: 'Expresion',
                description: 'Indice del arreglo'
            }
        ]
    },
    // Print
    // Stmt = "print(" _ exp:Expresion _ ")" _ ";" { return crearNodo('Print', { exp } ) }
    {
        name: 'Print',
        extends: 'Expresion',
        props: [
            {
                name: 'expList',
                type: 'Expresion[]',
                description: 'Expresion a imprimir'
            }
        ]
    },
    // ExpresionStatement
    // Stmt = exp:Expresion _ ";" { return crearNodo('ExpresionStatement', { exp } ) }
    {
        name: 'ExpresionStatement',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion a evaluar'
            }
        ]
    },
    // Asignacion
    // Asignacion = id:Identificador _ "=" _ asgn:Asignacion { return crearNodo('Asignacion', { id, asgn }) }
    {
        name: 'Asignacion',
        extends: 'Expresion',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Identificador de la variable'
            },
            {
                name: 'index',
                type: 'Expresion|undefined',
                description: 'Indice del arreglo'
            },
            {
                name: 'asgn',
                type: 'Expresion',
                description: 'Expresion a asignar'
            }
        ]
    },
    // Bloque
    // Stmt = "{" _ dcls:Declaraciones* _ "}" { return crearNodo('Bloque', { dcls }) }
    {
        name: 'Bloque',
        extends: 'Expresion',
        props: [
            {
                name: 'dcls',
                type: 'Expresion[]',
                description: 'Lista de expresiones'
            }
        ]
    },
    // If
    // Stmt = "if" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return crearNodo('If', { cond, stmt }) }
    {
        name: 'If',
        extends: 'Expresion',
        props: [
            {
                name: 'cond',
                type: 'Expresion',
                description: 'Condicion del if'
            },
            {
                name: 'stmtTrue',
                type: 'Expresion',
                description: 'Cuerpo del If'
            },
            {
                name: 'stmtFalse',
                type: 'Expresion|undefined',
                description: 'Cuerpo del Else'
            }
        ]
    },
    // Switch
    // "switch" _ "(" _ exp:Expresion _ ")" _ "{" _ caseList:CaseList _ defaultCase:DefaultCase? _ "}" {
    //       return crearNodo('Switch', { exp, caseList, defaultCase })
    //  }
    // CaseList = initialCase:Case otherCases:(_ Case)* { return [initialCase, ...otherCases] }
    {
        name: 'Switch',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion',
                description: 'Expresion a evaluar'
            },
            {
                name: 'caseList',
                type: 'Expresion[]',
                description: 'Lista de cases'
            },
            {
                name: 'defaultCase',
                type: 'Expresion|undefined',
                description: 'Case por defecto'
            }
        ]
    },
    // Case
    // Case = "case" _ cond:Expresion _ ":" _ dcls:Declaraciones* { return crearNodo('Case', { cond, dcls }) }
    {
        name: 'Case',
        extends: 'Expresion',
        props: [
            {
                name: 'cond',
                type: 'Expresion',
                description: 'Condicion del case'
            },
            {
                name: 'dcls',
                type: 'Expresion[]',
                description: 'Lista de expresiones'
            }
        ]
    },
    // DefaultCase
    // DefaultCase = "default" _ ":" _ dcls:Declaraciones* { return crearNodo('DefaultCase', { dcls }) }
    {
        name: 'DefaultCase',
        extends: 'Expresion',
        props: [
            {
                name: 'dcls',
                type: 'Expresion[]',
                description: 'Lista de expresiones'
            }
        ]
    },
    // While
    // Stmt = "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return crearNodo('While', { cond, stmt }) }
    {
        name: 'While',
        extends: 'Expresion',
        props: [
            {
                name: 'cond',
                type: 'Expresion',
                description: 'Condicion del while'
            },
            {
                name: 'stmt',
                type: 'Expresion',
                description: 'Cuerpo del while'
            }
        ]
    },
    // For
    // "for" _ "(" _ init:ForInit _ cond:Expresion _ ";" _ inc:Expresion _ ")" _ stmt:Stmt {
    //     return crearNodo('For', { init, cond, inc, stmt })
    // }
    {
        name: 'For',
        extends: 'Expresion',
        props: [
            {
                name: 'init',
                type: 'Expresion',
                description: 'Inicializacion de la variable del ciclo for'
            },
            {
                name: 'cond',
                type: 'Expresion',
                description: 'Condicion del for'
            },
            {
                name: 'inc',
                type: 'Expresion',
                description: 'Incremento del for'
            },
            {
                name: 'stmt',
                type: 'Expresion',
                description: 'Cuerpo del for'
            }
        ]
    },
    // Break
    // "break" _ ";" { return crearNodo('Break') }
    {
        name: 'Break',
        extends: 'Expresion',
        props: []
    },
    // Continue
    // "continue" _ ";" { return crearNodo('Continue') }
    {
        name: 'Continue',
        extends: 'Expresion',
        props: []
    },
    // Return
    // "return" _ exp:Expresion? _ ";" { return crearNodo('Return', { exp }) }
    {
        name: 'Return',
        extends: 'Expresion',
        props: [
            {
                name: 'exp',
                type: 'Expresion|undefined',
                description: 'Expresion a retornar'
            }
        ]
    },
    // Llamada
    {
        name: 'Llamada',
        extends: 'Expresion',
        props: [
            {
                name: 'callee',
                type: 'Expresion',
                description: 'Expresion a llamar'
            },
            {
                name: 'args',
                type: 'Expresion[]',
                description: 'Argumentos de la llamada'
            }
        ]
    },
    // Declaración de Función
    // declaracionFuncion = "function" _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return crearNodo('declaracionFuncion', { id, params: params || [], bloque })}
    {
        name: 'DeclaracionFuncion',
        extends: 'Expresion',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Identificador de la funcion'
            },
            {
                name: 'params',
                type: 'string[]',
                description: 'Parametros de la funcion'
            },
            {
                name: 'bloque',
                type: 'Bloque',
                description: 'Cuerpo de la funcion'
            }
        ]
    },
    // Clases
    // declaracionClase = "class" _ id:Identificador _ "{" _ dcls:ClassBody _ "}" { return crearNodo('DeclaracionClase', { id, dcls }) }
    {
        name: 'DeclaracionClase',
        extends: 'Expresion',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Identificador de la clase'
            },
            {
                name: 'dcls',
                type: 'Expresion[]',
                description: 'Cuerpo de la clase'
            }
        ]
    },
    // Instancias
    // "new" _ id:Identificador _ "(" _ Argumentos? _ ")" { return crearNodo('Instancia', { id, args: args || [] })}
    {
        name: 'Instancia',
        extends: 'Expresion',
        props: [
            {
                name: 'id',
                type: 'string',
                description: 'Identificador de la clase'
            },
            {
                name: 'args',
                type: 'Expresion[]',
                description: 'Argumentos de la instancia'
            }
        ]
    },
    // Get
    // return crearNodo('Get', { objetivo, propiedad:id });
    {
        name: 'Get',
        extends: 'Expresion',
        props: [
            {
                name: 'objetivo',
                type: 'Expresion',
                description: 'Objeto de la propiedad'
            },
            {
                name: 'propiedad',
                type: 'string',
                description: 'Identificador de la propiedad'
            }
        ]
    },
]

let code = ''

// Tipos base
types.forEach(type => {
    code += type + '\n'
})


// // Tipos de nodos
// configuracionNodos.forEach(nodo => {
//     code += `
// /**
//  * @typedef {Object} ${nodo.name}
//  * ${nodo.props.map(prop => `@property {${prop.type}} ${prop.name} ${prop.description}`).join('\n * ')}
// */
//     `
// })

// Tipos del visitor
code += `
/**
 * @typedef {import('./visitor').BaseVisitor} BaseVisitor
 */
`

const baseClass = configuracionNodos.find(nodo => nodo.base)

configuracionNodos.forEach(nodo => {


    code += `
export class ${nodo.name} ${baseClass && nodo.extends ? `extends ${nodo.extends}` : ''} {

    /**
    * @param {Object} options
    * ${nodo.props.map(prop => `@param {${prop.type}} options.${prop.name} ${prop.description}`).join('\n * ')}
    */
    constructor(${!nodo.base && nodo.props.length > 0 && `{ ${nodo.props.map(prop => `${prop.name}`).join(', ')} }` || ''}) {
        ${baseClass && nodo.extends ? `super();` : ''}
        ${nodo.props.map(prop => `
        /**
         * ${prop.description}
         * @type {${prop.type}}
        */
        this.${prop.name} = ${prop.default || `${prop.name}`};
`).join('\n')}
    }

    /**
     * @param {BaseVisitor} visitor
     */
    accept(visitor) {
        return visitor.visit${nodo.name}(this);
    }
}
    `
})

code += `
export default { ${configuracionNodos.map(nodo => nodo.name).join(', ')} }
`


fs.writeFileSync('./analyzer/ast/nodos.js', code)
console.log('Archivo de clases de nodo generado correctamente')


// Visitor
// @typedef {import('./nodos').Expresion} Expresion
code = `
/**
${configuracionNodos.map(nodo => `
 * @typedef {import('./nodos').${nodo.name}} ${nodo.name}
`).join('\n')}
 */
`

code += `

/**
 * Clase base para los visitantes
 * @abstract
 */
export class BaseVisitor {

    ${configuracionNodos.map(nodo => `
    /**
     * @param {${nodo.name}} node
     * @returns {any}
     */
    visit${nodo.name}(node) {
        throw new Error('Metodo visit${nodo.name} no implementado');
    }
    `).join('\n')
    }
}
`

fs.writeFileSync('./analyzer/ast/visitor.js', code)
console.log('Archivo de visitor generado correctamente')