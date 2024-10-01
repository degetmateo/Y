import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor () {
        super();
    }

    async init (params) {
        this.params = params;
        this.setTitle('Error');
        this.clear();
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '<h1>404: Recurso no encontrado.</h1>';
    }
}