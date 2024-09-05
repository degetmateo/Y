export default class {
    constructor (params) {
        this.params = params;
        document.onvisibilitychange = null;
    }

    setTitle (title) {
        document.title = title;
    }

    async init () {
        
    }
}