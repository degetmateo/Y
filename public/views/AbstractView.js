export default class {
    constructor () {
        this.appContainer = document.getElementById('app');
    }

    clear () {
        this.appContainer.innerHTML = '';
    }

    setTitle (title) {
        document.title = title;
    }

    async init () {
        
    }
}