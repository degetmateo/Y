import { APP_CONTAINER } from "../consts.js"
import {CONTENT_NAV, EventsNavButtons} from "../views.js";

export const renderConfig = (data) => {
    console.log(window.location.pathname)
    APP_CONTAINER.innerHTML = VIEW_PROFILE_CONTENT();
    EventsNavButtons();
}

const VIEW_PROFILE_CONTENT = () => {
    return `
        <h1>Configuracion</h1>
        ${CONTENT_NAV}
    `;
}