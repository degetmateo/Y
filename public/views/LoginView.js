import auth from "../auth.js";
import Alert from "../components/alert/alert.js";
import {init} from "../index.js";
import { navigateTo } from "../router.js";
import AbstractView from "./AbstractView.js";

export default class LoginView extends AbstractView {
    constructor (params) {
        super(params);
        this.setTitle('Iniciar Sesion');
    }

    async init () {
        if (await auth()) {
            return navigateTo('/home');
        };
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = VIEW_CONTENT;
        await this.events();
    }

    async events () {
        const formRegister = document.getElementById('form-register');
        const formLogin = document.getElementById('form-login');
        formRegister.addEventListener('submit', this.eventRegister);
        formLogin.addEventListener('submit', this.eventLogin);
    }

    async eventRegister (event) {
        event.preventDefault();

        const inputUsername = document.getElementById('form-register-input-username');
        const inputPassword = document.getElementById('form-register-input-password');
        const inputPassConfirm = document.getElementById('form-register-input-password-confirmation');

        const username = inputUsername.value;
        const password = inputPassword.value;
        const passwordConfirmation = inputPassConfirm.value;

        if (password != passwordConfirmation) return new Alert('Las contraseñas no coinciden.');

        const request = await fetch('/api/member/register', {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ user: { username: username, password: password } })
        });
        const res = await request.json();

        if (res.ok) {
            localStorage.setItem('user', JSON.stringify({ id: res.user.id, username: res.user.username, token: res.user.token }));
            window.app.user.id = res.user.id;
            window.app.user.username = res.user.username;
            window.app.user.token = res.user.token;
            await redirect();
        } else {
            console.error(res.error.message);
            return new Alert(res.error.message);
        }
    }

    async eventLogin (event) {
        event.preventDefault()

        const inputUsername = document.getElementById('form-login-input-username');
        const inputPassword = document.getElementById('form-login-input-password');

        const name = inputUsername.value;
        const password = inputPassword.value;

        const request = await fetch('/api/member/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: { username: name, password: password } })
        });
        const response = await request.json();

        if (!response.ok) {
            return new Alert(response.error.message);
        }
        localStorage.setItem('user', JSON.stringify({ id: response.user.id, username: response.user.username, token: response.user.token }));
        window.app.user.id = response.user.id;
        window.app.user.username = response.user.username;
        window.app.user.token = response.user.token;
        await redirect();
    }
}

const redirect = async () => {
    if (!await auth()) {
        return;
    }
    init();
    navigateTo('/home');
}

const VIEW_CONTENT = `
    <div>
        <div class="container-view-login">
            <div class="container-forms">
                <div class="container-form">
                    <p>Crear una Cuenta</p>
                    <form class="form" action="/" method="post" id="form-register">
                        <input placeholder="Nombre de Usuario" type="text" name="input-name" id="form-register-input-username" required>
                        <input placeholder="Contraseña" type="password" name="input-password" id="form-register-input-password" required>
                        <input placeholder="Confirmar Contraseña" type="password" name="input-password-confirmation" id="form-register-input-password-confirmation" required>
                        <button type="submit">Enviar</button>
                    </form>    
                </div>

                <div class="container-form">
                    <p>Iniciar Sesión</p>
                    <form class="form" action="/" method="post" id="form-login">
                        <input placeholder="Nombre de Usuario" type="text" name="form-login-input-name" id="form-login-input-username" required>
                        <input placeholder="Contraseña" type="password" name="form-login-input-password" id="form-login-input-password" required>
                        <button type="submit">Enviar</button>
                    </form> 
                </div>
            <div>
        </div>
    </div>
`;