import { navigateTo } from "../../consts.js";

export const CreateNavigation = () => {
    const navContainer = document.getElementById('container-nav');
    navContainer.innerHTML = CONTENT_NAV;
    CreateNavigationEvents();
}

const CONTENT_NAV = `
    <nav class="nav" id="nav">
        <a class="nav-button" id="nav-button-home" href="/home"><i class="fa-solid fa-house nav-button-icon"></i> <span class="nav-button-text">Inicio</span></a>
        <a class="nav-button" id="nav-button-profile" href="/profile"><i class="fa-solid fa-user nav-button-icon"></i> <span class="nav-button-text">Perfil</span></a>
        <a class="nav-button" id="nav-button-config" href="/config"><i class="fa-solid fa-gear nav-button-icon"></i> <span class="nav-button-text">Ajustes</span></a>
        <a class="nav-button" id="nav-button-logout" href="/logout"><i class="fa-solid fa-right-from-bracket nav-button-icon"></i> <span class="nav-button-text">Cerrar Sesion</span></a>
    </nav>
`;

const CreateNavigationEvents = () => {
    document.getElementById('nav-button-home').addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/home', null);
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