import { updateContent } from "./consts.js";

document.addEventListener('DOMContentLoaded', () => {
    authUser();
})

async function authUser () {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id || !user.name || !user.token) return updateContent('user');

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
        updateContent('user');
        return;
    }

    updateContent('home');
}