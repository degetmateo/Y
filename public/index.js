import auth from "./auth.js";
import Navigation from "./components/navigation/navigation.js";
import Listener from "./modules/Listener.js";
import Notifier from "./modules/Notifier.js";
import { navigateTo, router } from "./router.js";

window.app = {
    alerts: new Array(),

    user: {
        id: -1,
        name: '',
        username: '',
        token: '',
        role: '',
        profilePic: {
            url: '',
            crop: {
                x: -1,
                y: -1,
                w: -1,
                h: -1
            }
        }
    },

    views: {
        home: {
            timelines: {
                global: {
                    posts: new Array()
                },
                following: {
                    posts: new Array()
                }
            }
        },

        member: {
            members: new Array()
        }
    }
}

if (!localStorage.getItem('notifications')) localStorage.setItem('notifications', JSON.stringify({ last_id: 0 }));

window.addEventListener("popstate", router);

document.addEventListener('DOMContentLoaded', async () => {
    document.body.addEventListener("click", (e) => {
        if (e.target.matches("[data-link]") || e.target.hasAttribute('data-link')) {
            e.preventDefault();
            navigateTo(e.target.href || e.target.getAttribute('href'));
        };
    });

    if (!await auth()) {
        navigateTo('/login');
    };

    init();
    router();
});

export const init = () => {
    window.app.notifier = new Notifier();
    window.app.listener = new Listener();
    window.app.listener.addObserver(window.app.notifier);

    window.app.nav = new Navigation();
    window.app.notifier.addObserver(window.app.nav);
    window.app.notifier.init();
}