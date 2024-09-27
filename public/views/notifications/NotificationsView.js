import Navigation from "../../components/navigation/navigation.js";
import Notification from "../../components/notification/notification.js";
import AbstractView from "../AbstractView.js";

export default class NotificationsView extends AbstractView {
    constructor (params) {
        super(params);
        this.viewContainer = document.createElement('div');
        this.viewContainer.classList.add('container-view', 'container-view-notifications');
        this.appContainer.appendChild(this.viewContainer);
        
        this.offset = 0;
        this.limit = 20;

        this.observerId = 'notificationsView';
        window.app.listener.removeObserver(this.observerId);
        window.app.listener.addObserver(this);

        window.app.notifier.removeObserver(this.observerId);
        window.app.notifier.addObserver(this);
    }

    onVisibilityChange = () => {
        this.drawNotifications(window.app.notifier.get());
    }

    onNotifications = () => {
        this.drawNotifications(window.app.notifier.get());
    }

    async init () {
        this.viewContainer.appendChild(window.app.nav.getNode());
        this.CreateMain();
    }

    async CreateMain () {
        this.main = document.createElement('main');
        this.main.classList.add('notifications-view-main');
        this.container_notifications = document.createElement('div');
        this.container_notifications.classList.add('container-notifications');
        this.main.appendChild(this.container_notifications);
        this.viewContainer.appendChild(this.main);

        this.drawNotifications(await window.app.notifier.fetch(0));
        this.eventScroll();
    }

    async drawNotifications (_entries) {
        const unread = window.app.notifier.getUnread();
        this.container_notifications.innerHTML = '';
        for (const n of _entries) {
            const notification = new Notification(n);
            if (unread.find(u => u.id === n.id)) notification.setUnread();
            this.container_notifications.appendChild(notification.getElement());
        }

        window.app.notifier.updateSave(window.app.notifier.get()[0].id);
    }

    eventScroll () {
        this.main.addEventListener('scroll', async () => {
            const scrollHeight = this.main.scrollHeight;
            const clientHeight = this.main.clientHeight;
            const scrollTop = this.main.scrollTop;
            const umbral = 1;

            if (scrollTop + clientHeight >= scrollHeight - umbral) {
                this.offset += this.limit;
                const notifications = await window.app.notifier.fetch(this.offset);
                window.app.notifier.insertAfter(notifications);
                this.drawNotifications(window.app.notifier.get());
            }
        });
    }
}