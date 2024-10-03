import AbstractView from "../AbstractView.js";
import { view, main, timeline } from "./components/view.js";

export default class HomeView extends AbstractView {
    constructor () {
        super();

        this.view = view;
        this.main = main;
        this.timeline = timeline;

        this.cooldown = false;
        this.observerId = 'home';

        let savedHome = localStorage.getItem('home');
        if (!savedHome) savedHome = { mode: "global" };
        localStorage.setItem('home', JSON.stringify(savedHome));
        this.mode = savedHome.mode;

        this.timelineScroll = 0;
        this.LIMIT = 20;
        this.offset = 0;

        this.posts = {
            global: new Array(),
            following: new Array()
        }
    }

    async init (_params) {
        this.params = _params;
        this.clear();
        this.view.appendChild(window.app.nav.getNode());
        this.appContainer.append(this.view);
    }
}