Expresion = Suma

Suma = num1:Multiplicacion "+" num2:Suma { return { tipo: "Suma", num1, num2 } }
     / Multiplicacion

Multiplicacion = num1:Numero "*" num2:Multiplicacion { return { tipo: "Multiplicacion", num1, num2 } }
              / Numero

Numero = [0-9]+(!"." [0-9]+)? { return { tipo: "Numero", valor: parseFloat(text(), 10) } }