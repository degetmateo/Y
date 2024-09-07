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

export default class Navigation {
    constructor () {
        this.nav = document.createElement('nav');
        this.nav.classList.add('nav');
        this.CreateButton({ text: 'Inicio', icon_on: HOME_IMAGE_ON, icon_off: HOME_IMAGE_OFF, href: '/home' });
        this.CreateButton({ text: 'Perfil', icon_on: PROFILE_IMAGE_ON, icon_off: PROFILE_IMAGE_OFF, href: '/member/'+window.app.user.username });
        
        if (window.app.user.role != 'member') {
            const button = document.createElement('a');
            button.setAttribute('data-link', '');
            button.classList.add('nav-button', 'test');
            button.href = '/messages';
            button.onclick = e => {
                e.preventDefault();
                navigateTo(button.href);
            }
            window.location.pathname.startsWith('/messages') ? 
                button.appendChild(MESSAGES_IMAGES_ON) :
                button.appendChild(MESSAGES_IMAGES_OFF);
            button.innerHTML += `
                <span class="nav-button-text">Mensajes</span>
                <span class="nav-button-status--test">TEST</span>
            `;
            this.nav.appendChild(button);
        }

        this.CreateButton({ text: 'Configuración', icon_on: SETTINGS_IMAGE_ON, icon_off: SETTINGS_IMAGE_OFF, href: '/settings' });
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

        this.nav.appendChild(button);
    }
 
    getNode () {
        return this.nav;
    }

    static Create () {
        return new Navigation().getNode();
    }
}