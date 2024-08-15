import { APP_CONTAINER, getDateMessage, navigateTo, hasDisallowedTags } from "../consts.js";
import {app} from "../app.js";
import {CreateNavigation} from "./templates/nav.js";

export const renderHome = (data) => {
    APP_CONTAINER.innerHTML = HOME_CONTENT();
    document.title = 'miau - Inicio'

    CreateNavigation();

    setEventFormPostCreate();
    setEventButtonRefresh();
    loadPosts();
}

function HOME_CONTENT () {
    return `
        <div class="container-home-view">
            <div class="container-mobile-form-post-create" id="container-mobile-form-post-create" style="display:none;"></div>
            <div class="container-nav" id="container-nav"></div>

            <div class="container-main">
                <div class="container-form-post-create">
                    <form action="/post/create" method="post" id="form-post-create">
                        <div class="container-inputs">
                            <textarea class="textarea" id="form-post-create-input-content" name="form-post-create-input-content" placeholder="¡¿Qué está pasando?!" required></textarea>
                            <button class="button-submit" type="submit">Publicar</button>
                        </div>
                    </form>
                </div>

                <div class="container-button-refresh">
                    <button type="button" id="button-refresh"><i class="fa-solid fa-arrows-rotate"></i> <span>Actualizar Timeline</span></button>
                </div>

                <div id="container-timeline" class="container-timeline"></div>
            </div>
        </div>
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

function setEventButtonRefresh () {
    const button = document.getElementById('button-refresh');
    button.addEventListener('click', event => {
        event.preventDefault();
        loadPosts();
    })
}

export async function loadPosts () {
    if (window.location.pathname != '/home') return;
    const timelineContainer = document.getElementById('container-timeline');
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