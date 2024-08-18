import {URL_NO_IMAGE} from "../consts.js";
import { getDateMessage, hasDisallowedTags } from "../helpers.js";
import { navigateTo } from "../router.js";
import AbstractView from "./AbstractView.js";
import { CreateNavigation } from "./templates/nav.js";

export default class extends AbstractView {
    constructor (params) {
        super(params);
        this.setTitle('Inicio');
    }

    async init () {
        if (window.location.pathname === '/') return navigateTo('/home');
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = VIEW_CONTENT;
        CreateNavigation();
        await this.loadPosts();
        await this.events();
    }

    async events () {
        await this.eventButtonRefresh();
        await this.eventFormPostCreate();
    }

    async eventButtonRefresh () {
        const button = document.getElementById('button-refresh');
        button.addEventListener('click', event => {
            event.preventDefault();
            this.loadPosts();
        });
    }

    async loadPosts () {
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
        if (!response.ok) {
            if (response.error) alert(response.error.message);
            localStorage.removeItem('user')
            navigateTo('/login');
            return;
        }
    
        for (const post of response.posts) {
            const containerPost = document.createElement('div');
            containerPost.style = 'padding: 10px 10px 10px 10px; border-bottom: 1px solid gray;';
            containerPost.setAttribute('class', 'post-container');

            const containerSign = document.createElement('div');
            containerSign.style = 'display: flex; align-items: center;';
            containerSign.setAttribute('class', 'container-sign');

            const containerPfp = document.createElement('div');
            containerPfp.setAttribute('class', 'container-pfp'); 
            containerPfp.style = `
                width: 50px;
                height: 50px;
                border: 1px solid #FFF; 
                cursor: pointer;
                overflow: hidden;
            `;
            
            containerPfp.appendChild(createProfileImage(post));

            containerSign.appendChild(containerPfp);
            containerPost.appendChild(containerSign);

            const pSign = document.createElement('p');
            const strongSign = document.createElement('strong');
            const aSign = document.createElement('a');
            const spanSign = document.createElement('span');
            
            aSign.setAttribute('href', '/user/'+post.creator.username);
            aSign.setAttribute('data-link', '');
            aSign.textContent = post.creator.name;
            
            strongSign.appendChild(aSign);
            strongSign.style = 'cursor:pointer; margin-left: 10px;';
            
            pSign.appendChild(strongSign);

            spanSign.textContent = ' ▪ '+getDateMessage(post.date);
            pSign.appendChild(spanSign);

            containerSign.appendChild(pSign);

            const pContent = document.createElement('p');
            pContent.style = 'overflow-wrap: break-word;';
            pContent.innerText = post.content;

            containerPost.appendChild(pContent);

            const containerPostInteractions = document.createElement('div');
            containerPostInteractions.style = 'display:flex;';
            containerPostInteractions.innerHTML = `
                <span style="margin: 0 5px 0 0">${0} 💬</span>
                <span style="margin: 0 5px 0 0">${0} ❤️</span>
            `;

            containerPost.appendChild(containerPostInteractions);
            timelineContainer.appendChild(containerPost);
        }
    
        function createProfileImage (post) {
            const creator = post.creator;
            const image = creator.profilePicture;
            const imageUrl = image.url || URL_NO_IMAGE;

            const img = new Image();
            img.src = imageUrl;
            img.setAttribute('href', '/user/'+post.creator.username);
            img.setAttribute('data-link', '');
            img.addEventListener('load', () => {                
                img.style = `
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                `;
            });
            return img;
        }
    }

    async eventFormPostCreate () {
        const form = document.getElementById('form-post-create');
        const inputContent = document.getElementById('form-post-create-input-content');
    
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
            inputContent.value = '';
            await this.loadPosts();
        })
    }
}

const VIEW_CONTENT = `
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
                <button type="button" id="button-refresh"><i class="fa-solid fa-arrows-rotate"></i><span>Actualizar Timeline</span></button>
            </div>

            <div id="container-timeline" class="container-timeline"></div>
        </div>
    </div>
`;