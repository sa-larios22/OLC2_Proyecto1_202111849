
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
               'ExpresionStatement': nodos.ExpresionStatement
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

Identificador = [a-zA-Z][a-zA-Z0-9]* { return text() }

Expresion = Suma

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