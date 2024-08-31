import AbstractView from "./AbstractView.js";
import Post from "./elements/Post.js";
import {CreateNavigation} from "./templates/nav.js";

export default class extends AbstractView {
    constructor (params) {
        super(params);
        this.setTitle('Publicacion');

        this.appContainer = document.getElementById('app');
        this.appContainer.innerHTML = '';

        this.viewContainer = document.createElement('div');
        this.viewContainer.classList.add('container-view');
        this.viewContainer.classList.add('container-view-post');
        
        this.navContainer = document.createElement('div');
        this.navContainer.classList.add('nav');
        this.navContainer.classList.add('container-nav');
        this.navContainer.id = 'container-nav';
        this.viewContainer.appendChild(this.navContainer);

        this.mainContainer = document.createElement('div');
        this.mainContainer.classList.add('container-view-post-main');

        this.containerMainPost = document.createElement('div');
        this.containerMainPost.classList.add('container-view-post-main-post');

        this.containerMainReplies = document.createElement('div');
        this.containerMainReplies.classList.add('container-view-post-main-replies');

        this.mainContainer.appendChild(this.containerMainPost);
        this.mainContainer.appendChild(this.containerMainReplies);

        this.viewContainer.appendChild(this.mainContainer);
        this.appContainer.appendChild(this.viewContainer);
        CreateNavigation();
    }

    async init () {
        this.CreateMainPost();
    }

    async CreateMainPost () {
        const request = await fetch('/api/post/'+this.params.id_post, { 
            method: "GET",
            headers: { "Authorization": "Bearer "+window.app.user.token }
        });
        const response = await request.json();
        if (!response.ok) return alert(response.error.message);
        console.log(response);
        this.post = response.post;
        this.drawPost();
    }

    drawPost () {
        this.containerMainPost.appendChild(Post.Create(this.post));
        const testPost = { id: 3, content: "test", upvotes: [], date: { years: 1,
        }, creator: { name: "Señor Y", username: "y", profilePicture: {url:null}} };

        this.containerMainReplies.appendChild(Post.Create(testPost));
        this.containerMainReplies.appendChild(Post.Create(testPost));
        this.containerMainReplies.appendChild(Post.Create(testPost));
        this.containerMainReplies.appendChild(Post.Create(testPost));
        this.containerMainReplies.appendChild(Post.Create(testPost));
        this.containerMainReplies.appendChild(Post.Create(testPost));
    }
}