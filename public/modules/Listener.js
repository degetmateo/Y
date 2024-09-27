export default class Listener {
    constructor () {
        this.observers = new Array();
        this.events();
    }

    addObserver (observer) {
        this.observers.push(observer);
    }

    removeObserver (_id) {
        this.observers = this.observers.filter(observer => observer.observerId != _id);
    }

    events () {
        this.onVisibilityChange();
    }

    onVisibilityChange () {
        document.onvisibilitychange = () => {
            if (document.visibilityState != 'visible') return;
            this.observers.forEach(observer => observer.onVisibilityChange());
        }
    }
}