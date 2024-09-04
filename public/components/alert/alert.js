export default class Alert {
    constructor (message) {
        this.message = message;
        this.container = document.createElement('div');
        this.container.classList.add('container-alert');
        this.containerContent = document.createElement('div');
        this.containerContent.classList.add('container-alert-content');
        this.container.appendChild(this.containerContent);
        document.body.appendChild(this.container);
        this.CreateContentBody();
        this.events();

        if (!window.app.alerts) window.app.alerts = new Array();
        if (window.app.alerts[0]) window.app.alerts[0].delete();
        window.app.alerts[0] = this;
    }

    getElement () {
        return this.container;
    }

    delete () {
        this.container.remove();
    }

    events () {
        this.container.onclick = () => {
            this.delete();            
        }

        setTimeout(() => {
            this.delete();
        }, 4000);
    }

    body () {
        return this.containerBody;
    }

    CreateContentBody () {
        this.containerBody = document.createElement('div');
        this.containerBody.classList.add('container-alert-content-body');
        this.containerBody.textContent = this.message;
        this.containerContent.appendChild(this.containerBody);
    }
}