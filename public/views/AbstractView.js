export default class {
    constructor (params) {
        this.params = params;
        this.appContainer = document.getElementById('app');
        this.appContainer.innerHTML = '';
    }

    setTitle (title) {
        document.title = title;
    }

    async init () {
        
    }
}