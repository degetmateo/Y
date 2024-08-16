import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor (params) {
        super(params);
        this.setTitle('Error');
    }

    async init () {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = '<h1>404: Recurso no encontrado.</h1>';
    }
}