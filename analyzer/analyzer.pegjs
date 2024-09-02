
{
     const crearNodo = (tipoNodo, propiedades) => {
          const tipos = {
               'Numero': nodos.Numero,
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
               'While': nodos.While
          }

          const nodo = new tipos[tipoNodo](propiedades);
          nodo.location = location();
          return nodo;
     }
}

programa = _ dcl:Declaraciones* _ { return dcl }

Declaraciones = dcl:declaracionVariable _ { return dcl }
               / stmt:Stmt _ { return stmt }

declaracionVariable = "var" _ id:Identificador _ "=" _ exp:Expresion _ ";" { return crearNodo('DeclaracionVariable', { id, exp }) }

Stmt = "print(" _ exp:Expresion _ ")" _ ";" { return crearNodo('Print', { exp } ) }
     / exp:Expresion _ ";" { return crearNodo('ExpresionStatement', { exp } ) }
     / "{" _ dcls:Declaraciones* _ "}" { return crearNodo('Bloque', { dcls }) }
     / "if" _ "(" _ cond:Expresion _ ")" _ stmtTrue:Stmt
          stmtFalse:(
                    _ "else" _ stmtFalse:Stmt { return stmtFalse }
               )?
          { return crearNodo('If', { cond, stmtTrue, stmtFalse }) }
     / "while" _ "(" _ cond:Expresion _ ")" _ stmt:Stmt { return crearNodo('While', { cond, stmt }) }

Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

Expresion = Asignacion

Asignacion = id:Identificador _ "=" _ asgn:Asignacion { return crearNodo('Asignacion', { id, asgn }) }
          / Comparacion

Comparacion = izq:Suma expansion:(
     _ op:("<=") _ der:Suma { return { tipo: op, der } }
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

Unaria = "-" _ num:Numero { return crearNodo('Unaria', { op:'-', exp: num }) }
/ Numero


Numero = [0-9]+( "." [0-9]+ )? { return crearNodo('Numero', { valor: parseFloat(text()) }) }
  / "(" exp:Expresion ")" { return crearNodo('Parentesis', { exp }) }
  / Identificador { return crearNodo('ReferenciaVariable', { id: text() }) }

_ = [ \t\n\r]*