export class Error_ {
    /**
     * @param {string} description
     * @param {number} line
     * @param {number} column
     * @param {string} type
     */
    constructor(description, line, column, type) {
        this.description = description;
        this.line = line;
        this.column = column;
        this.type = type;
    }
}