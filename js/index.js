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

    const num1 = recorrer(nodo.num1)
    const num2 = recorrer(nodo.num2)

    switch (nodo.tipo) {
        case 'Suma':
            return num1 + num2;
        case 'Multiplicacion':
            return num1 * num2;
    }
}

btn.addEventListener('click', () => {
    const codigoFuente = editor.getValue();
    const arbol = parse(codigoFuente);
    ast.innerHTML = JSON.stringify(arbol, null, 2);
    const resultado = recorrer(arbol);
    output.value = resultado;
});

window.addEventListener('resize', () => {
    editor.layout();
});