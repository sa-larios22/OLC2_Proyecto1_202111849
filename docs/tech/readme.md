# Manual Técnico

PeggyJS es una herramienta para construir parsers (analizadores sintácticos) en **JavaScript**. Está basada en **PEG** (Parsing Expression Grammar), un enfoque formal para definir la gramática de un lenguaje. PeggyJS toma como entrada una especificación de gramática, escrita en su propio formato, y genera un analizador sintáctico en JavaScript que puede procesar entradas y validarlas o extraer información estructurada de ellas.

**Características de PeggyJS:**
- Sintaxis gramatical simple y expresiva.
- Integra análisis léxico y sintáctico
- Los analizadores tienen un excelente sistema de generación de informes de errores listo para usar
- Basado en el formalismo gramatical de expresión de análisis, más potente que los analizadores `LL(k)` y `LR(k)` tradicionales
- Se puede utilizar desde su navegador, desde la línea de comandos o a través de la API de JavaScript

PeggyJS puede instalarse con el comando `npm install peggy`

Para generar el archivo de análisis sintáctico se debe ejecutar `npx peggy ./analyzer/analyzer.pegjs --format es`

- `npx`: Ejecuta paquetes Node.js sin necesidad de instalarlos globalmente.
- `peggy`: Es la herramienta PeggyJS, que se encarga de procesar gramáticas definidas en el formato PEG.
- `./analyzer/analyzer.pegjs`: Especifica la ubicación del archivo de gramática que contiene las reglas PEG. En este caso, está en la carpeta `analyzer` y se llama `analyzer.pegjs`.
- `--format es`: Le indica a Peggy que genere el código del analizador sintáctico en el formato de módulos ES (ESModules). Esto significa que el código generado usará la sintaxis import/export de `ES6`.

El uso de ES6 (también conocido como ECMAScript 2015) es importante, pues estamos trabajando con HTML, CSS y JavaScript puro. Los navegadores modernos soportan ESModules de forma nativa, además, GitHub Pages, donde se alojará la aplicación, también soporta ESModules.

Se puede utilizar un archivo de configuración para la ejecución del analizador sintáctico, en este caso, el archivo `config.js` se encuentra en la carpeta `analyzer`. Para ejecutar el analizador sintáctico con el archivo de configuración, se debe ejecutar el comando `npx peggy -c ./analyzer/analyzer.js`

La sintáxsis del archivo de configuración es la siguiente:
```javascript
// config.js or config.cjs
module.exports = {
  allowedStartRules = ["foo", "bar"],
  format: "umd",
  exportVar: "foo",
  input: "fooGrammar.peggy",
  plugins: [require("./plugin.js")],
  testFile: "myTestInput.foo",
  trace: true,
};
```

Si se modifica el archivo de la gramática, se debe ejecutar el comando para generar el analizador sintáctico.