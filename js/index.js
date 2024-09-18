import * as monaco from 'https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/+esm'

import { parse } from '../analyzer/analyzer.js';
import { InterpreterVisitor } from '../analyzer/ast/interprete.js';
import { Error_ } from '../analyzer/errors/error_.js';
import { Simbolo } from '../analyzer/ast/simbolo.js';

const btnInterpretar = document.getElementById('btnInterpretar');
const btnAbrirArchivo = document.getElementById('btnAbrirArchivo');
const btnGuardarArchivo = document.getElementById('btnGuardarArchivo');
const btnTablaErrores = document.getElementById('btnTablaErrores');
const btnTablaSimbolos = document.getElementById('btnTablaSimbolos');
const output = document.getElementById('consoleTextArea');
const ast = document.getElementById('ast');

let listaErrores = [];
export const listaSimbolos = [];

const editor = monaco.editor.create(
    document.getElementById('editor'), {
        value: '',
        language: 'java',
        theme: 'vs-dark'
    }
);

const content = localStorage.getItem('content');
editor.setValue(content || '');

editor.onDidChangeModelContent(() => {
    localStorage.setItem('content', editor.getValue());
});

// Función para abrir archivo .oak
btnAbrirArchivo.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.oak'; // Solo permite archivos con la extensión .oak
    input.onchange = e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                editor.setValue(event.target.result);
            };
            reader.readAsText(file);
        }
    };
    input.click();
});

// Función para guardar el contenido actual como archivo .oak
btnGuardarArchivo.addEventListener('click', () => {
    const content = editor.getValue();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'archivo.oak'; // Nombre por defecto del archivo
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Limpiar después de la descarga
});

// Función para generar la tabla de errores como un archivo HTML
btnTablaErrores.addEventListener('click', () => {
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tabla de Errores</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            table, th, td { border: 1px solid black; }
            th, td { padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <h1>Tabla de Errores</h1>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Descripción</th>
                    <th>Línea</th>
                    <th>Columna</th>
                    <th>Tipo</th>
                </tr>
            </thead>
            <tbody>`;

    listaErrores.forEach((error, index) => {
        htmlContent += `
        <tr>
            <td>${index + 1}</td>
            <td>${error.description}</td>
            <td>${error.line}</td>
            <td>${error.column}</td>
            <td>${error.type}</td>
        </tr>`;
    });

    htmlContent += `
            </tbody>
        </table>
    </body>
    </html>`;

    // Crear un archivo Blob con el contenido HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TablaDeErrores.html'; // Nombre del archivo HTML
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Limpiar después de la descarga
});

// Función para generar la tabla de símbolos como un archivo HTML
btnTablaSimbolos.addEventListener('click', () => {
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tabla de Símbolos</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            table, th, td { border: 1px solid black; }
            th, td { padding: 10px; text-align: left; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <h1>Tabla de Símbolos</h1>
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Tipo de Símbolo</th>
                    <th>Tipo de Dato</th>
                    <th>Línea</th>
                    <th>Columna</th>
                </tr>
            </thead>
            <tbody>`;

    listaSimbolos.forEach((simbolo, index) => {
        htmlContent += `
        <tr>
            <td>${index + 1}</td>
            <td>${simbolo.id}</td>
            <td>${simbolo.tipoSimbolo}</td>
            <td>${simbolo.tipoDato}</td>
            <td>${simbolo.linea}</td>
            <td>${simbolo.columna}</td>
        </tr>`;
    });

    htmlContent += `
            </tbody>
        </table>
    </body>
    </html>`;

    // Crear un archivo Blob con el contenido HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TablaDeSimbolos.html'; // Nombre del archivo HTML
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Limpiar después de la descarga
});

// Función para interpretar el código fuente
btnInterpretar.addEventListener('click', () => {
    // Obtenemos el código fuente del editor
    const codigoFuente = editor.getValue();

    try {
        // Parseamos el código fuente con el analizador generado por PeggyJS
        // Parse genera un AST en forma de JSON
        const sentencias = parse(codigoFuente);

        // Creamos una instancia del visitante de interpretación
        const interprete = new InterpreterVisitor();

        console.log({ sentencias } );

        sentencias.forEach(sentencia => {
            try {
                sentencia.accept(interprete);
            } catch (error) {
                if (error instanceof Error_) {
                    listaErrores.push(error);
                } else {
                    console.log(error);
                }
            }
        });

        output.innerHTML = interprete.salida;

    } catch (error) {
        console.log("Error: ", JSON.stringify(error, null, 4));
        console.log(error);
        // output.innerHTML = error.message;
    }

    console.log("Errores: ", listaErrores);
    console.log("Símbolos: ", listaSimbolos);
});

window.addEventListener('resize', () => {
    editor.layout();
});

