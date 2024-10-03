import SettingsView from "./views/SettingsView.js";
import ErrorView from "./views/ErrorView.js";
// import HomeView from "./views/HomeView.js";
import LoginView from "./views/LoginView.js";
import MemberView from "./views/MemberView.js";
import AdminView from "./views/AdminView.js";
import CommentsView from "./views/comments/CommentsView.js";
import MessagesView from "./views/messages/MessagesView.js";
import NotificationsView from "./views/notifications/NotificationsView.js";
import HomeView from "./views/home/HomeView.js";

export default class Router {
    constructor () {
        this.routes = [
            { path: "/error", view: new ErrorView() },
            { path: "/", view: new HomeView() },
            { path: "/home", view: new HomeView() },
            { path: "/login", view: new LoginView() },
            { path: "/settings", view: new SettingsView() },
            { path: "/member/:username", view: new MemberView() },
            { path: "/admin", view: new AdminView() },
            { path: "/post/:id_post/comments", view: new CommentsView() },
            { path: "/messages", view: new MessagesView() },
            { path: "/notifications", view: new NotificationsView() }
        ];
    }

    execute () {
        const potentialMatches = this.routes.map(route => {
            return {
                route: route,
                result: window.location.pathname.match(this.pathToRegex(route.path))
            };
        });
    
        let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);
    
        if (!match) {
            match = {
                route: routes[0],
                result: [window.location.pathname]
            };
        };
    
        const view = match.route.view;
        view.init(this.getParams(match));
    }

    navigateTo = (url) => {
        if (window.location.pathname === url) return;
        window.history.pushState(null, null, url);
        this.execute();
    };

    pathToRegex = (path) => {
        return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
    };
    
    getParams = (match) => {
        const values = match.result.slice(1);
        const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    
        return Object.fromEntries(keys.map((key, i) => {
            return [key, values[i]];
        }));
    };
}