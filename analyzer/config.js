module.exports = {
    format: 'es',
    input: './analyzer/analyzer.pegjs',
    dependencies: {
        'nodos': './ast/nodos.js',
        '{ Error_ }': './errors/error_.js'
    }
}