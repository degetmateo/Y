import auth from "../auth.js";
import {URL_NO_IMAGE} from "../consts.js";
import {getDateMessage} from "../helpers.js";
import {navigateTo} from "../router.js";
import AbstractView from "./AbstractView.js";
import {CreateNavigation} from "./templates/nav.js";

export default class extends AbstractView {
    constructor (params) {
        super(params);
        this.setTitle('Usuario');

        this.user = {};
        this.posts = {};
    }

    async init () {
        if (!await auth()) {
            navigateTo('/login');
            return;
        }

        const appContainer = document.getElementById('app');
        appContainer.innerHTML = VIEW;
        CreateNavigation();
    
        const resUser = await this.getUser();

        if (!resUser.ok) {
            alert(resUser.error.message);
            return;
        }

        this.user = resUser.user;
        this.drawProfile();

        const resUserPosts = await this.getUserPosts();
        this.posts = resUserPosts.posts;
        this.drawPosts();
    }

    async getUser () {
        const request = await fetch(`/api/user/${this.params.username}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + window.app.user.token
            }
        });

        return await request.json();
    }

    async getUserPosts () {
        const request = await fetch(`/api/user/${this.params.username}/posts`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + window.app.user.token
            }
        });

        return await request.json();
    }

    drawProfile () {
        const containerName = document.getElementById('container-name');
        containerName.innerHTML = `
            <strong>${this.user.name}</strong>
            <span>@${this.user.username}</span>
        `;

        const containerPfp = document.getElementById('container-pfp');
        containerPfp.innerHTML = `
            <img class="img-profile" src="${this.user.profilePic.url || URL_NO_IMAGE}" />
        `;
    }
    
    drawPosts () {
        const postsContainer = document.getElementById('container-posts');
        postsContainer.innerHTML = '';
        if (!this.posts || this.posts.length <= 0) return;
        for (const post of this.posts.reverse()) {
            postsContainer.innerHTML += `
                <div class="container-post">
                    <div class="container-sign"">
                        <div class="container-pfp">
                            <img class="img-profile-post" src="${this.user.profilePic.url}" />
                        </div>
                        <p class="sign"><strong>${this.user.name}</strong> ▪ ${getDateMessage(post.date)}</p>                
                    </div>
                    <p class="post-content">${post.content}</p>
                </div>
            `;
        }
    }
}

const VIEW = `
    <div class="container-profile-view">
        <div class="container-mobile-form-post-create" id="container-mobile-form-post-create" style="display:none;"></div>
        <div class="container-nav" id="container-nav"></div>
        
        <div class="container-main">
            <div class="container-profile">
                <div class="container-pfp" id="container-pfp">

                </div>
                <div class="container-name" id="container-name">

                </div>
                <div class="container-bio">
                    <p>Esto es una biografía. Voy a escribir mucho texto solo para probar. Hola, ¿cómo estás? Leé Umineko. Umineko cambió mi vida. Toda mi vida gira en torno a Umineko. Estoy seguro que Umineko también cambiará tu vida. Por favor, leé Umineko. Es la única forma en la que tu vida de mierda podrá ir a mejor. Haceme caso. <span style="color:red;">Esta es la verdad.</span></p>
                </div>
            </div>

            <div class="container-posts" id="container-posts"></div>
        </div>
    </div>
`;