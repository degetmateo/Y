import Alert from "../../components/alert/alert.js";
import Navigation from "../../components/navigation/navigation.js";
import Post from "../../components/post/Post.js";
import AbstractView from "../AbstractView.js";

export default class CommentsView extends AbstractView {
    constructor (params) {
        super(params);
        this.viewContainer = document.createElement('div');
        this.viewContainer.classList.add('container-view');
        this.appContainer.appendChild(this.viewContainer);
    }

    async init () {
        this.viewContainer.appendChild(Navigation.Create());
        this.CreateMain();
    }

    CreateMain () {
        this.main = document.createElement('main');
        this.main.classList.add('comments-view-main');
        this.main.innerHTML = `
            <div class="container-comments-main-post" id="container-comments-main-post"></div>
            <div class="container-comments-main-replier">
                <textarea placeholder="¿Qué respondés?"></textarea>
                <button>Publicar</button>
            </div>
            <div class="container-comments-main-comments" id="container-comments-main-comments"></div>
        `;
        this.viewContainer.appendChild(this.main);

        this.CreateMainPost();
        // this.CreateMainComments();
    }

    async CreateMainPost () {
        try {
            const request = await fetch('/api/post/'+this.params.id_post, {
                method: "GET",
                headers: { "Authorization": "Bearer "+window.app.user.token }
            });
            const response = await request.json();
            if (!response.ok) return new Alert(response.error.message);

            const container = document.getElementById('container-comments-main-post');
            container.appendChild(Post.Create(response.post));
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
            for (const post of response.posts) {
                container.appendChild(Post.Create(post));
            }
        } catch (error) {
            console.error(error);
            return new Alert('Ha ocurrido un error.');
        }
    }
}