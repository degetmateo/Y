import { navigateTo } from "./consts.js";
import { app } from "./model.js";

window.addEventListener('popstate', (event) => {
    event.preventDefault();
    navigateTo(window.location.pathname);
})

document.addEventListener('DOMContentLoaded', async () => {
    const isUserAuthenticated = await authenticate();
    if (!isUserAuthenticated) {
        navigateTo('/login', null);
        return;
    }
    navigateTo(window.location.pathname);
})

export async function authenticate () {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id || !userData.username || !userData.token) {
        return false;
    }
    const req = await fetch('/user/auth', {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${userData.token}`,
            "content-type": "application/json"
        },
        body: JSON.stringify({ user: userData })
    })
    const res = await req.json();
    if (!res.ok) {
        localStorage.removeItem('user');
        return false;
    }

    app.user = res.user;
    console.log(app.user)
    return true;
}