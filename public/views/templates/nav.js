import {hasDisallowedTags} from "../../helpers.js";
import {navigateTo} from "../../router.js";

export const CreateNavigation = () => {
    const navContainer = document.getElementById('container-nav');
    const mobileContainer = document.getElementById('container-mobile-form-post-create');
    navContainer.innerHTML = CONTENT_NAV;
    mobileContainer.innerHTML = CONTENT_MOBILE;
    mobileContainer.style.display = 'none';
    CreateNavigationEvents();
}

const CONTENT_NAV = `
    <nav class="nav" id="nav">
        <a class="nav-button" id="nav-button-home" href="/home"><i class="fa-solid fa-house nav-button-icon"></i> <span class="nav-button-text">Inicio</span></a>
        <a class="nav-button" id="nav-button-profile" href="/profile"><i class="fa-solid fa-user nav-button-icon"></i> <span class="nav-button-text">Perfil</span></a>
        <a class="nav-button" id="nav-button-config" href="/config"><i class="fa-solid fa-gear nav-button-icon"></i> <span class="nav-button-text">Configuración</span></a>
        <a class="nav-button" id="nav-button-post" href="#"><i class="fa-solid fa-pen nav-button-icon"></i> <span class="nav-button-text">Publicar</span></a>
    </nav>
`;

const CONTENT_MOBILE = `
        <div class="container-form">
            <textarea class="textarea" id="mobile-textarea-post-create" name="mobile-textarea-post-create" placeholder="¡¿Qué está pasando?!" required></textarea>
            <button class="mobile-button-post-create" id="mobile-button-post-create" type="submit">Publicar</button>
        </div>
`;

const CreateNavigationEvents = () => {
    document.getElementById('nav-button-home').addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/home');
    })

    document.getElementById('nav-button-config').addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/settings');
    })

    document.getElementById('nav-button-profile').addEventListener('click', (event) => {
        event.preventDefault();
        navigateTo('/user/'+window.app.user.username);
    })

    const buttonPost = document.getElementById('nav-button-post'); 
    buttonPost.addEventListener('click', e => {
        e.preventDefault();
        const mobile = document.getElementById('container-mobile-form-post-create');
        if (mobile.style.display != 'none') {
            mobile.style.display = 'none';
            buttonPost.style.background = 'none';
        } else {
            mobile.style.display = 'initial';
            buttonPost.style.background = 'gray'
        }
    })

    setEventFormPostCreate();
}

async function setEventFormPostCreate () {
    const mobile = document.getElementById('container-mobile-form-post-create');
    const buttonPost = document.getElementById('nav-button-post'); 
    const buttonMobile = document.getElementById('mobile-button-post-create'); 
    const inputContent = document.getElementById('mobile-textarea-post-create')

    buttonMobile.addEventListener('click', async event => {
        const content = inputContent.value;

        if (!content || content.length <= 0) {
            return;
        }

        if (hasDisallowedTags(content, ['img', 'span'])) {
            alert('Contenido no permitido por el momento.');
            return;
        }

        const user = JSON.parse(localStorage.getItem('user'));
        const request = await fetch ('/post/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': "application/json"
            },
            body: JSON.stringify({ user, post: { content } })
        })

        const res = await request.json();

        if (!res.ok) {
            alert(res.error.message)
            return;
        }
        inputContent.value = ''
        buttonPost.style.background = 'none';
        mobile.style.display = 'none';
        window.location.reload();
    })
}