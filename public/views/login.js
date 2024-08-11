import { APP_CONTAINER, navigateTo } from "../consts.js";

export const renderLogin = (data) => {
    APP_CONTAINER.innerHTML = VIEW_CONTENT;
    document.title = 'miau - Acceder'
    setEventFormRegister();
    setEventFormLogin();
}

function setEventFormRegister () {
    const form = document.getElementById('form-register');

    const inputName = document.getElementById('form-register-input-name')
    const inputUsername = document.getElementById('form-register-input-username');
    const inputPassword = document.getElementById('form-register-input-password');

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const name = inputName.value;
        const username = inputUsername.value;
        const password = inputPassword.value;
        const req = await fetch('/user/register', {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ user: { name: name, username: username, password: password } })
        });
        console.log(req)
        const res = await req.json();

        if (res.ok) {
            localStorage.setItem('user', JSON.stringify({ id: res.user.id, username: res.user.username, token: res.user.token }));
            navigateTo('/home', null)
        } else {
            console.error(res.error.message);
            alert(res.error.message)
        }
    })
}

function setEventFormLogin () {
    const form = document.getElementById('form-login')
    const inputUsername = document.getElementById('form-login-input-username')
    const inputPassword = document.getElementById('form-login-input-password')

    form.addEventListener('submit', async event => {
        event.preventDefault()

        const name = inputUsername.value;
        const password = inputPassword.value;

        const request = await fetch('/user/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: { username: name, password: password } })
        })

        const response = await request.json();

        if (!response.ok) {
            alert(response.error.message)
            return;
        }

        console.log('USER:', response.user);
        localStorage.setItem('user', JSON.stringify({ id: response.user.id, username: response.user.username, token: response.user.token }));
        navigateTo('/home', null)
    })
}

const VIEW_CONTENT = `
    <div class="container-view-login" id="container-view-login">
        <div class="">
            <h3>Registrarse</h3>

                <form class="form" action="/" method="post" id="form-register">
                    <input placeholder="Nombre de Perfil" type="text" name="input-name" id="form-register-input-name" required>
                    <input placeholder="@username" type="text" name="input-name" id="form-register-input-username" required>
                    <input placeholder="Contraseña" type="password" name="input-password" id="form-register-input-password" required>
                    <button type="submit">Enviar</button>
                </form>        
        </div>

        <div class="">
            <h3>Iniciar Sesion</h3>

                <form class="form" action="/" method="post" id="form-login">
                    <input placeholder="@username" type="text" name="form-login-input-name" id="form-login-input-username" required>
                    <input placeholder="Contraseña" type="password" name="form-login-input-password" id="form-login-input-password" required>
                    <button type="submit">Enviar</button>
                </form> 
        </div>
    </div>
`;