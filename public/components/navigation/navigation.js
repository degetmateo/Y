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

export default class Navigation {
    constructor () {
        this.HOME_TEXT = '<span class="nav-button-text">Inicio</span>';
        this.PROFILE_TEXT = '<span class="nav-button-text">Perfil</span>';
        this.SETTINGS_TEXT = '<span class="nav-button-text">Configuración</span>';

        this.nav = document.createElement('nav');
        this.nav.classList.add('nav');
    
        this.buttonHome = document.createElement('a');
        this.buttonHome.classList.add('nav-button');
        this.buttonHome.setAttribute('data-link', '');
        this.buttonHome.href = '/home';
        window.location.pathname === '/home' ?
            this.buttonHome.appendChild(HOME_IMAGE_ON) :
            this.buttonHome.appendChild(HOME_IMAGE_OFF);
        this.buttonHome.innerHTML += this.HOME_TEXT;
        this.buttonHome.onclick = e => {
            e.preventDefault();
            navigateTo(this.buttonHome.href);
        } 

        this.buttonProfile = document.createElement('a');
        this.buttonProfile.classList.add('nav-button');
        this.buttonProfile.setAttribute('data-link', '');
        this.buttonProfile.href = '/member/'+window.app.user.username;
        window.location.pathname === '/member/'+window.app.user.username ?
            this.buttonProfile.appendChild(PROFILE_IMAGE_ON) :
            this.buttonProfile.appendChild(PROFILE_IMAGE_OFF);
        this.buttonProfile.innerHTML += this.PROFILE_TEXT;
        this.buttonProfile.onclick = e => {
            e.preventDefault();
            navigateTo(this.buttonProfile.href);
        } 

        this.buttonSettings = document.createElement('a');
        this.buttonSettings.classList.add('nav-button');
        this.buttonSettings.setAttribute('data-link', '');
        this.buttonSettings.href = '/settings';
        window.location.pathname === '/settings' ?
            this.buttonSettings.appendChild(SETTINGS_IMAGE_ON) :
            this.buttonSettings.appendChild(SETTINGS_IMAGE_OFF);
        this.buttonSettings.innerHTML += this.SETTINGS_TEXT;
        this.buttonSettings.onclick = e => {
            e.preventDefault();
            navigateTo(this.buttonSettings.href);
        } 

        this.nav.appendChild(this.buttonHome);
        this.nav.appendChild(this.buttonProfile);
        this.nav.appendChild(this.buttonSettings);
    }

    getNode () {
        return this.nav;
    }

    static Create () {
        return new Navigation().getNode();
    }
}