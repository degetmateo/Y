import { APP_CONTAINER, updateContent } from "../consts.js";

export const viewUser = () => {
    APP_CONTAINER.innerHTML = VIEW_CONTENT;
    document.title = 'Y - Acceder'
    setEventFormRegister();
    setEventFormLogin();
}

function setEventFormRegister () {
    const form = document.getElementById('form-register');
    const inputName = document.getElementById('input-name');
    const inputPassword = document.getElementById('input-password');

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const name = inputName.value;
        const password = inputPassword.value;
        const req = await fetch('/user/register', {
            method: 'POST',
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ user: { name: name, password: password } })
        });
        console.log(req)
        const res = await req.json();

        if (res.ok) {
            localStorage.setItem('user', JSON.stringify({ id: res.user.id, name: res.user.name, token: res.user.token }));
            updateContent('home')
        } else {
            console.error(res.error.message);
            alert(res.error.message)
        }
    })
}

function setEventFormLogin () {
    const form = document.getElementById('form-login')
    const inputName = document.getElementById('form-login-input-name')
    const inputPassword = document.getElementById('form-login-input-password')

    form.addEventListener('submit', async event => {
        event.preventDefault()

        const name = inputName.value;
        const password = inputPassword.value;

        const request = await fetch('/user/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user: { name: name, password: password } })
        })

        const response = await request.json();

        if (!response.ok) {
            alert(response.error.message)
            console.error(response.message)
            return;
        }

        console.log('USER:', response.user);
        localStorage.setItem('user', JSON.stringify({ id: response.user.id, name: response.user.name, token: response.user.token }));
        updateContent('home')
    })
}

const VIEW_CONTENT = `
    <p>AVISO: Todas las cuentas y publicaciones son temporales. Se eliminarán cada vez que el servidor se reinicie hasta que se establezca un sistema de almacenamiento, por lo que no te compliques creando un nombre de usuario.</p>
    <h3>Registrarse</h3>
    <form action="/" method="post" id="form-register">
        <input placeholder="Nombre de Usuario" type="text" name="input-name" id="input-name" required>
        <input placeholder="Contraseña" type="password" name="input-password" id="input-password" required>
        <button type="submit">Enviar</button>
    </form>
    <h3>Iniciar Sesion</h3>
    <form action="/" method="post" id="form-login">
        <input placeholder="Nombre de Usuario" type="text" name="form-login-input-name" id="form-login-input-name" required>
        <input placeholder="Contraseña" type="password" name="form-login-input-password" id="form-login-input-password" required>
        <button type="submit">Enviar</button>
    </form>
`;