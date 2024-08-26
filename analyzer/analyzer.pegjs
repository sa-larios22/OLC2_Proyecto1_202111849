Expresion = Suma

Suma = izq:Multiplicacion expansion:( op:("+" / "-") der:Multiplicacion { return { tipo: op, der } } )* {
     return expansion.reduce(
          (operacionAnterior, operacionActual) => {
               const { tipo, der } = operacionActual;
               return { tipo, izq:operacionAnterior, der };
          },
          izq
     );
}

Multiplicacion = izq:Unaria expansion:( op:("*" / "/") der:Unaria { return { tipo: op, der } } )* {
     return expansion.reduce(
          (operacionAnterior, operacionActual) => {
               const { tipo, der } = operacionActual;
               return { tipo, izq:operacionAnterior, der };
          },
          izq
     );
}

Unaria = "-" num:Numero { return { tipo: "-", der: num } }
/ Numero


Numero = [0-9]+( "." [0-9]+ )? { return { tipo: "Numero", valor: parseFloat(text(), 10) } }
  / "(" exp:Expresion ")" { return { tipo: "Parentesis", exp } }

_ = [ \t\n\r]*