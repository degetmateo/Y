import { APP_CONTAINER, getDateMessage } from "../consts.js";
import {CONTENT_NAV, EventsNavButtons} from "../views.js";

let userProfile;

export const renderProfile = async (data) => {
    if (!data || !data.token) {
        return alert('Error de autentificacion.');
    }

    const res = await fetchUser(data);

    if (!res.ok) {
        alert(res.error.message);
        return;
    }
    userProfile = res.user;
    APP_CONTAINER.innerHTML = VIEW_CONTENT(res);
    EventsNavButtons();
    document.title = 'Perfil';

    const resPosts = await fetchPosts(data);

    if (!resPosts.ok) {
        alert(resPosts.error.message);
        return;
    }

    drawPosts(resPosts.posts);
}

const fetchUser = async (user) => {
    const req = await fetch('/user', {
        method: 'GET',
        headers: {
            "authorization": "Bearer "+user.token
        }
    })
    const res = await req.json();
    return res;
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
                        <img src="${userProfile.profilePic.url}" />
                    </div>
                    <p><strong>${userProfile.name}</strong> ▪ ${getDateMessage(post.date)}</p>                
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
                    <img src="${data.user.profilePic.url}" />
                </div>
                <div class="container-name">
                    <strong>${data.user.name}</strong>
                    <span>@${data.user.username}</span>
                </div>
                <div class="container-bio">
                    <p>test: Biografia</p>
                </div>
            </div>
            <div class="container-posts" id="container-posts">
            
            </div>
        </div>
    `;
}