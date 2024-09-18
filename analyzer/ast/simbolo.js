export class Simbolo {
    /**
     * @param {string} id
     * @param {string} tipoSimbolo
     * @param {string} tipoDato
     * @param {number} linea
     * @param {number} columna
     */
    constructor(id, tipoSimbolo, tipoDato, linea, columna) {
        this.id = id;
        this.tipoSimbolo = tipoSimbolo;
        this.tipoDato = tipoDato;
        this.linea = linea;
        this.columna = columna
    }
}