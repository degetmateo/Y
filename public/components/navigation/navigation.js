import {navigateTo} from "../../router.js";

const HOME_IMAGE_OFF = `<img class="nav-button-icon" src="/public/components/navigation/svg/home-off.svg" />`;
const HOME_IMAGE_ON = `<img class="nav-button-icon" src="/public/components/navigation/svg/home-on.svg" />`;
const PROFILE_IMAGE_OFF = `<img class="nav-button-icon" src="/public/components/navigation/svg/user-off.svg" />`;
const PROFILE_IMAGE_ON = `<img class="nav-button-icon" src="/public/components/navigation/svg/user-on.svg" />`; 
const SETTINGS_IMAGE_OFF = `<img class="nav-button-icon" src="/public/components/navigation/svg/config-off.svg" />`;
const SETTINGS_IMAGE_ON = `<img class="nav-button-icon" src="/public/components/navigation/svg/config-on.svg" />`;

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
        this.buttonHome.innerHTML = (window.location.pathname === '/home' ? HOME_IMAGE_ON : HOME_IMAGE_OFF) + this.HOME_TEXT;
        this.buttonHome.onclick = e => {
            e.preventDefault();
            navigateTo(this.buttonHome.href);
        } 

        this.buttonProfile = document.createElement('a');
        this.buttonProfile.classList.add('nav-button');
        this.buttonProfile.setAttribute('data-link', '');
        this.buttonProfile.href = '/member/'+window.app.user.username;
        this.buttonProfile.innerHTML = (window.location.pathname === '/member/'+window.app.user.username ? PROFILE_IMAGE_ON : PROFILE_IMAGE_OFF) + this.PROFILE_TEXT;
        this.buttonProfile.onclick = e => {
            e.preventDefault();
            navigateTo(this.buttonProfile.href);
        } 

        this.buttonSettings = document.createElement('a');
        this.buttonSettings.classList.add('nav-button');
        this.buttonSettings.setAttribute('data-link', '');
        this.buttonSettings.href = '/settings';
        this.buttonSettings.innerHTML = (window.location.pathname === '/settings' ? SETTINGS_IMAGE_ON : SETTINGS_IMAGE_OFF) + this.SETTINGS_TEXT;
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