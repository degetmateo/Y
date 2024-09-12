import Navigation from "../../components/navigation/navigation.js";
import AbstractView from "../AbstractView.js";

export default class NotificationsView extends AbstractView {
    constructor (params) {
        super(params);
        this.viewContainer = document.createElement('div');
        this.viewContainer.classList.add('container-view', 'container-view-notifications');
        this.appContainer.appendChild(this.viewContainer);
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
    }

    async FetchNotifications () {
        const request = await fetch('/api/notifications/0', {
            method: "GET",
            headers: { "Authorization": "Bearer "+window.app.user.token }
        });
        const response = await request.json();
        if (!response.ok) throw new Error(response.error.message);
        console.log(response.notifications)
        return response.notifications;
    }

    drawNotifications () {
        this.container_notifications.innerHTML = '';
        for (const n of this.notifications) {
            const notification = new Notification(n);
            this.container_notifications.appendChild(notification.getElement());
            this.container_notifications.innerHTML += '<br>';
        }
    }
}

class Notification {
    notification = {
        id: '',
        date: '',
        type: '',
        target_member: {
            id: '',
            name: '',
            username: '',
            role: '',
            pic: ''
        },
        target_post: {
            id: '',
            id_post_replied: '',
            content: '',
            date: '',
            images: ''
        }
    }

    constructor (_notification) {
        this.notification = _notification;
        this.container = document.createElement('div');
        this.container.classList.add('container-notification', 'container-notification--'+this.notification.type_notification);
        this.Create();
    }

    getElement () {
        return this.container;
    }

    remove () {
        this.container.remove();
    }

    Create () {
       if (this.notification.type === 'comment') this.CreateNotificationComment();
       if (this.notification.type === 'upvote') this.CreateNotificationUpvote();
       if (this.notification.type === 'follow') this.CreateNotificationFollow();
        this.container.innerHTML = `
            <p>TYPE: ${this.notification.type}</p>
            <p>MEMBER TRIGGER: ${this.notification.target_member.username}</p>
            ${this.notification.type === 'follow' ?
                '' :
                `<p>CONTENT: ${this.notification.target_post.content}</p>
                <p>URL: <a href="/post/${this.notification.target_post.id}/comments">/post/${this.notification.target_post.id}/comments<a></p>`
            }
        `;
    }

    CreateNotificationComment () {

    }

    CreateNotificationUpvote () {

    }

    CreateNotificationFollow () {

    }
}