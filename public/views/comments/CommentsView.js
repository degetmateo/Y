import Alert from "../../components/alert/alert.js";
import Navigation from "../../components/navigation/navigation.js";
import Popup from "../../components/popup/Popup.js";
import Post from "../../components/post/Post.js";
import {loadImage} from "../../helpers.js";
import AbstractView from "../AbstractView.js";

export default class CommentsView extends AbstractView {
    constructor (params) {
        super(params);
        this.viewContainer = document.createElement('div');
        this.viewContainer.classList.add('container-view-comments');
        this.appContainer.appendChild(this.viewContainer);
        this.images = new Array();
    }

    async init () {
        this.viewContainer.appendChild(window.app.nav.getNode());
        this.CreateMain();
        this.commentsContainer = document.getElementById('container-comments-main-comments');
    }

    CreateMain () {
        this.main = document.createElement('main');
        this.main.classList.add('comments-view-main');
        this.main.innerHTML = `
            <div class="container-thread" id="container-thread"></div>
            <div class="container-comments-main-post" id="container-comments-main-post"></div>

            <div class="container-comments-main-form-post-create">
                <div class="container-comments-main-form-post-create-div">
                    <div class="container-comments-main-form-post-create-profile_pic">
                        <img class="comments-main-form-post-create-profile_pic" id="comments-main-form-post-create-profile_pic" src="${window.app.user.profilePic.url}" />
                    </div>

                    <div class="container-comments-main-form-post-create-body">
                        <div class="container-comments-main-form-post-create-signature">
                            <div class="container-comments-main-form-post-create-name">
                                <span class="comments-comments-form-post-create-name" id="comments-comments-form-post-create-name">${window.app.user.name}</span>
                            </div>
                        </div>
                        
                        <textarea id="comments-main-form-post-create-textarea" class="comments-main-form-post-create-textarea" placeholder="¿Qué respondés?" required></textarea>
                        
                        <div class="container-comments-main-form-post-create-buttons">
                            <div class="container-comments-main-form-post-create-options">
                                <img src="/public/assets/imagen.svg" class="comments-main-form-post-create-button-image" id="comments-main-form-post-create-button-image" />
                            </div>
                            <button id="comments-main-form-post-create-button" class="button comments-main-form-post-create-button">Publicar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="container-comments-main-comments" id="container-comments-main-comments"></div>
        `;
        this.viewContainer.appendChild(this.main);

        this.CreateMainPost();
        this.CreateMainComments();
        this.CreateEventPostCreate();
        this.CreateEventInsertImage();
        this.CreateThread();
    }

    CreateEventInsertImage () {
        const button = document.getElementById('comments-main-form-post-create-button-image');
        button.onclick = () => {
            const popup = new Popup();
            const input = popup.CreateInput('text', 'URL de la Imagen');
            popup.CreateButton('Enviar', async () => {
                try {
                    const value = input.value.trim();
                    if (!value || value.length <= 0) {
                        return new Alert('Debes ingresar un enlace.');
                    }
                    const popEspere = new Popup();
                    popEspere.CreateTitle('Espere...');
                    try {
                        await loadImage(value);
                        this.images = new Array();
                        this.images.push(value);
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
    }

    async CreateEventPostCreate () {
        const button = document.getElementById('comments-main-form-post-create-button');
        const textarea = document.getElementById('comments-main-form-post-create-textarea');
        
        button.onclick = async () => {
            try {
                const content = textarea.value;     
                if ((!content || content.length <= 0) && (!this.images || this.images.length <= 0)) {
                    throw new Error("Debes escribir algo o ingresar una imagen.");
                }
                if (content && content.length <= 0) return new Alert("Debes escribir algo.");
                if (content && content.length > 400) return new Alert("La cantidad máxima de carácteres es 400.");
                textarea.value = '';
                const user = JSON.parse(localStorage.getItem('user'));
                const request = await fetch('/api/post/create', {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer "+window.app.user.token,
                        "Content-Type": "Application/JSON"
                    },
                    body: JSON.stringify({ user, post: {
                        content: content,
                        images: this.images,
                        id_replied_post: this.params.id_post
                    } })
                });
                this.images = new Array();
                const response = await request.json();
                if (!response.ok) throw new Error(response.error.message);
                new Alert("Respuesta enviada.");
                this.commentsContainer.innerHTML = '';
                this.CreateMainComments();
                this.post.increaseComments();
                this.post.drawCommentsCount();
            } catch (error) {
                console.error(error);
                return new Alert("Ha ocurrido un error.");
            }
        }
    }

    async CreateMainPost () {
        try {
            const request = await fetch('/api/post/'+this.params.id_post, {
                method: "GET",
                headers: { "Authorization": "Bearer "+window.app.user.token }
            });
            const response = await request.json();
            if (!response.ok) return new Alert(response.error.message);

            this.post = new Post(response.post);

            const container = document.getElementById('container-comments-main-post');
            container.appendChild(this.post.getElement());
        } catch (error) {
            console.error(error);
            return new Alert('Ha ocurrido un error.');
        }
    }

    async CreateMainComments () {
        try {
            const request = await fetch('/api/post/'+this.params.id_post+'/comments', {
                method: "GET",
                headers: { "Authorization": "Bearer "+window.app.user.token }
            });
            const response = await request.json();
            if (!response.ok) return new Alert(response.error.message);
            const container = document.getElementById('container-comments-main-comments');
            container.innerHTML = '';
            for (const post of response.posts) {
                container.appendChild(Post.Create(post));
            }
        } catch (error) {
            console.error(error);
            return new Alert('Ha ocurrido un error.');
        }
    }

    async CreateThread () {
        try {
            const thread = await this.FetchThread();
            const containerThread = document.getElementById('container-thread');
            containerThread.innerHTML = '';

            const scrollPos = this.main.scrollTop;
            const alturaAntes = this.main.scrollHeight;

            for (const post of thread.reverse()) {
                const newPost = new Post(post);
                containerThread.appendChild(newPost.getElement());

                const alturaDespues = this.main.scrollHeight;
                this.main.scrollTop = scrollPos + (alturaDespues - alturaAntes);
            }
        } catch (error) {
            console.error(error);
            if (error.message.includes('innerHTML')) return;
            new Alert('Ha ocurrido un error.');
        }
    }

    async FetchThread () {
        const request = await fetch(`/api/post/${this.params.id_post}/thread`, {
            method: "GET",
            headers: { "Authorization": "Bearer "+window.app.user.token }
        });
        const response = await request.json();
        if (!response.ok) throw new Error(response.error.message);
        return response.thread;
    }
}