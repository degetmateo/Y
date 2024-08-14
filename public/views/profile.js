import { APP_CONTAINER, getDateMessage, navigateTo } from "../consts.js";
import {app} from "../app.js";
import {CreateNavigation} from "./templates/nav.js";

export const renderProfile = async () => {
    if (!app.user.token) {
        alert('Error de autentificacion.');
        navigateTo('/login');
        return;
    }

    const dimensions = await getImageDimensions(app.user.profilePic.url);
    app.user.profilePic.crop.ow = dimensions.width;
    app.user.profilePic.crop.oh = dimensions.height;

    APP_CONTAINER.innerHTML = VIEW_CONTENT();

    CreateNavigation();
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
            <div class="container-post">
                <div class="container-sign"">
                    <div class="container-pfp">
                        <img class="img-profile-post" src="${app.user.profilePic.url}" />
                    </div>
                    <p class="sign"><strong>${app.user.name}</strong> ▪ ${getDateMessage(post.date)}</p>                
                </div>
                <p class="post-content">${post.content}</p>
            </div>
        `;
    }
}

const VIEW_CONTENT = (data) => {
    const dc = 200;

    const ix = app.user.profilePic.crop.x;
    const iy = app.user.profilePic.crop.y;

    const iw = app.user.profilePic.crop.w;
    const ih = app.user.profilePic.crop.h;

    const ow = app.user.profilePic.crop.ow;
    const oh = app.user.profilePic.crop.oh;

    let difW = 0;
    let difH = 0;
    console.log(ow)
    console.log(oh)
    if (ow < dc) {
        difW = dc - ow;
    }

    if (oh < dc) {
        difH = dc - oh;
    }

    const dif = difW + difH;

    return `
        <div class="container-profile-view">
            <div class="container-nav" id="container-nav"></div>
            
            <div class="container-main">
                <div class="container-profile">
                    <div class="container-pfp">
                        <img class="img-profile" src="${app.user.profilePic.url}" />
                    </div>
                    <div class="container-name">
                        <strong>${app.user.name}</strong>
                        <span>@${app.user.username}</span>
                    </div>
                    <div class="container-bio">
                        <p>Esto es una biografía. Voy a escribir mucho texto solo para probar. Hola, ¿cómo estás? Leé Umineko. Umineko cambió mi vida. Toda mi vida gira en torno a Umineko. Estoy seguro que Umineko también cambiará tu vida. Por favor, leé Umineko. Es la única forma en la que tu vida de mierda podrá ir a mejor. Haceme caso. <span style="color:red;">Esta es la verdad.</span></p>
                    </div>
                </div>

                <div class="container-posts" id="container-posts"></div>
            </div>
        </div>
    `;
}

async function getImageDimensions(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = function() {
            resolve({
                width: img.width,
                height: img.height
            });
        };

        img.onerror = function() {
            reject(new Error('No se pudo cargar la imagen.'));
        };

        img.src = url;
    });
}