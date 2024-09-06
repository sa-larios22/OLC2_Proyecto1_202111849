
{
     const crearNodo = (tipoNodo, propiedades) => {
          const tipos = {
               'Primitivo': nodos.Primitivo,
               'Parentesis': nodos.Parentesis,
               'Binaria': nodos.OperacionBinaria,
               'Unaria': nodos.OperacionUnaria,
               'DeclaracionVariable': nodos.DeclaracionVariable,
               'ReferenciaVariable': nodos.ReferenciaVariable,
               'Print': nodos.Print,
               'ExpresionStatement': nodos.ExpresionStatement,
               'Asignacion': nodos.Asignacion,
               'Bloque': nodos.Bloque,
               'If': nodos.If,
               'While': nodos.While,
               'For': nodos.For,
               'Break': nodos.Break,
               'Continue': nodos.Continue,
               'Return': nodos.Return,
               'Llamada': nodos.Llamada,
               'DeclaracionFuncion': nodos.DeclaracionFuncion,
               'DeclaracionClase': nodos.DeclaracionClase
          }

          const nodo = new tipos[tipoNodo](propiedades);
          nodo.location = location();
          return nodo;
     }
}

programa = _ dcl:Declaraciones* _ { return dcl }

Declaraciones = dcl:declaracionVariable _ { return dcl }
               / dcl:declaracionFuncion _ { return dcl }
               / stmt:Stmt _ { return stmt }

declaracionVariable = tipo:("int" / "float" / "string" / "boolean" / "char" / "var") _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('DeclaracionVariable', { tipo, id, exp }) }
                    / tipo:("int" / "float" / "string" / "boolean" / "char" / "var") _ id:Identificador _ ";" { return crearNodo('DeclaracionVariable', { tipo, id }) }

declaracionFuncion = "function" _ id:Identificador _ "(" _ params:Parametros? _ ")" _ bloque:Bloque { return crearNodo('DeclaracionFuncion', { id, params: params || [], bloque })}

declaracionClase = "class" _ id:Identificador _ "{" _ dcls:ClassBody _ "}" { return crearNodo('DeclaracionClase', { id, dcls }) }

ClassBody = dcl:declaracionVariable _ { return dcl }
          / dcl:declaracionFuncion _ { return dcl }

Parametros = id:Identificador _ params:("," _ ids:Identificador { return ids })* { return [id, ...params] }

Stmt = "print(" _ exp:Expresion _ ")" _ ";" { return crearNodo('Print', { exp } ) }
     / bloque:Bloque { return bloque }
     / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt
          stmtFalse:(
                    _ "else" _ stmtFalse:Stmt { return stmtFalse }
               )?
          { return crearNodo('If', { cond, stmtTrue, stmtFalse }) }
     / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return crearNodo('While', { cond, stmt }) }
     / "for" _ "(" _ init:ForInit _ cond:Expresion _ ";" _ inc:Expresion _ ")" _ stmt:Stmt {
          return crearNodo('For', { init, cond, inc, stmt })
     }
     / "break" _ ";" { return crearNodo('Break') }
     / "continue" _ ";" { return crearNodo('Continue') }
     / "return" _ exp:Expresion? _ ";" { return crearNodo('Return', { exp }) }
     / exp:Expresion _ ";" { return crearNodo('ExpresionStatement', { exp } ) }

Bloque = "{" _ dcls:Declaraciones* _ "}" { return crearNodo('Bloque', { dcls }) }

ForInit = dcl:declaracionVariable { return dcl }
        / exp:Expresion _ ";" { return exp }
        / ";" { return null }

Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

Expresion = Asignacion

Asignacion = id:Identificador _ "=" _ asgn:Asignacion { return crearNodo('Asignacion', { id, asgn }) }
          / Comparacion

Comparacion = izq:Suma expansion:(
     _ op:("<=" / "==") _ der:Suma { return { tipo: op, der } }
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

Multiplicacion = izq:Unaria expansion:( _ op:("*" / "/") _ der:Unaria { return { tipo: op, der } } )* {
     return expansion.reduce(
          (operacionAnterior, operacionActual) => {
               const { tipo, der } = operacionActual;
               return crearNodo('Binaria', { op:tipo, izq:operacionAnterior, der });
          },
          izq
     );
}

Unaria = "-" _ num:Unaria { return crearNodo('Unaria', { op:'-', exp: num }) }
/ Llamada

Llamada = callee:Numero _ params:("(" args:Argumentos? ")" { return args } )* {
     return params.reduce(
          (callee, args) => {
               return crearNodo('Llamada', { callee, args: args || [] });
          },
          callee
     );
}

Argumentos = arg:Expresion _ args:("," _ exp:Expresion { return exp } )* { return [arg, ...args] }

Numero = [0-9]+( "." [0-9]+ )+ { return crearNodo('Primitivo', { valor: parseFloat(text()), tipo:'float' }) }
     / [0-9]+ { return crearNodo('Primitivo', { valor: parseInt(text()), tipo:'int' }) }
     / string_:String_ { return string_ }
     / boolean_:Boolean_ { return boolean_ }
     / char_:Char_ { return char_ }
     / "(" exp:Expresion ")" { return crearNodo('Parentesis', { exp }) }
     / Identificador { return crearNodo('ReferenciaVariable', { id: text() }) }

String_ = "\"" texto:( ( "\\\\" / "\\\"" / "\\n" / "\\r" / "\\t" / [^\\"] )* ) "\"" {
    console.log(texto.join(''));
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