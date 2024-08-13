import {navigateTo} from "./consts.js";

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
        navigateTo('/profile', null);
    })

    document.getElementById('nav-button-logout').addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.removeItem('user');
        navigateTo('/login', null)
    })
}