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
    }

    async init () {
        this.viewContainer.appendChild(Navigation.Create());
        this.CreateMain();
    }

    async CreateMain () {
        this.main = document.createElement('main');
        this.main.classList.add('notifications-view-main');
        this.container_notifications = document.createElement('div');
        this.container_notifications.classList.add('container-notifications');
        this.main.appendChild(this.container_notifications);
        this.viewContainer.appendChild(this.main);

        this.notifications = await this.FetchNotifications();
        this.drawNotifications();
        this.eventScroll();
    }

    async FetchNotifications () {
        const request = await fetch('/api/notifications/'+this.offset, {
            method: "GET",
            headers: { "Authorization": "Bearer "+window.app.user.token }
        });
        const response = await request.json();
        if (!response.ok) throw new Error(response.error.message);
        return response.notifications;
    }

    drawNotifications () {
        this.container_notifications.innerHTML = '';
        for (const n of this.notifications) {
            const notification = new Notification(n);
            this.container_notifications.appendChild(notification.getElement());
        }
    }

    eventScroll () {
        this.main.addEventListener('scroll', async () => {
            const scrollHeight = this.main.scrollHeight;
            const clientHeight = this.main.clientHeight;
            const scrollTop = this.main.scrollTop;
            const umbral = 1;

            if (scrollTop + clientHeight >= scrollHeight - umbral) {
                this.offset += this.limit;
                const notifications = await this.FetchNotifications();
                for (const n of notifications) {
                    this.notifications.push(n);
                }
                this.drawNotifications();
            }
        });
    }
}