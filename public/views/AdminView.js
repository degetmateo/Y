import Alert from "../components/alert/alert.js";
import Navigation from "../components/navigation/navigation.js";
import {navigateTo} from "../router.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor (params) {
        super(params);
        this.setTitle('Panel de Administracion');
    }

    async init () {
        if (window.app.user.role != 'admin') return navigateTo('/home');
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = VIEW_CONTENT;
        document.getElementById('container-view').appendChild(window.app.nav.getNode());
        this.events();
    }

    events () {
        document.getElementById('button-username')
            .addEventListener('click', () => this.eventButtonUsername());
        document.getElementById('button-password')
            .addEventListener('click', () => this.eventButtonPassword());
    }

    async eventButtonUsername () {
        const inputUsername = document.getElementById('input-username');
        const inputNewUsername = document.getElementById('input-new_username');
        const username = inputUsername.value;
        const newUsername = inputNewUsername.value;
        inputUsername.value = '';
        inputNewUsername.value = '';
        const request = await fetch("/api/admin/user/update/username", {
            method: 'POST',
            headers: {
                "Authorization": "Bearer "+window.app.user.token,
                "Content-Type": "Application/JSON"
            },
            body: JSON.stringify({
                user: {
                    username: username,
                    new_username: newUsername
                }
            })
        });
        const response = await request.json();
        if (!response.ok) return Alert(response.error.message);
        new Alert('OK - username changed');
    }

    async eventButtonPassword () {
        const inputUsername = document.getElementById('input-password-username');
        const inputPassword = document.getElementById('input-password');
        const username = inputUsername.value;
        const password = inputPassword.value;
        inputUsername.value = '';
        inputPassword.value = '';
        const request = await fetch("/api/admin/user/update/password", {
            method: 'POST',
            headers: {
                "Authorization": "Bearer "+window.app.user.token,
                "Content-Type": "Application/JSON"
            },
            body: JSON.stringify({
                user: {
                    username: username,
                    password: password
                }
            })
        });
        const response = await request.json();
        if (!response.ok) return new Alert(response.error.message);
        new Alert('OK - password changed');
    }
}

const VIEW_CONTENT = `
    <div class="container-view-admin" id="container-view">
        <div class="container-mobile-form-post-create" id="container-mobile-form-post-create" style="display:none;"></div>

        <input type="text" placeholder="username" id="input-username">
        <input type="text" placeholder="new username" id="input-new_username">
        <button type="button" id="button-username">Enviar</button>
        <br><br>
        <input type="text" placeholder="username" id="input-password-username">
        <input type="password" placeholder="password" id="input-password">
        <button type="button" id="button-password">Enviar</button>
    </div>
`;