export default class Popup {
    constructor () {
        this.container = document.createElement('div');
        this.container.classList.add('container-popup');
        this.containerContent = document.createElement('div');
        this.containerContent.classList.add('container-popup-content');
        this.container.appendChild(this.containerContent);
        document.body.appendChild(this.container);
        this.CreateContentHeader();
        this.CreateContentBody();
        this.events();

        this.buttons = [];
    }

    getElement () {
        return this.container;
    }

    delete () {
        this.container.remove();
    }

    events () {
        document.body.addEventListener('click', (e) => {
            if (e.target === this.container) this.container.remove();
        });
    }

    CreateContentHeader () {
        this.containerHeader = document.createElement('div');
        this.containerHeader.classList.add('container-popup-content-header');
        this.containerHeaderButtonClose = document.createElement('div');
        this.containerHeaderButtonClose.classList.add('container-popup-content-header-button-close');
        this.headerButtonClose = document.createElement('button');
        this.headerButtonClose.classList.add('popup-header-content-button-close');
        this.headerButtonClose.textContent = "X";
        this.containerHeaderButtonClose.appendChild(this.headerButtonClose);
        this.containerHeader.appendChild(this.containerHeaderButtonClose);
        this.containerContent.appendChild(this.containerHeader);
        this.CreateEventButtonClose();
    }

    CreateEventButtonClose () {
        this.headerButtonClose.addEventListener('click', () => {
            this.container.remove();
        });
    }

    CreateContentBody () {
        this.containerBody = document.createElement('div');
        this.containerBody.classList.add('container-popup-content-body');
        this.containerContent.appendChild(this.containerBody);
    }

    CreateTitle (text) {
        const title = document.createElement('span');
        title.classList.add('popup-title');
        title.innerText = text;
        this.containerBody.appendChild(title);
    }

    CreateButton (text, func) {
        const button = document.createElement('button');
        button.classList.add('popup-button');
        button.textContent = text;
        button.addEventListener('click', () => func());
        this.containerBody.appendChild(button);
    }
}