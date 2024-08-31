import {navigateTo} from "../../router.js";
// import {HOME_SELECTED, HOME_UNSELECTED, PROFILE_SELECTED, PROFILE_UNSELECTED, SETTINGS_SELECTED, SETTINGS_UNSELECTED} from "./svg/icons.js";

export const CreateNavigation = (home) => {
    const navContainer = document.getElementById('container-nav');

    let homeImg = `<img src="/public/views/templates/svg/home-off.svg" />`;
    let profileImg = `<img class="nav-button-icon" src="/public/views/templates/svg/user-off.svg" />`;
    let settingsImg = `<img class="nav-button-icon" src="/public/views/templates/svg/config-off.svg" />`;

    if (window.location.pathname === '/home') {
        homeImg = `<img class="nav-button-icon" src="/public/views/templates/svg/home-on.svg" />`;
        profileImg = `<img class="nav-button-icon" src="/public/views/templates/svg/user-off.svg" />`;
        settingsImg = `<img class="nav-button-icon" src="/public/views/templates/svg/config-off.svg" />`;
    } else if (window.location.pathname === '/settings') {
        homeImg = `<img class="nav-button-icon" src="/public/views/templates/svg/home-off.svg" />`;
        profileImg = `<img class="nav-button-icon" src="/public/views/templates/svg/user-off.svg" />`;
        settingsImg = `<img class="nav-button-icon" src="/public/views/templates/svg/config-on.svg" />`;
    } else if (window.location.pathname === "/user/"+window.app.user.username){
        homeImg = `<img class="nav-button-icon" src="/public/views/templates/svg/home-off.svg" />`;
        profileImg = `<img class="nav-button-icon" src="/public/views/templates/svg/user-on.svg" />`;
        settingsImg = `<img class="nav-button-icon" src="/public/views/templates/svg/config-off.svg" />`;
    } else {
        homeImg = `<img class="nav-button-icon" src="/public/views/templates/svg/home-off.svg" />`;
        profileImg = `<img class="nav-button-icon" src="/public/views/templates/svg/user-off.svg" />`;
        settingsImg = `<img class="nav-button-icon" src="/public/views/templates/svg/config-off.svg" />`;
    }

    const CONTENT_NAV = `
        <nav class="nav" id="nav">
            <a class="nav-button" id="nav-button-home" href="/home">
                <div class="container-nav-button-icon">
                    ${homeImg}
                </div>
                <span class="nav-button-text">Inicio</span>
            </a>
            
            <a class="nav-button" id="nav-button-profile" href="/profile">
                <div class="container-nav-button-icon">
                    ${profileImg}
                </div>
                <span class="nav-button-text">Perfil</span>
            </a>
            <a class="nav-button" id="nav-button-config" href="/config">
                <div class="container-nav-button-icon">
                    ${settingsImg}
                </div>
                <span class="nav-button-text">Configuración</span>
            </a>
        </nav>
    `;

    navContainer.innerHTML = CONTENT_NAV;
    CreateNavigationEvents(home);
}

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