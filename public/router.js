import SettingsView from "./views/SettingsView.js";
import ErrorView from "./views/ErrorView.js";
import HomeView from "./views/HomeView.js";
import LoginView from "./views/LoginView.js";
import UserView from "./views/UserView.js";
import auth from "./auth.js";

const pathToRegex = (path) => {
    return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
};

const getParams = (match) => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

export const navigateTo = (url) => {
    window.history.pushState(null, null, url);
    router();
};

const router = async () => {
    const routes = [
        { path: "/error", view: ErrorView },
        { path: "/", view: HomeView },
        { path: "/home", view: HomeView },
        { path: "/login", view: LoginView },
        { path: "/settings", view: SettingsView },
        { path: "/user/:username", view: UserView }
    ];

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: window.location.pathname.match(pathToRegex(route.path))
        };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    if (!match) {
        match = {
            route: routes[0],
            result: [window.location.pathname]
        };
    };

    const view = new match.route.view(getParams(match));
    await view.init();
};

window.addEventListener("popstate", router);

document.addEventListener('DOMContentLoaded', async () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            navigateTo(e.target.href || e.target.getAttribute('href'));
        };
    });

    if (!await auth()) {
        navigateTo('/login');
        return;
    };

    router();
});