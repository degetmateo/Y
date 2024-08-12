import { renderLogin } from "./views/login.js";
import { renderHome } from "./views/home.js"
import { renderConfig } from "./views/config.js";
import { renderProfile } from './views/profile.js';

import {navigateTo} from "./consts.js";

export const VIEWS = {
    '/login': renderLogin,
    '/home': renderHome,
    '/config': renderConfig,
    '/profile': renderProfile
}

export const CONTENT_NAV = `
    <nav>
        <a id="nav-button-home" href="/home">Inicio</a>
        <a id="nav-button-profile" href="/profile">Perfil</a>
        <a id="nav-button-config" href="/config">Ajustes</a>
        <a id="nav-button-logout" href="/logout">Cerrar Sesion</a>
    </nav>
`;

export const EventsNavButtons = () => {
    document.getElementById('nav-button-home').addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/home', null)
    })

    document.getElementById('nav-button-config').addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/config', null);
    })

    document.getElementById('nav-button-profile').addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/profile', JSON.parse(localStorage.getItem('user')));
    })

    document.getElementById('nav-button-logout').addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('user');
        navigateTo('/login', null)
    })
}