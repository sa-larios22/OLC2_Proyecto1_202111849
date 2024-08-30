import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/+esm'

import { parse } from '../analyzer/analyzer.js';
import { InterpreterVisitor } from '../analyzer/ast/interprete.js';

const btn = document.getElementById('btnInterpretar');
const output = document.getElementById('consoleTextArea');
const ast = document.getElementById('ast');

const editor = monaco.editor.create(
    document.getElementById('editor'), {
        value: '',
        language: 'java',
        theme: 'vs-dark'
    },
);

btn.addEventListener('click', () => {
    // Obtenemos el código fuente del editor
    const codigoFuente = editor.getValue();

    // Parseamos el código fuente con el analizador generado por PeggyJS
    // Parse genera un AST en forma de JSON
    const sentencias = parse(codigoFuente);

    // Mostramos el árbol en el textarea
    ast.innerHTML = JSON.stringify(sentencias, null, 4);

    // Creamos una instancia del visitante de interpretación
    const interprete = new InterpreterVisitor();

    console.log( { sentencias } );

    sentencias.forEach(sentencia => sentencia.accept(interprete))

    output.innerHTML = interprete.salida;
});

window.addEventListener('resize', () => {
    editor.layout();
});