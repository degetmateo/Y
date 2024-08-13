import { APP_CONTAINER, getDateMessage, navigateTo } from "../consts.js";
import {app} from "../model.js";
import {CONTENT_NAV, EventsNavButtons} from "../views.js";

export const renderProfile = async () => {
    if (!app.user.token) {
        alert('Error de autentificacion.');
        navigateTo('/login');
        return;
    }

    APP_CONTAINER.innerHTML = VIEW_CONTENT(app.user);
    EventsNavButtons();
    document.title = 'Perfil';

    const resPosts = await fetchPosts(app.user);

    if (!resPosts.ok) {
        alert(resPosts.error.message);
        return;
    }

    drawPosts(resPosts.posts);
}

const fetchPosts = async (user) => {
    const req = await fetch('/user/posts', {
        method: 'GET',
        headers: {
            "authorization": "Bearer "+user.token
        }
    })
    const res = await req.json();
    return res;
}

const drawPosts = (posts) => {
    const postsContainer = document.getElementById('container-posts');
    postsContainer.innerHTML = '';

    for (const post of posts.reverse()) {
        postsContainer.innerHTML += `
            <div style="display: block; padding: 10px 0 15px 0; border-bottom: 1px solid gray;" class="post-container">
                <div class="container-sign" style="display: flex; align-items: center;">
                    <div class="container-pfp"
                        <img src="${app.user.profilePic.url}" />
                    </div>
                    <p><strong>${app.user.name}</strong> ▪ ${getDateMessage(post.date)}</p>                
                </div>
                <p style="overflow-wrap: break-word">${post.content}</p>
            </div>
        `
    }
}

const VIEW_CONTENT = (data) => {
    return `
        <div class="container-profile-view">
            <div class="container-nav">
                ${CONTENT_NAV}
            </div>
            <div class="container-profile">
                <div class="container-pfp">
                    <img src="${app.user.profilePic.url}" />
                </div>
                <div class="container-name">
                    <strong>${app.user.name}</strong>
                    <span>@${app.user.username}</span>
                </div>
                <div class="container-bio">
                    <p>test: Biografia</p>
                    <p>NO TERMINÉ TENGO SUEÑO</p>
                </div>
            </div>
            <div class="container-posts" id="container-posts">
            
            </div>
        </div>
    `;
}