import { loadImage } from "../helpers.js";
import { navigateTo } from "../router.js";
import AbstractView from "./AbstractView.js";
import Alert from "../components/alert/alert.js";
import Popup from "../components/popup/Popup.js";
import Post from "../components/post/Post.js";
import {URL_NO_IMAGE} from "../consts.js";

export default class extends AbstractView {
    constructor () {
        super();
        this.cooldown = false;
    }

    onVisibilityChange = () => {
        if (document.visibilityState != 'visible') return;
        if (window.location.pathname != '/home') return;
        if (this.cooldown) return;
        if (document.visibilityState === 'visible') this.setTimeline();
        this.cooldown = true;
        setTimeout(() => {
            this.cooldown = false;
        }, 10000);
    }

    async init (params) {
        this.params = params;
        this.clear();

        this.setTitle('Inicio');
        this.limit = 20;
        this.offset = 0;
        this.mode = 'global';

        this.post = {
            images: new Array()
        }

        this.observerId = 'home';
        window.app.listener.removeObserver(this.observerId);
        window.app.listener.addObserver(this);

        if (window.location.pathname === '/') return navigateTo('/home');
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = VIEW_CONTENT;

        this.mainContainer = document.getElementById('container-main');
        this.timelineContainer = document.getElementById('container-timeline');
        document.getElementById('container-view').appendChild(window.app.nav.getNode());
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
            textarea.placeholder = '¿Qué pasa?';
            textarea.style = `
                border: 1px solid #FFF;
                outline: none;
                padding: 10px;
                width: 300px;
                height: 100px;
                resize: none;
            `;
            const input = document.createElement('input');
            input.placeholder = 'URL de una Imagen';
            input.style = `
                border: 1px solid #FFF;
                outline: none;
                padding: 10px;
                color: #FFF;
            `;
            pop.body().appendChild(textarea);
            pop.body().appendChild(input);

            const btnTenor = pop.CreateButton("GIFS", async () => {
                CreateButtonTenor(btnTenor, (src) => {
                    this.post.images = [];
                    this.post.images.push(src);
                });
            }); 

            pop.CreateButton("Enviar", async () => {
                const content = textarea.value.trim();
                const imageURL = input.value;
                pop.delete();
                try {
                    if (imageURL.length > 0){
                        await loadImage(imageURL);
                        this.post.images = new Array();
                        this.post.images.push(imageURL);
                    }
                    
                    if ((!content || content.length <= 0) && (!this.post.images || this.post.images.length <= 0)) {
                        throw new Error("Debes escribir algo o ingresar una imagen.");
                    }
                    if (content && content.length <= 0) throw new Error('Debes escribir algo.');
                    const result = await this.SendPost({ content, images: this.post.images });
                    if (!result.ok) throw new Error(result.error.message);
                    new Alert('Publicación enviada.');
                    this.mode === 'global' ?
                        this.setGlobalTimeline() : this.setFollowingTimeline();
                } catch (error) {
                    return new Alert(error.message);
                }
            });
        });
        this.mainContainer.appendChild(container);
    }

    async events () {
        this.eventChangeTimeline();
        this.eventTimelineScroll();
        this.CreateMainForm();
    }

    CreateMainForm () {
        const profile_pic = document.getElementById('home-main-form-post-create-profile_pic');
        profile_pic.src = window.app.user.profilePic.url || URL_NO_IMAGE;

        const name = document.getElementById('home-main-form-post-create-name');
        name.textContent = window.app.user.name;

        const button = document.getElementById('home-main-form-post-create-button');
        button.addEventListener('click', async () => {
            try {
                const textarea = document.getElementById('home-main-form-post-create-textarea');
                const value = textarea.value.trim();

                if ((!value || value.length <= 0) && (!this.post.images || this.post.images.length <= 0)) {
                    return new Alert("Debes escribir algo o ingresar una imagen.");
                }

                if (value && value.length <= 0) return new Alert('Tenés que escribir algo.');
                if (value && value.length > 400) return new Alert('Límite de carácteres: 400.');
                textarea.value = '';
                const res = await this.SendPost({
                    content: value,
                    images: this.post.images
                });
                this.post.images = new Array();
                if (!res.ok) throw new Error(res.error.message);
                new Alert('Publicación enviada.');
                this.setTimeline();
            } catch (error) {
                console.error(error);
                return new Alert('Ha ocurrido un error.');
            }
        });

        const buttonImage = document.getElementById('home-main-form-post-create-button-media--image');
        buttonImage.onclick = () => {
            const popup = new Popup();
            const input = popup.CreateInput('text', 'URL de la Imagen');
            popup.CreateButton('Enviar', async () => {
                try {
                    const value = input.value.trim();
                    if (!value || value.length <= 0) {
                        return new Alert('Debes ingresar un enlace.');
                    }
                    const popEspere = new Popup();
                    const popTitle = popEspere.CreateTitle('Espere...');
                    try {
                        await loadImage(value);
                        this.post.images = new Array();
                        this.post.images.push(value);
                        new Alert('Imagen guardada con éxito.');
                        popEspere.delete();
                        popup.delete();
                    } catch (error) {
                        console.error(error);
                        popEspere.delete();
                        return new Alert('Esa imagen no está disponible.');
                    }
                } catch (error) {
                    console.error(error);
                    return new Alert('Esa imagen no está disponible.');
                }
            });
        }

        CreateButtonTenor(document.getElementById('home-main-form-post-create-button-media--tenor'), (src) => {
            this.post.images = [];
            this.post.images.push(src);
        });
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

    setTimeline () {
        this.mode === 'global' ?
            this.setGlobalTimeline() :
            this.setFollowingTimeline();
    }

    async setFollowingTimeline () {
        if (window.location.pathname != '/home') return;
        this.mainContainer.scrollTop = 0;
        this.offset = 0;
        this.mode = 'following';
        const res = await this.getPosts();
        if (!res.ok) {
            console.error(res.error.message);
            new Alert(res.error.message);
            return navigateTo('/login');
        }
        this.timelineContainer.innerHTML = '';
        this.drawPosts(res.posts);
    }

    clearPosts () {
        this.timelineContainer.innerHTML = '';
    }

    resetScroll () {
        this.mainContainer.scrollTop = 0;
    }

    async setGlobalTimeline () {
        if (window.location.pathname != '/home') return;
        this.mainContainer.scrollTop = 0;
        this.offset = 0;
        this.mode = 'global';
        const res = await this.getPosts();
        if (!res.ok) {
            console.error(res.error.message);
            new Alert(res.error.message);
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
        const request = await fetch ('/api/post/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': "Application/JSON"
            },
            body: JSON.stringify({ user, post })
        });
        return await request.json();
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
                    new Alert(res.error.message);
                    return navigateTo("/login");
                }
                this.drawPosts(res.posts);
            }
        });
    }
}

const VIEW_CONTENT = `
    <div class="container-home-view" id="container-view">
        <div class="container-mobile-form-post-create" id="container-mobile-form-post-create" style="display:none;"></div>

        <div class="container-main" id="container-main">
                <div class="container-home-main-form-post-create-div">
                    <div class="container-home-main-form-post-create-profile_pic">
                        <img class="home-main-form-post-create-profile_pic" id="home-main-form-post-create-profile_pic" src="" />
                    </div>

                    <div class="container-home-main-form-post-create-body">
                        <div class="container-home-main-form-post-create-signature">
                            <div class="container-home-main-form-post-create-name">
                                <span class="home-main-form-post-create-name" id="home-main-form-post-create-name"></span>
                            </div>
                        </div>
                        
                        <textarea id="home-main-form-post-create-textarea" class="home-main-form-post-create-textarea" placeholder="¿Qué pensás?" required></textarea>
                            
                        <div class="container-home-main-form-post-create-buttons">
                            <div class="container-home-main-form-post-create-options">
                                <select id="options" name="options" class="home-main-form-post-create-button home-main-form-post-create-button-options" disabled>
                                    <option value="opcion1">Todos</option>
                                </select>

                                <div id="home-main-form-post-create-button-media--image" class="home-main-form-post-create-button-media">IMG</div>
                                <div id="home-main-form-post-create-button-media--tenor" class="home-main-form-post-create-button-media">GIF</div>
                            </div>
                            <button id="home-main-form-post-create-button" class="button home-main-form-post-create-button">Publicar</button>
                        </div>
                    </div>
                </div>

            <div class="container-button-change-timeline">
                <button class="button-change-timeline active" type="button" id="button-change-timeline-global"><span>Global</span></button>
                <button class="button-change-timeline" type="button" id="button-change-timeline-following"><span>Siguiendo</span></button>
            </div>

            <div id="container-timeline" class="container-timeline"></div>
        </div>
    </div>
`;

/* <img src="/public/assets/imagen.svg" class="home-main-form-post-create-button-image" id="home-main-form-post-create-button-image" /> */


const tenor = async (_query) => {
    const lmt = 12;
    const search_url = 'https://tenor.googleapis.com/v2/search?q=' + _query + '&key=AIzaSyAEKv-HyfGYtL1y3jvvEDvcmY7Qagvsl0k' + '&limit='+lmt;
    const request = await fetch(search_url, { method: "GET" });
    const response = await request.json();
    return response['results'].map(r => r['media_formats'].gif);
}

export const CreateButtonTenor = (button, func) => {
    button.onclick = () => {
        try {
            const popup = new Popup();
            const input = popup.CreateInput('text', 'Busca un GIF');

            const containerTenorGifs = document.createElement('div');
            containerTenorGifs.style =`
                display: flex;
                flex-wrap: wrap;
                overflow-y: scroll;
            `;
            popup.body().appendChild(containerTenorGifs);

            popup.CreateButton('Buscar', async () => {
                containerTenorGifs.innerHTML = '';
                const popupWaiting = new Popup();
                popupWaiting.CreateTitle("Espere...");

                const value = input.value;
                if (!value || value.length <= 0) {
                    popupWaiting.delete();
                    return new Alert("Debes escribir algo.");
                }

                const query = await tenor(value);
                query.forEach(r => {
                    const image = new Image();
                    image.src = r.url;
                    image.classList.add('home-tenor-gif');
                    containerTenorGifs.appendChild(image);

                    image.onclick = () => {
                        func(image.src);
                        popup.delete();
                        new Alert("GIF Insertado.");
                    }
                });

                popupWaiting.delete();
            });
        } catch (error) {
            console.error(error);
            new Alert("Ha ocurrido un error.");
        }
    }
}