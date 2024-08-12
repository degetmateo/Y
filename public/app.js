import { navigateTo } from "./consts.js";

window.addEventListener('popstate', (event) => {
    const path = window.location.pathname;
    navigateTo(path);
})

document.addEventListener('DOMContentLoaded', () => {
    authenticate();
})

async function authenticate () {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.id || !user.username || !user.token) {
        navigateTo('/login', null)
        return;
    }

    const req = await fetch('/user/auth', {
        method: 'POST',
        headers: { 
            'Authorization': `Bearer ${user.token}`,
            "content-type": "application/json"
        },
        body: JSON.stringify({ user: user })
    })

    const res = await req.json();
    console.log(res);

    if (!res.ok) {
        localStorage.removeItem('user');
        navigateTo('/login', null)
        return;
    }

    navigateTo('/home', null)
}