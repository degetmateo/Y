import AbstractView from "./AbstractView.js";
import { navigateTo } from '../router.js';
import {CreateNavigation} from "./templates/nav.js";
import {loadImage} from "../helpers.js";

export default class extends AbstractView {
    constructor (params) {
        super(params);
        this.setTitle('Configuracion');
    }

    async init () {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = VIEW;
        CreateNavigation();
        await this.events();
    }

    async events () {
        this.eventButtonLogout();
        this.eventInputBio();
        this.eventName();
        this.eventUsername();
        this.eventPassword();
        this.eventInputImageUrl();
    }

    eventButtonLogout () {
        document.getElementById('button-logout').addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('user');
            navigateTo('/login');
        });
    }

    eventInputBio () {
        document.getElementById('settings-bio-button')
            .addEventListener('click', () => this.updateBio());
    }

    eventName () {
        document.getElementById('settings-name-button')
            .addEventListener('click', () => this.updateName());
    }

    eventUsername () {
        document.getElementById('settings-button-username')
            .addEventListener('click', () => this.updateUsername());
    }

    eventPassword () {
        document.getElementById('settings-button-password')
            .addEventListener('click', () => this.updatePassword());
    }

    eventInputImageUrl () {
        const button = document.getElementById('load-button');
        button.addEventListener('click', () => this.loadImage());
    }

    async updateUsername () {
        const inputUsername = document.getElementById('settings-input-username');   
        const username = inputUsername.value;
        if (username.length <= 0) return alert('Username: Desde 1 caracter.');
        if (username.length > 16) return alert('Username: Hasta 16 caracteres.');
        inputUsername.value = '';
        const request = await fetch ('/api/user/update/username', {
            method: 'POST',
            headers: { 
                "Authorization": "Bearer " + window.app.user.token,
                "Content-Type": "Application/JSON"
            },
            body: JSON.stringify({ user: window.app.user, username })
        });
        const response = await request.json();
        if (!response.ok) return alert(response.error.message);
        alert("Nombre de usuario actualizado.");
    }

    async updateName () {
        const inputName = document.getElementById('settings-input-name'); 
        const name = inputName.value;
        if (name.length <= 0) return alert('Nombre: Desde 1 caracter.');
        if (name.length > 16) return alert('Nombre: Hasta 16 caracteres.');
        inputName.value = '';
        const request = await fetch ('/api/user/update/name', {
            method: 'POST',
            headers: { 
                "Authorization": "Bearer " + window.app.user.token,
                "Content-Type": "Application/JSON"
            },
            body: JSON.stringify({ user: window.app.user, name })
        });
        const response = await request.json();
        if (!response.ok) return alert(response.error.message);
        alert("Nombre actualizado.");
    }

    async updateBio () {
        const input = document.getElementById('settings-bio-input');
        const content = input.value;
        const user = JSON.parse(localStorage.getItem('user'));
        const request = await fetch ('/api/user/update/bio', {
            method: 'POST',
            headers: { 
                "Authorization": "Bearer " + user.token,    
                "Content-Type": "Application/JSON"
            },
            body: JSON.stringify({
                user,
                bio: content
            })
        });
        const response = await request.json();
        if (!response.ok) {
            return alert(response.error.message);
        }
        alert('Biografia actualizada correctamente.');
    }

    async updatePassword () {
        const inputPassword = document.getElementById('settings-input-password');
        const inputNewPassword = document.getElementById('settings-input-new_password');
        const inputNewPasswordConfirm = document.getElementById('settings-input-new_password-confirm');
        const password = inputPassword.value;
        const newPassword = inputNewPassword.value;
        const newPasswordConfirm = inputNewPasswordConfirm.value;
        if (!password || password.length <= 0) return alert('Debes ingresar tu contraseña actual.');
        if (!newPassword || newPassword.length <= 5) return alert('Debes ingresar una nueva contraseña más larga.');
        if (newPassword != newPasswordConfirm) return alert('Tu nueva contraseña y su confirmación no coinciden.');
        inputPassword.value = '';
        inputNewPassword.value = '';
        inputNewPasswordConfirm.value = '';
        const request = await fetch('/api/user/update/password', {
            method: 'POST',
            headers: {
                "Authorization": "Bearer "+window.app.user.token,
                "Content-Type": "Application/JSON"
            },
            body: JSON.stringify({ user: { password, new_password: newPassword } })
        });
        const response = await request.json();
        if (!response.ok) return alert(response.error.message);
        alert('Contraseña actualizada.'); 
    }

    async loadImage () {
        const inputImageURL = document.getElementById('input-image-url');
        if (!inputImageURL.value) return alert('Debes ingresar un enlace.');

        let image;

        try {
            image = await loadImage(inputImageURL.value);
            await this.uploadImage(image);
        } catch (error) {
            alert(error.message);
            return;
        }
    }

    drawImage (image) {
        const imageContainer = document.getElementById('container-image');
        imageContainer.innerHTML = '';
        imageContainer.appendChild(image);
    }

    async uploadImage (image) {
        const user = JSON.parse(localStorage.getItem('user'));

        const request = await fetch("/api/user/update/picture", {
            method: 'POST',
            headers: {
                "Authorization": 'Bearer ' + user.token,
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                user,
                image: {
                    url: image.src,
                    view: { x: null, y: null, w: null, h: null }
                }
            })
        })

        const response = await request.json();
        
        if (!response.ok) {
            throw new Error(response.error.message);
        }
        
        window.app.user.profilePic = {
            url: image.src,
            crop: {
                x: 0,
                y: 0,
                w: 0,
                h: 0
            }
        }
        
        alert('Imagen de perfil actualizada.');
    }
}

const VIEW = `
    <div class="container-settings-view">
        <div class="container-mobile-form-post-create" id="container-mobile-form-post-create" style="display:none;"></div>
        <div class="container-nav" id="container-nav"></div>

        <div class="container-main">
            <div class="container-button-logout">
                <a class="button-logout" id="button-logout" href="#"><span>Cerrar Sesion</span></a>
            </div>

            <div class="container-settings">
                <div class="container-settings-bio">
                    <div class="container-settings-bio-title">
                        <p class="settings-title">
                            Modificar Biografia
                        </p>
                    </div>

                    <div class="container-settings-bio-input">
                        <textarea class="settings-bio-input" id="settings-bio-input" placeholder="Escribe tu biografia."></textarea>
                    </div>

                    <div class="container-settings-bio-button">
                        <button type="button" id="settings-bio-button" class="settings-bio-button">Enviar</button>
                    </div>
                </div>
            </div>

            <div class="container-settings">
                <div class="container-settings-title">
                    <p class="settings-title">
                        Cambiar Nombre de Perfil
                    </p>
                </div>

                <div class="container-settings-name">
                    <div class="container-settings-bio-input">
                        <input type="text" class="settings-pfp-img-input" id="settings-input-name" placeholder="Nombre" />
                    </div>

                    <div class="container-settings-bio-button">
                        <button type="button" id="settings-name-button" class="settings-bio-button">Enviar</button>
                    </div>
                </div>
            </div>

            <div class="container-settings">
                <div class="container-settings-title">
                    <p class="settings-title">
                        Cambiar Contraseña
                    </p>
                </div>

                <div class="container-settings-name">
                    <div class="container-settings-bio-input">
                        <input type="password" class="settings-pfp-img-input" id="settings-input-password" placeholder="Tu Contraseña" />
                    </div>

                    <div class="container-settings-bio-input">
                        <input type="password" class="settings-pfp-img-input" id="settings-input-new_password" placeholder="Nueva Contraseña" />
                    </div>

                    <div class="container-settings-bio-input">
                        <input type="password" class="settings-pfp-img-input" id="settings-input-new_password-confirm" placeholder="Confirmar Nueva Contraseña" />
                    </div>

                    <div class="container-settings-bio-button">
                        <button type="button" id="settings-button-password" class="settings-bio-button">Enviar</button>
                    </div>
                </div>
            </div>

            <div class="container-settings">
                <div class="container-settings-title">
                    <p class="settings-title">
                        Cambiar Nombre de Usuario
                    </p>
                </div>

                <div class="container-settings-name">
                    <div class="container-settings-bio-input">
                        <input type="text" class="settings-pfp-img-input" id="settings-input-username" placeholder="Nombre De Usuario" />
                    </div>

                    <div class="container-settings-bio-button">
                        <button type="button" id="settings-button-username" class="settings-bio-button">Enviar</button>
                    </div>
                </div>
            </div>

            <div class="container-settings">
                <div class="container-settings-pfp">
                    <div class="container-settings-title">
                        <p class="settings-title">
                            Modificar Imagen de Perfil
                        </p>
                    </div>

                    <div class="container-settings-pfp-description">
                        <p>1) Ingresa un enlace a una imagen o gif. La URL debe ser directa a la imagen. Se recomienda que la imagen sea cuadrada.</p>
                        <p>2) Presiona el botón para cargar la imagen. Si el enlace no es valido, te lo haremos saber.</p>

                        <div class="container-settings-pfp-img-input">
                            <input type="text" class="settings-pfp-img-input" id="input-image-url" placeholder="URL de la imagen." />
                            <button id="load-button" class="settings-pfp-img-button">Cargar Imagen</button>
                        </div>

                        <div class="container-settings-pfp">
                            <div id="container-image"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;