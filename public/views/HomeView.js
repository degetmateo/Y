import { hasDisallowedTags } from "../helpers.js";
import { navigateTo } from "../router.js";
import AbstractView from "./AbstractView.js";
import Post from "./elements/Post.js";
import { CreateNavigation } from "./templates/nav.js";

export default class extends AbstractView {
    constructor (params) {
        super(params);
        this.setTitle('Inicio');
        this.limit = 20;
        this.offset = 0;
        this.mode = 'global';
    }

    async init () {
        if (window.location.pathname === '/') return navigateTo('/home');
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = VIEW_CONTENT;
        this.timelineContainer = document.getElementById('container-timeline');
        CreateNavigation();
        this.setGlobalTimeline();
        this.events();
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
        this.offset = 0;
        this.mode = 'following';
        try {
            const posts = await this.getPosts();
            this.timelineContainer.innerHTML = '';
            this.drawPosts(posts);
        } catch (error) {
            localStorage.remove('user');
            alert(error.message);
            navigateTo('/login');  
        }
    }

    async setGlobalTimeline () {
        if (window.location.pathname != '/home') return;
        this.offset = 0;
        this.mode = 'global';
        try {
            const posts = await this.getPosts();
            this.timelineContainer.innerHTML = '';
            this.drawPosts(posts);
        } catch (error) {
            localStorage.remove('user');
            alert(error.message);
            navigateTo('/login');
        }
    }

    async getPosts () {
        const user = JSON.parse(localStorage.getItem('user'));
        const request = await fetch (`/api/posts/${this.mode}/${this.limit}/${this.offset}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const response = await request.json();
        if (!response.ok) throw new Error(res.error.message);
        return response.posts;
    }

    drawPosts (posts) {
        for (const post of posts) {
            this.timelineContainer.appendChild(new Post(post));
        }
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
            this.setGlobalTimeline();
        })
    }

    eventTimelineScroll () {
        const mainContainer = document.getElementById('container-main');
        mainContainer.addEventListener('scroll', async () => {
            const scrollHeight = mainContainer.scrollHeight;
            const clientHeight = mainContainer.clientHeight;
            const scrollTop = mainContainer.scrollTop;
            const umbral = 1;

            if (scrollTop + clientHeight >= scrollHeight - umbral) {
                this.offset += this.limit;
                const posts = await this.getPosts();
                this.drawPosts(posts);
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
                        <button class="button-submit" type="submit">Publicar</button>
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