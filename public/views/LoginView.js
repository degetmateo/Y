import auth from "../auth.js";
import { navigateTo } from "../router.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor (params) {
        super(params);
        this.setTitle('Iniciar Sesion');
    }

    async init () {
        if (await auth()) {
            navigateTo('/home');
            return;
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

        const inputName = document.getElementById('form-register-input-name');
        const inputUsername = document.getElementById('form-register-input-username');
        const inputPassword = document.getElementById('form-register-input-password');
        const inputPassConfirm = document.getElementById('form-register-input-password-confirmation');

        const name = inputName.value;
        const username = inputUsername.value;
        const password = inputPassword.value;
        const passwordConfirmation = inputPassConfirm.value;

        if (password != passwordConfirmation) {
            alert('Contraseñas no coinciden.')
            return;
        }

        const request = await fetch('/user/register', {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ user: { name: name, username: username, password: password } })
        });
        const res = await request.json();

        if (res.ok) {
            localStorage.setItem('user', JSON.stringify({ id: res.user.id, username: res.user.username, token: res.user.token }));
            window.app.user.id = res.user.id;
            window.app.user.username = res.user.username;
            window.app.user.token = res.user.token;
            if(!await auth()) {
                return;
            }
            navigateTo('/home');
        } else {
            console.error(res.error.message);
            alert(res.error.message)
        }
    }

    async eventLogin (event) {
        event.preventDefault()

        const inputUsername = document.getElementById('form-login-input-username');
        const inputPassword = document.getElementById('form-login-input-password');

        const name = inputUsername.value;
        const password = inputPassword.value;

        const request = await fetch('/user/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: { username: name, password: password } })
        });
        const response = await request.json();

        if (!response.ok) {
            alert(response.error.message);
            return;
        }
        localStorage.setItem('user', JSON.stringify({ id: response.user.id, username: response.user.username, token: response.user.token }));
        window.app.user.id = response.user.id;
        window.app.user.username = response.user.username;
        window.app.user.token = response.user.token;
        if(!await auth()) {
            return;
        }
        navigateTo('/home');
    }
}

const VIEW_CONTENT = `
    <div class="container-view-login" id="container-view-login">
        <div class="">
            <h3>Registrarse</h3>

                <form class="form" action="/" method="post" id="form-register">
                    <input placeholder="Nombre de Perfil" type="text" name="input-name" id="form-register-input-name" required>
                    <input placeholder="username" type="text" name="input-name" id="form-register-input-username" required>
                    <input placeholder="Contraseña" type="password" name="input-password" id="form-register-input-password" required>
                    <input placeholder="Confirme Pass" type="password" name="input-password-confirmation" id="form-register-input-password-confirmation" required>
                    <button type="submit">Enviar</button>
                </form>        
        </div>

        <div class="">
            <h3>Iniciar Sesion</h3>

                <form class="form" action="/" method="post" id="form-login">
                    <input placeholder="username" type="text" name="form-login-input-name" id="form-login-input-username" required>
                    <input placeholder="Contraseña" type="password" name="form-login-input-password" id="form-login-input-password" required>
                    <button type="submit">Enviar</button>
                </form> 
        </div>
    </div>
`;