const editorText = document.getElementById('editorTextArea');
const btn = document.getElementById('btnInterpretar');
const output = document.getElementById('consoleTextArea');
const ast = document.getElementById('ast');

btn.addEventListener('click', () => {

    const sourceCode = editorText.value;

    ast.innerHTML = editorText.value;
});