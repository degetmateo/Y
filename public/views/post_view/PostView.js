import AbstractView from '../AbstractView.js';
import { CreateNavigation } from '../templates/nav.js';

export default class extends AbstractView {
    constructor (_params) {
        super(_params);
        this.appContainer = document.getElementById('app');
        this.appContainer.innerHTML = `
            <div class="container-view container-view-post">
                <div id="nav" class="container-nav"></div>
            </div>
        `;

        CreateNavigation();
        this.setTitle('POST');
    }
}