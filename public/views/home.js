import { APP_CONTAINER, getDateMessage, navigateTo } from "../consts.js";
import {app} from "../model.js";
import {CONTENT_NAV, EventsNavButtons} from "../views.js";

export const renderHome = (data) => {
    APP_CONTAINER.innerHTML = HOME_CONTENT();
    document.title = 'miau - Inicio'

    EventsNavButtons();
    setEventFormPostCreate();
    setEventButtonRefresh();
    loadPosts();

    document.getElementById('title').textContent = 'Bienvenide, '+app.user.name
}

function HOME_CONTENT () {
    return `
        <h2 id="title"></h2> 
        <span>(no andan los favs es solo decoracion)</span><br>
        <span>(el que lee se la come)</span><br>
        <span>Ultima Update: PERFIL</span><br>
        <span>Limité los posts que se cargan de entrada a 50 porque se lageaba todo pipipi</span>
        <br><br>

        ${CONTENT_NAV}

        <h3>Publicar</h3>
        <form action="/post/create" method="post" id="form-post-create">
            <div style="
                display: flex;
            ">
                <textarea style="width: 100%; max-width: 500px; height: 60px;" id="form-post-create-input-content" name="form-post-create-input-content" placeholder="¡¿Qué está pasando?!" required></textarea>
                <button type="submit">Publicar</button>
            </div>
        </form>

        <div style="
            width: 100%;
            height: 70px;
        ">
            <h3>Publicaciones</h3>
            <button type="button" id="refresh-button">Refrescar</button>
        </div>
        <div style="padding-bottom: 15px; border-bottom: 1px solid gray;"></div>
        <div id="timeline-container" class="timeline-container"></div>
    `;
}

async function setEventFormPostCreate () {
    const form = document.getElementById('form-post-create')
    const inputContent = document.getElementById('form-post-create-input-content')

    form.addEventListener('submit', async event => {
        event.preventDefault()
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
        await loadPosts();
    })
}

function hasDisallowedTags(content, allowedTags) {
    const contenedor = document.createElement('div');
    contenedor.innerHTML = content;

    const todasEtiquetas = contenedor.getElementsByTagName('*');

    for (let i = 0; i < todasEtiquetas.length; i++) {
        const etiqueta = todasEtiquetas[i].tagName.toLowerCase();
        if (!allowedTags.includes(etiqueta)) {
            return true;
        }
    }

    return false;
}

function setEventButtonRefresh () {
    const button = document.getElementById('refresh-button');
    button.addEventListener('click', event => {
        event.preventDefault();
        loadPosts();
    })
}

async function loadPosts () {
    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.innerHTML = '';
    const user = JSON.parse(localStorage.getItem('user'));
    const request = await fetch ('/posts', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${user.token}`,
        }
    })

    const response = await request.json();
    console.log(response)
    if (!response.ok) {
        if (response.error) alert(response.error.message);
        localStorage.removeItem('user')
        navigateTo('/login', null)
        return;
    }

    const noImageURL = 'https://static.vecteezy.com/system/resources/thumbnails/007/126/739/small/question-mark-icon-free-vector.jpg';
    for (const post of response.posts) {
        timelineContainer.innerHTML += `
            <div style="padding: 10px 10px 10px 10px; border-bottom: 1px solid gray;" class="post-container">
                <div class="container-sign" style="display: flex; align-items: center;">

                    <div class="container-pfp" 
                        style="
                            width: 50px;
                            height: 50px;
                            margin: 0 10px 0 0; 
                            border: 1px solid gray;
                        ">

                        ${setProfilePic(post)}
                    </div>

                    <p><strong>${post.creator.name}</strong> ▪ ${getDateMessage(post.date)}</p>                
                </div>
                <p style="overflow-wrap: break-word">${post.content}</p>
                <div style="display:flex;" class="post-interactions-container">
                    <span style="margin: 0 5px 0 0">${0} 💬</span>
                    <span style="margin: 0 5px 0 0">${0} ❤️</span>
                </div>
            </div>
        `;
    }

    function setProfilePic (post) {
        const creator = post.creator;
        const image = creator.profilePicture;
        const imageUrl = image.url || noImageURL;
    
        if (!image.url) {
            return `
                <img 
                    src="${imageUrl}"
                    style="
                        width: 100%;
                        height: 100%;
                    "    
                ></img>
            `
        } else {
            return `
            <img 
                src="${imageUrl}"
                style="
                    width: 100%;
                    height: 100%;
                "    
            ></img>
        `
        }
    }
}