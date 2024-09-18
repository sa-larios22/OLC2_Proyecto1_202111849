
{
     const crearNodo = (tipoNodo, propiedades) => {
          const tipos = {
               'Primitivo': nodos.Primitivo,
               'Parentesis': nodos.Parentesis,
               'Binaria': nodos.OperacionBinaria,
               'Unaria': nodos.OperacionUnaria,
               'DeclaracionVariable': nodos.DeclaracionVariable,
               'DeclaracionArray': nodos.DeclaracionArray,
               'ReferenciaVariable': nodos.ReferenciaVariable,
               'ReferenciaArray': nodos.ReferenciaArray,
               'Print': nodos.Print,
               'ExpresionStatement': nodos.ExpresionStatement,
               'Asignacion': nodos.Asignacion,
               'Bloque': nodos.Bloque,
               'If': nodos.If,
               'Switch': nodos.Switch,
               'Case': nodos.Case,
               'DefaultCase': nodos.DefaultCase,
               'While': nodos.While,
               'For': nodos.For,
               'ForEach': nodos.ForEach,
               'Break': nodos.Break,
               'Continue': nodos.Continue,
               'Return': nodos.Return,
               'Llamada': nodos.Llamada,
               'DeclaracionFuncion': nodos.DeclaracionFuncion,
               'DeclaracionStruct': nodos.DeclaracionStruct,
               'DeclaracionClase': nodos.DeclaracionClase,
               'Instancia': nodos.Instancia,
               'Get': nodos.Get,
               'Set': nodos.Set,
               'FuncArray': nodos.FuncArray,
               'FuncionEmbedida': nodos.FuncionEmbedida
          }

          const nodo = new tipos[tipoNodo](propiedades);
          nodo.location = location();
          return nodo;
     }
}

programa = _ dcl:Declaraciones* _ { return dcl }

Declaraciones = dcl:declaracionVariable _ { return dcl }
               / dcl:declaracionArray _ { return dcl }
               / dcl:declaracionFuncion _ { return dcl }
               / dcl:declaracionStruct _ { return dcl }
               / dcl:declaracionClase _ { return dcl }
               / stmt:Stmt _ { return stmt }

declaracionVariable = tipo:("int" / "float" / "string" / "boolean" / "char" / "var" / Identificador) _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('DeclaracionVariable', { tipo, id, exp }) }
                    / tipo:Tipo _ id:Identificador _ ";" { return crearNodo('DeclaracionVariable', { tipo, id }) }

declaracionArray = tipo:("int[]" / "float[]" / "string[]" / "boolean[]" / "char[]") _ id:Identificador _ "=" _ "{" _ exp:arrayValores _ "}" _ ";" { return crearNodo('DeclaracionArray', { tipo, id, exp }) }
               / tipo:("int[]" / "float[]" / "string[]" / "boolean[]" / "char[]") _ id:Identificador _ "=" _ "new" _ tipoArray:("int" / "float" / "string" / "boolean" / "char") _ "[" _ exp:Expresion _ "]" _ ";" {
                    if (tipo.slice(0,-2) !== tipoArray) {
                         throw new Error(`Los tipos deben ser iguales`);
                    }
                    return crearNodo('DeclaracionArray', { tipo, id, exp })
               }
               / tipo:("int[]" / "float[]" / "string[]" / "boolean[]" / "char[]") _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('DeclaracionArray', { tipo, id, exp }) }

Tipo = "int" / "float" / "string" / "boolean" / "char" / "var" / !"return"Identificador { return text() }

arrayValores = exp:Expresion _ valores:(_ "," _ exp_:Expresion { return exp_ } )* { return [exp, ...valores] }

declaracionFuncion = tipoFunc:("int" / "float"/  "string" / "boolean" / "char" / "void") _ dims:("[]"+)? _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return crearNodo('DeclaracionFuncion', { tipoFunc, dims: dims || [], id, params: params || [], bloque })}

declaracionStruct = "struct" _ id:Identificador _ "{" _ atbs:Atributos* _ "}" _ ";" { return crearNodo('DeclaracionStruct', { id, atbs }) }

Atributos = tipo:Tipo _ id:Identificador _ ";" _ { return { tipo, id } }

declaracionClase = "class" _ id:Identificador _ "{" _ dcls:ClassBody* _ "}" { return crearNodo('DeclaracionClase', { id, dcls }) }

ClassBody = dcl:declaracionVariable _ { return dcl }
          / dcl:declaracionFuncion _ { return dcl }

Parametros = param:paramsFunc _ params:("," _ ids:paramsFunc { return ids })* { return [param, ...params] }

paramsFunc = param_:(tipo:("int" / "float" / "string" / "boolean" / "char") _ id:Identificador { return { tipo, id } }) { return param_ }

Stmt = "print(" _ expList:ExpresionListPrint _ ")" _ ";" { return crearNodo('Print', { expList } ) }
     / "System.out.println(" _ expList:ExpresionListPrint _ ")" _ ";" { return crearNodo('Print', { expList } ) }
     / bloque:Bloque { return bloque }
     / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt
          stmtFalse:(
                    _ "else" _ stmtFalse:Stmt { return stmtFalse }
               )?
          { return crearNodo('If', { cond, stmtTrue, stmtFalse }) }
     / "switch" _ "(" _ exp:Expresion _ ")" _ "{" _ caseList:CaseList _ defaultCase:DefaultCase? _ "}" {
          return crearNodo('Switch', { exp, caseList, defaultCase })
     }
     / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return crearNodo('While', { cond, stmt }) }
     / "for" _ "(" _ init:ForInit _ cond:Expresion _ ";" _ inc:Expresion _ ")" _ stmt:Stmt {
          return crearNodo('For', { init, cond, inc, stmt })
     }
     / "for" _ "(" _ tipo:("int" / "float" / "string" / "boolean" / "char") _ id:Identificador _ ":" _ arr:Expresion _ ")" _ stmt:Stmt {
          return crearNodo('ForEach', { tipo, id, arr, stmt })
     }
     / "break" _ ";" { return crearNodo('Break') }
     / "continue" _ ";" { return crearNodo('Continue') }
     / "return" _ exp:Expresion? _ ";" { return crearNodo('Return', { exp }) }
     / exp:Expresion _ ";" { return crearNodo('ExpresionStatement', { exp } ) }

ExpresionListPrint = exp:Expresion _ exps:("," _ exp_:Expresion { return exp_ } )* { return [exp, ...exps] }

Bloque = "{" _ dcls:Declaraciones* _ "}" { return crearNodo('Bloque', { dcls }) }

ForInit = dcl:declaracionVariable { return dcl }
        / exp:Expresion _ ";" { return exp }
        / ";" { return null }

CaseList = initialCase:Case otherCases:(_ caso:Case { return caso; } )* { return [initialCase, ...otherCases] }

Case = "case" _ cond:Expresion _ ":" _ dcls:Declaraciones* { return crearNodo('Case', { cond, dcls }) }

DefaultCase = "default" _ ":" _ dcls:Declaraciones* { return crearNodo('DefaultCase', { dcls }) }

Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

Expresion = Asignacion

Asignacion = id:Identificador "[" _ index:Numero _ "]" _ "=" _ asgn:Expresion { return crearNodo('Asignacion', { id, index, asgn }) }
          / id:Identificador _ "+=" _ asgn:Expresion {
               return crearNodo('Asignacion', {
                    id,
                    asgn: crearNodo('Binaria', {
                         op:'+',
                         izq: crearNodo('ReferenciaVariable', { id } ),
                         der: asgn
                    })
               })
          }
          / id:Identificador _ "-=" _ asgn:Expresion { 
               return crearNodo('Asignacion', {
                    id,
                    asgn: crearNodo('Binaria', {
                         op:'-',
                         izq: crearNodo('ReferenciaVariable', { id } ),
                         der: asgn
                    })
               })
          }
          / asignado:Llamada _ "=" _ asgn:Asignacion {

               if (asignado instanceof nodos.ReferenciaVariable) {
                    return crearNodo('Asignacion', { id: asignado.id, asgn });
               }
               
               if (asignado instanceof nodos.ReferenciaArray) {
                    return crearNodo('Asignacion', { id: asignado.id, index: asignado.num, asgn });
               }

               if (!(asignado instanceof nodos.Get)) {
                    throw new Error_(`Solo se pueden asignar valores a propiedades de objetos`, location.start.line, location.start.column, 'Semantico');
               }

               return crearNodo('Set', { objetivo: asignado.objetivo, propiedad: asignado.propiedad, valor:asgn });

          }
          / OrLogico


OrLogico = izq:AndLogico expansion:( _ "||" _ der:AndLogico { return { tipo: '||', der } } )* {
     return expansion.reduce(
          (operacionAnterior, operacionActual) => {
               const { tipo, der } = operacionActual;
               return crearNodo('Binaria', { op:tipo, izq:operacionAnterior, der });
          },
          izq
     );
}

AndLogico = izq:Igualdad expansion:( _ "&&" _ der:Igualdad { return { tipo: '&&', der } } )* {
     return expansion.reduce(
          (operacionAnterior, operacionActual) => {
               const { tipo, der } = operacionActual;
               return crearNodo('Binaria', { op:tipo, izq:operacionAnterior, der });
          },
          izq
     );
}

Igualdad = izq:Comparacion expansion:(
     _ op:("==" / "!=") _ der:Comparacion { return { tipo: op, der } }
     )* {
     return expansion.reduce(
          (operacionAnterior, operacionActual) => {
               const { tipo, der } = operacionActual;
               return crearNodo('Binaria', { op:tipo, izq:operacionAnterior, der });
          },
          izq
     );
}

Comparacion = izq:Suma expansion:(
     _ op:("<=" / "<" / ">=" / ">") _ der:Suma { return { tipo: op, der } }
     )* {
     return expansion.reduce(
          (operacionAnterior, operacionActual) => {
               const { tipo, der } = operacionActual;
               return crearNodo('Binaria', { op:tipo, izq:operacionAnterior, der });
          },
          izq
     );
     }

Suma = izq:Multiplicacion expansion:( _ op:("+" / "-") _ der:Multiplicacion { return { tipo: op, der } } )* {
     return expansion.reduce(
          (operacionAnterior, operacionActual) => {
               const { tipo, der } = operacionActual;
               return crearNodo('Binaria', { op:tipo, izq:operacionAnterior, der });
          },
          izq
     );
}

Multiplicacion = izq:Unaria expansion:( _ op:("*" / "/" / "%") _ der:Unaria { return { tipo: op, der } } )* {
     return expansion.reduce(
          (operacionAnterior, operacionActual) => {
               const { tipo, der } = operacionActual;
               return crearNodo('Binaria', { op:tipo, izq:operacionAnterior, der });
          },
          izq
     );
}

Unaria = op:("!" / "-") _ exp:Unaria { return crearNodo('Unaria', { op, exp }) }
     / Llamada

Llamada = objetivoInicial:Numero _

     operaciones:(
          ("(" args:Argumentos? ")" { return { args, tipo:'funcCall'} }) /
          (".indexOf(" _ index:Expresion _ ")" { return { index, tipo:'indexOf' } }) /
          (".join()" { return { tipo:'join' } }) /
          (".length" { return { tipo:'length' } }) /
          ("." id:Identificador { return { id, tipo:'get' } })
     
     )* {

          return operaciones.reduce(
               (objetivo, args) => {
                    const { tipo, id, args:argumentos, index } = args;

                    if (tipo === 'funcCall') {
                         return crearNodo('Llamada', { callee: objetivo, args: argumentos || [] });
                    } else if (tipo === 'get') {
                         return crearNodo('Get', { objetivo, propiedad:id });
                    } else if (tipo === 'indexOf') {
                         return crearNodo('FuncArray', { arr:objetivo, tipo, index });
                    } else if (tipo === 'join' || tipo === 'length') {
                         return crearNodo('FuncArray', { arr:objetivo, tipo });
                    }
               },
               objetivoInicial
     );
}

Argumentos = arg:Expresion _ args:("," _ exp:Expresion { return exp } )* { return [arg, ...args] }

Numero = [0-9]+( "." [0-9]+ )+ { return crearNodo('Primitivo', { valor: parseFloat(text()), tipo:'float' }) }
     / [0-9]+ { return crearNodo('Primitivo', { valor: parseInt(text()), tipo:'int' }) }
     / string_:String_ { return string_ }
     / boolean_:Boolean_ { return boolean_ }
     / char_:Char_ { return char_ }
     / "(" exp:Expresion ")" { return crearNodo('Parentesis', { exp }) }
     / "new" _ id:Identificador _ "(" _ args:Argumentos? _ ")" { return crearNodo('Instancia', { id, args: args || [] })}
     / fnc:FuncionesEmbedidas { return fnc } 
     / id:Identificador _ "{" _ props:propiedadesDclStruct _ "}" { return crearNodo('Instancia', { id, args:props }) }
     / id:Identificador _ "[" _ num:Numero _ "]" { return crearNodo('ReferenciaArray', { id, num } ); }
     / Identificador { return crearNodo('ReferenciaVariable', { id: text() }) }

propiedadesDclStruct = prop:propiedadDclStruct _ props:( "," _ prop_:propiedadDclStruct { return prop_ } )* { return [prop, ...props] }

propiedadDclStruct = id:Identificador _ ":" _ exp:Expresion { return { id, exp } }

FuncionesEmbedidas = "parseInt" _ "(" _ exp:Expresion _ ")" { return crearNodo('FuncionEmbedida', { tipo:'parseInt', exp } ) }
                    / "parsefloat" _ "(" _ exp:Expresion _ ")" { return crearNodo('FuncionEmbedida', { tipo:'parsefloat', exp } ) }
                    / "toString" _ "(" _ exp:Expresion _ ")" { return crearNodo('FuncionEmbedida', { tipo:'toString', exp } ) }
                    / "toLowerCase" _ "(" _ exp:Expresion _ ")" { return crearNodo('FuncionEmbedida', { tipo:'toLowerCase', exp } ) }
                    / "toUpperCase" _ "(" _ exp:Expresion _ ")" { return crearNodo('FuncionEmbedida', { tipo:'toUpperCase', exp } ) }
                    / "typeof" _ exp:Expresion _ { return crearNodo('FuncionEmbedida', { tipo:'typeof', exp } ) }

String_ = "\"" texto:( ( "\\\\" / "\\\"" / "\\n" / "\\r" / "\\t" / [^\\"] )* ) "\"" {
    return crearNodo('Primitivo', { 
        valor: texto.join('')
           .replace(/\\"/g, '"')
           .replace(/\\\\/g, '\\')
           .replace(/\\n/g, '\n')  
           .replace(/\\r/g, '\r')
           .replace(/\\t/g, '\t'), 
        tipo: 'string' 
    });
}

Boolean_ = "true" { return crearNodo('Primitivo', { valor: true, tipo:'boolean' }) }
         / "false" { return crearNodo('Primitivo', { valor: false, tipo:'boolean' }) }

Char_ = "'" char:. "'" { return crearNodo('Primitivo', { valor: char, tipo:'char' }) }

_ = ([ \t\n\r] / Comentarios)*

Comentarios = "//" (![\n] .)*
               / "/*" (!("*/") .)* "*/"