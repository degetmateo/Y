import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor (params) {
        super(params);
        this.setTitle('Publicacion');

        this.appContainer = document.getElementById('app');
        this.appContainer.innerHTML = '';

        this.viewContainer = document.createElement('div');
        this.viewContainer.classList.add('container-view');
        this.viewContainer.classList.add('container-view-post');
        
        this.mainContainer = document.createElement('div');
        this.mainContainer.classList.add('container-view-post-main');

        this.viewContainer.appendChild(this.mainContainer);
        this.appContainer.appendChild(this.viewContainer);
    }

    async init () {
        this.mainContainer.innerHTML = 'post id: '+this.params.id_post;
    }
}