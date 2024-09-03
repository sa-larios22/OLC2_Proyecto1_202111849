import { Invocable } from "./invocable.js";

class NativeFunc extends Invocable {
    constructor(aridad, func) {
        super();
        this.aridad = aridad;
        this.invocar = func;
    }
}

export const embededFunctions = {
    'time': new NativeFunc(() => 0, () => new Date().toISOString())
}