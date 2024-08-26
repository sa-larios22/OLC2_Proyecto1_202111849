import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/+esm'

import { parse } from '../analyzer/analyzer.js';

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

const recorrer = (nodo) => {
    if (nodo.tipo === 'Numero') return nodo.valor;
    if (nodo.tipo === 'Parentesis') return recorrer(nodo.exp);

    const num1 = (nodo.izq && recorrer(nodo.izq)) || 0;
    const num2 = recorrer(nodo.der)

    switch (nodo.tipo) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            return num1 / num2;
    }
}

btn.addEventListener('click', () => {
    // Obtenemos el código fuente del editor
    const codigoFuente = editor.getValue();

    // Parseamos el código fuente con el analizador generado por PeggyJS
    // Parse genera un AST en forma de JSON
    const arbol = parse(codigoFuente);

    // Mostramos el árbol en el textarea
    ast.innerHTML = JSON.stringify(arbol, null, 4);

    // Recorremos el árbol
    const resultado = recorrer(arbol);

    // Mostramos el resultado en el textarea
    output.value = resultado;
});

window.addEventListener('resize', () => {
    editor.layout();
});