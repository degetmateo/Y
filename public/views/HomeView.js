import { hasDisallowedTags, loadImage } from "../helpers.js";
import { navigateTo } from "../router.js";
import AbstractView from "./AbstractView.js";
import Popup from "./elements/popup/Popup.js";
import Post from "./elements/Post.js";
import { CreateNavigation } from "./templates/nav.js";

export default class extends AbstractView {
    constructor (params) {
        super(params);
        this.setTitle('Inicio');
        this.limit = 20;
        this.offset = 0;
        this.mode = 'global';

        this.post = {
            images: []
        }
    }

    async init () {
        if (window.location.pathname === '/') return navigateTo('/home');
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = VIEW_CONTENT;
        this.mainContainer = document.getElementById('container-main');
        this.timelineContainer = document.getElementById('container-timeline');
        CreateNavigation(this);
        this.setGlobalTimeline();
        this.events();
        this.CreateMobileButtonPost();
    }

    CreateMobileButtonPost () {
        const container = document.createElement('div');
        container.classList.add('container-home-mobile-button');
        container.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        container.addEventListener('click', () => {
            const pop = new Popup();
            const textarea = document.createElement('textarea');
            textarea.placeholder = '¿Qué tienes en mente?';
            textarea.style = `
                background-color: #1E1E1E;
                border: 1px solid #FFF;
                outline: none;
                padding: 10px;
                border-radius: 10px;
                width: 300px;
                height: 100px;
                resize: none;
            `;
            const input = document.createElement('input');
            input.placeholder = 'URL Imagen';
            input.style = `
                background-color: #1E1E1E;
                border: 1px solid #FFF;
                outline: none;
                padding: 10px;
                border-radius: 10px;
                color: #FFF;
            `;
            pop.body().appendChild(textarea);
            pop.body().appendChild(input);
            pop.CreateButton("Enviar", async () => {
                const content = textarea.value.trim();
                const imageURL = input.value;
                pop.delete();
                try {
                    if (content.length <= 0) throw new Error('Debes escribir algo.');
                    if (imageURL.length > 0)await loadImage(imageURL);
                    const result = await this.SendPost({ content, images: [imageURL] });
                    if (!result.ok) throw new Error(result.error.message);
                    this.mode === 'global' ?
                        this.setGlobalTimeline() : this.setFollowingTimeline();
                } catch (error) {
                    alert(error.message);
                }
            });
        });
        this.mainContainer.appendChild(container);
    }

    async events () {
        this.eventChangeTimeline();
        this.eventFormPostCreate();
        this.eventTimelineScroll();
    }

    eventChangeTimeline () {
        const buttonGlobal = document.getElementById('button-change-timeline-global');
        const buttonFollowing = document.getElementById('button-change-timeline-following');

        buttonGlobal.addEventListener('click', () => {
            buttonGlobal.classList.add('active');
            buttonFollowing.classList.remove('active');
            this.setGlobalTimeline();
        });

        buttonFollowing.addEventListener('click', () => {
            buttonFollowing.classList.add('active');
            buttonGlobal.classList.remove('active');
            this.setFollowingTimeline();
        });
    }

    async setFollowingTimeline () {
        if (window.location.pathname != '/home') return;
        this.mainContainer.scrollTop = 0;
        this.offset = 0;
        this.mode = 'following';
        const res = await this.getPosts();
        if (!res.ok) {
            alert(res.error.message);
            return navigateTo('/login');
        }
        this.timelineContainer.innerHTML = '';
        this.drawPosts(res.posts);
    }

    async setGlobalTimeline () {
        if (window.location.pathname != '/home') return;
        this.mainContainer.scrollTop = 0;
        this.offset = 0;
        this.mode = 'global';
        const res = await this.getPosts();
        if (!res.ok) {
            alert(res.error.message);
            return navigateTo('/login');
        }
        this.timelineContainer.innerHTML = '';
        this.drawPosts(res.posts);
    }

    async getPosts () {
        const user = JSON.parse(localStorage.getItem('user'));
        const request = await fetch (`/api/posts/${this.mode}/${this.limit}/${this.offset}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        return await request.json();
    }

    drawPosts (posts) {
        for (const post of posts) {
            this.timelineContainer.appendChild(Post.Create(post));
        }
    }

    async SendPost (post) {
        const user = JSON.parse(localStorage.getItem('user'));
        const request = await fetch ('/post/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': "Application/JSON"
            },
            body: JSON.stringify({ user, post })
        });
        return await request.json();
    }

    async eventFormPostCreate () {
        const form = document.getElementById('form-post-create');
        const inputContent = document.getElementById('form-post-create-input-content');
    
        form.addEventListener('submit', async event => {
            event.preventDefault()
            const content = inputContent.value;
            inputContent.value = '';

            if (!content || content.length <= 0) {
                return;
            }
    
            const user = JSON.parse(localStorage.getItem('user'));
            const request = await fetch ('/post/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ user, post: { content: content, images: this.post.images } })
            });
            this.post.images = [];
    
            const res = await request.json();
    
            if (!res.ok) {
                alert(res.error.message)
                return;
            }
            this.setGlobalTimeline();
        });

        this.post_image_input = null;
        const buttonImage = document.getElementById('post-button-image');
        buttonImage.addEventListener('click', () => this.eventButtonImage());
    }

    eventButtonImage () {
        if (this.post_image_input) {
            this.post_image_input.remove();
            this.post_image_input = null;
            return;
        }
        const containerInput = document.createElement('div');
        containerInput.classList.add('container-input-image-url');
        containerInput.style = `
            background-color: #1E1E1E;

            display: grid;
            grid-template-columns: auto;
            grid-template-rows: auto auto auto;
            gap: 5px;
        `;

        const buttonClose = document.createElement('button');
        buttonClose.style = `
            outline: none;
            border: none;
            background-color: #1E1E1E;
            padding: 10px;
            border: 1px solid #FFF;
            color: #FFF;
            cursor:pointer;
        `;
        buttonClose.textContent = 'Cerrar';
        buttonClose.addEventListener('click', () => {
            containerInput.remove();
            this.post_image_input = null;
        });

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'URL de la Imagen';
        input.id = 'post-input-image-url';
        input.style = `
            outline: none;
            border: none;
            background-color: #1E1E1E;
            padding: 10px;
            border: 1px solid #FFF;
            color: #FFF;
        `;

        const buttonLoad = document.createElement('button');
        buttonLoad.textContent = 'Enviar';
        buttonLoad.style = `
            outline: none;
            border: none;
            background-color: #1E1E1E;
            padding: 10px;
            border: 1px solid #FFF;
            color: #FFF;
            cursor: pointer;
        `;
        buttonLoad.addEventListener('click', async () => {
            const url = input.value;
            input.value = '';
            try {
                await loadImage(url);
                this.post.images.push(url);
                console.log(this.post.images)
                containerInput.remove();
            } catch (error) {
                alert(error.message);
                this.post_image_input = null;
                containerInput.remove();
            }
        });

        containerInput.appendChild(buttonClose)
        containerInput.appendChild(input);
        containerInput.appendChild(buttonLoad);
        this.post_image_input = containerInput;
        document.body.appendChild(containerInput);
    }

    eventTimelineScroll () {
        this.mainContainer.addEventListener('scroll', async () => {
            const scrollHeight = this.mainContainer.scrollHeight;
            const clientHeight = this.mainContainer.clientHeight;
            const scrollTop = this.mainContainer.scrollTop;
            const umbral = 1;

            if (scrollTop + clientHeight >= scrollHeight - umbral) {
                this.offset += this.limit;
                const res = await this.getPosts();
                if (!res.ok) {
                    alert(res.error.message);
                    return navigateTo("/login");
                }
                this.drawPosts(res.posts);
            }
        });
    }
}

const VIEW_CONTENT = `
    <div class="container-home-view">
        <div class="container-mobile-form-post-create" id="container-mobile-form-post-create" style="display:none;"></div>
        <div class="container-nav" id="container-nav"></div>

        <div class="container-main" id="container-main">
            <div class="container-form-post-create">
                <form action="/post/create" method="post" id="form-post-create">
                    <div class="container-inputs">
                        <textarea class="textarea" id="form-post-create-input-content" name="form-post-create-input-content" placeholder="¡¿Qué está pasando?!" required></textarea>
                        <div class="container-post-create-buttons">
                            <div class="post-button-image" id="post-button-image">
                                <i class="fa-solid fa-image"></i>
                            </div>
                            <button class="button-submit" type="submit">Publicar</button>
                        </div>
                    </div>
                </form>
            </div>

            <div class="container-button-change-timeline">
                <button class="button-change-timeline active" type="button" id="button-change-timeline-global"><span>Global</span></button>
                <button class="button-change-timeline" type="button" id="button-change-timeline-following"><span>Siguiendo</span></button>
            </div>

            <div id="container-timeline" class="container-timeline"></div>
        </div>
    </div>
`;