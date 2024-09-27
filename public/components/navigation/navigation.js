import Notifications from "../../modules/Notifier.js";
import {navigateTo} from "../../router.js";

const HOME_IMAGE_OFF = new Image();
HOME_IMAGE_OFF.src = "/public/components/navigation/svg/home-off.svg";
HOME_IMAGE_OFF.classList.add('nav-button-icon');

const HOME_IMAGE_ON = new Image();
HOME_IMAGE_ON.src = '/public/components/navigation/svg/home-on.svg';
HOME_IMAGE_ON.classList.add('nav-button-icon');

const PROFILE_IMAGE_OFF = new Image();
PROFILE_IMAGE_OFF.src = '/public/components/navigation/svg/user-off.svg';
PROFILE_IMAGE_OFF.classList.add('nav-button-icon');

const PROFILE_IMAGE_ON = new Image();
PROFILE_IMAGE_ON.src = '/public/components/navigation/svg/user-on.svg';
PROFILE_IMAGE_ON.classList.add('nav-button-icon');

const SETTINGS_IMAGE_OFF = new Image();
SETTINGS_IMAGE_OFF.src = '/public/components/navigation/svg/config-off.svg';
SETTINGS_IMAGE_OFF.classList.add('nav-button-icon');

const SETTINGS_IMAGE_ON = new Image();
SETTINGS_IMAGE_ON.src = '/public/components/navigation/svg/config-on.svg'; 
SETTINGS_IMAGE_ON.classList.add('nav-button-icon');

const MESSAGES_IMAGES_ON = new Image();
MESSAGES_IMAGES_ON.src = '/public/components/navigation/svg/chat-on.svg'; 
MESSAGES_IMAGES_ON.classList.add('nav-button-icon');

const MESSAGES_IMAGES_OFF = new Image();
MESSAGES_IMAGES_OFF.src = '/public/components/navigation/svg/chat-off.svg'; 
MESSAGES_IMAGES_OFF.classList.add('nav-button-icon');

const IMAGE_NOTIFICATIONS_OFF = new Image();
IMAGE_NOTIFICATIONS_OFF.src = '/public/components/navigation/svg/notifications-off.svg'; 
IMAGE_NOTIFICATIONS_OFF.classList.add('nav-button-icon');

const IMAGE_NOTIFICATIONS_ON = new Image();
IMAGE_NOTIFICATIONS_ON.src = '/public/components/navigation/svg/notifications-on.svg'; 
IMAGE_NOTIFICATIONS_ON.classList.add('nav-button-icon');

export default class Navigation {
    constructor () {
        this.nav = document.createElement('nav');
        this.nav.classList.add('nav');

        this.buttons = new Array();

        this.homeButton = this.CreateButton({ text: 'Inicio', icon_on: HOME_IMAGE_ON, icon_off: HOME_IMAGE_OFF, href: '/home' });
        this.profileButton = this.CreateButton({ text: 'Perfil', icon_on: PROFILE_IMAGE_ON, icon_off: PROFILE_IMAGE_OFF, href: '/member/'+window.app.user.username });
        this.notificationsButton = this.CreateNotificationsButton();
        // this.messagesButton = this.CreateButton({ text: 'Mensajes', icon_on: MESSAGES_IMAGES_ON, icon_off: MESSAGES_IMAGES_OFF, href: '/messages' });
        this.settingsButton = this.CreateButton({ text: 'Configuración', icon_on: SETTINGS_IMAGE_ON, icon_off: SETTINGS_IMAGE_OFF, href: '/settings' });
    }

    CreateButton ({ text, icon_on, icon_off, href }) {
        const button = document.createElement('a');
        button.classList.add('nav-button');
        button.setAttribute('data-link', '');
        button.href = href;
        window.location.pathname === href ?
            button.appendChild(icon_on) :
            button.appendChild(icon_off);

        const buttonText = document.createElement('span');
        buttonText.classList.add('nav-button-text');
        buttonText.innerText = text;
        button.appendChild(buttonText);
        
        button.onclick = e => {
            e.preventDefault();
            navigateTo(href);
        }

        button.update = () => {
            button.innerHTML = '';
            window.location.pathname === href ?
                button.appendChild(icon_on) :
                button.appendChild(icon_off);
            button.appendChild(buttonText);
        }

        button.get = () => {
            return text;
        }

        this.nav.appendChild(button);
        this.buttons.push(button);
        return button;
    }

    CreateNotificationsButton = () => {
        const button = document.createElement('a');
        button.classList.add('nav-button');
        button.setAttribute('data-link', '');
        button.href = '/notifications';

        const iconContainer = document.createElement('div');
        iconContainer.classList.add('nav-button-icon-container');

        const iconImageContainer = document.createElement('div');
        iconImageContainer.classList.add('nav-button-icon-image-container');

        button.updateIcon = () => {
            if (iconImageContainer.children[0]) iconImageContainer.children[0].remove();
            window.location.href === button.href ?
                iconImageContainer.appendChild(IMAGE_NOTIFICATIONS_ON) :
                iconImageContainer.appendChild(IMAGE_NOTIFICATIONS_OFF);
        }

        button.updateIcon();

        const notificationsCount = document.createElement('span');
        notificationsCount.classList.add('nav-button-notifications-counter');

        iconContainer.appendChild(iconImageContainer);
        iconContainer.appendChild(notificationsCount);

        button.appendChild(iconContainer);

        const buttonText = document.createElement('span');
        buttonText.classList.add('nav-button-text');
        buttonText.innerText = 'Notificaciones';
        button.appendChild(buttonText);
        
        button.onclick = e => {
            e.preventDefault();
            navigateTo(button.href);
            button.setCount(0);
        }

        button.update = () => {
            button.updateIcon();
        }

        button.setCount = (count) => {
            notificationsCount.innerText = count;
            if (count > 0) {
                notificationsCount.classList.add('nav-button-notifications-counter--active');
            } else {
                notificationsCount.classList.remove('nav-button-notifications-counter--active');
            }
        }

        button.get = () => {
            return button.href;
        }


        this.nav.appendChild(button);
        this.buttons.push(button);
        return button;
    }

    getNode () {
        this.update();
        return this.nav;
    }

    update () {
        this.buttons.forEach(button => button.update());
    }

    onNotifications () {
        const notifications = window.app.notifier.getUnread();
        if (window.location.pathname === '/notifications') {
            this.notificationsButton.setCount(0);
        } else {
            this.notificationsButton.setCount(notifications.length);
        }
    }
}