import {navigateTo} from "../../router.js";

export const CreateNavigation = (home) => {
    const navContainer = document.getElementById('container-nav');
    navContainer.innerHTML = CONTENT_NAV;
    CreateNavigationEvents(home);
}

const CONTENT_NAV = `
    <nav class="nav" id="nav">
        <a class="nav-button" id="nav-button-home" href="/home"><i class="fa-solid fa-house nav-button-icon"></i> <span class="nav-button-text">Inicio</span></a>
        <a class="nav-button" id="nav-button-profile" href="/profile"><i class="fa-solid fa-user nav-button-icon"></i> <span class="nav-button-text">Perfil</span></a>
        <a class="nav-button" id="nav-button-config" href="/config"><i class="fa-solid fa-gear nav-button-icon"></i> <span class="nav-button-text">Configuración</span></a>
    </nav>
`;

const CreateNavigationEvents = (home) => {
    document.getElementById('nav-button-home').addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/home');
    });

    document.getElementById('nav-button-config').addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/settings');
    });

    document.getElementById('nav-button-profile').addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/user/'+window.app.user.username);
    });
}