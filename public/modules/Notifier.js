class Notifier {
    STORAGE = 'notifications';
    URL = '/api/notifications/';

    constructor () {
        this.entries = new Array();
        this.observers = new Array();

        this.observerId = 'notifier';
    }

    init () {
        this.do();
        this.interval = setInterval(() => {
            this.do();
        }, 60000);
    }

    async do () {
        const n = await this.fetch(0);
        this.insert(n);
        const unread = this.getUnread();
        if (unread.length >= 1) this.notifyObservers();
    }

    onVisibilityChange = () => {
        this.do();
    }

    notifyObservers () {
        this.observers.forEach(observer => {
            observer.onNotifications();
        });
    }

    addObserver (observer) {
        this.observers.push(observer);
    }

    removeObserver (_id) {
        this.observers = this.observers.filter(observer => observer.observerId != _id);
    }

    get () {
        return this.entries;
    }

    async fetch (c) {
        const request = await fetch(this.URL+c, {
            method: "GET",
            headers: { "Authorization": "Bearer "+window.app.user.token }
        });
        const response = await request.json();
        if (!response.ok) throw new Error(response.error.message);
        return response.notifications;
    }

    readLast () {
        const lastId = this.get()[0].id;
        this.updateSave(lastId);
    }

    updateSave (_id) {
        const saved = localStorage.getItem('notifications');
        if (!saved) saved = "{last_id:0}";
        const parsed = JSON.parse(saved);
        parsed.last_id = _id;
        this.save(parsed);
    }

    save (_save) {
        localStorage.setItem(this.STORAGE, JSON.stringify(_save));
    }

    load () {
        return JSON.parse(localStorage.getItem(this.STORAGE) || "{last_id:0}");
    }

    getLast () {
        const saved = this.load();
        return saved.last_id;
    }

    getUnread () {
        const unread = this.get().filter(n => parseInt(n.id) > parseInt(this.getLast()));
        return unread;
    }

    insert (_entries) {
        const entries = new Array();
        for (let e = 0; e < _entries.length; e++) {
            if (this.get().find(n => parseInt(n.id) === parseInt(_entries[e].id))) continue;
            entries.push(_entries[e]);
        }
        this.set([...entries, ...this.get()]);
    }

    insertAfter (_entries) {
        const entries = new Array();
        for (let e = 0; e < _entries.length; e++) {
            if (this.get().find(n => parseInt(n.id) === parseInt(_entries[e].id))) continue;
            entries.push(_entries[e]);
        }
        this.set([...this.get(), ...entries]);
    }

    has (_n) {
        return this.entries.find(n => n.id === _n.id) ? true : false;
    }

    delete (_n) {
        this.set(this.entries.filter(n => n.id != _n.id));
    }

    set (_entries) {
        this.entries = _entries;
    }
}

export default Notifier;