import auth from "../auth.js";
import {URL_NO_IMAGE} from "../consts.js";
import {cleanContent} from "../helpers.js";
import {navigateTo} from "../router.js";
import AbstractView from "./AbstractView.js";
import Popup from "../components/popup/Popup.js";
import Post from "./elements/Post.js";
import {CreateNavigation} from "./templates/nav.js";

export default class extends AbstractView {
    constructor (params) {
        super(params);
        this.setTitle('Usuario');

        this.user = {};
        this.posts = {};

        this.limit = 20;
        this.offset = 0;
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
        this.user.follows = {
            followed: this.user.follows.followed,
            followers: this.user.follows.followers,
            followedCount: this.user.follows.followed.length,
            followersCount: this.user.follows.followers.length
        }
        this.drawProfile();

        const resUserPosts = await this.getUserPosts();
        this.posts = resUserPosts.posts;
        this.drawPosts(resUserPosts.posts);
        this.eventTimelineScroll();
    }

    async getUser () {
        const request = await fetch(`/api/member/${this.params.username}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + window.app.user.token
            }
        });

        return await request.json();
    }

    async getUserPosts () {
        const request = await fetch(`/api/posts/member/${this.params.username}/${this.limit}/${this.offset}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + window.app.user.token
            }
        });
        const response = await request.json();
        return response;
    }

    drawProfile () {
        const containerName = document.getElementById('container-name');
        containerName.innerHTML = `
            <strong>${this.user.name}</strong>
            <span>@${this.user.username}</span>
        `;

        if (this.user.username != window.app.user.username) {
            const containerButtonFollow = document.getElementById('container-button-follow');
            this.user.isFollowed ?
                containerButtonFollow.appendChild(this.createButtonUnfollow()) :
                containerButtonFollow.appendChild(this.createButtonFollow());
        }

        const containerPfp = document.getElementById('container-pfp');
        containerPfp.innerHTML = `
            <img class="img-profile" src="${this.user.profilePicture.url || URL_NO_IMAGE}" />
        `;
        const follows = this.user.follows;

        const spanFollowed = document.getElementById('span-followed');
        spanFollowed.textContent = this.user.follows.followed.length + ' seguidos'

        const containerFollows = document.getElementById('container-followed');
        containerFollows.style.cursor = 'pointer';
        containerFollows.addEventListener('click', ()=>{
            const pop = new Popup();
            for (const user of follows.followed) {
                const userContainer = document.createElement('a');
                userContainer.setAttribute('data-link', '');
                userContainer.setAttribute('href', '/member/'+user.username_member);
                userContainer.textContent =  `@${user.username_member}`;
                userContainer.classList.add('popup-list-item');
                userContainer.onclick = () => pop.delete();
                pop.body().appendChild(userContainer);
            }
        });

        const spanFollowers = document.getElementById('span-followers');
        spanFollowers.textContent = follows.followers.length === 1 ?
            1 + ' seguidor' : 
            follows.followers.length + ' seguidores'; 

        const containerFollowers= document.getElementById('container-followers');
        containerFollowers.style.cursor = 'pointer';
        containerFollowers.addEventListener('click', ()=>{
            const pop = new Popup();
            for (const user of follows.followers) {
                const userContainer = document.createElement('a');
                userContainer.setAttribute('data-link', '');
                userContainer.setAttribute('href', '/member/'+user.username_member);
                userContainer.textContent =  `@${user.username_member}`;
                userContainer.classList.add('popup-list-item');
                userContainer.onclick = () => pop.delete();
                pop.body().appendChild(userContainer);
            }
        });

        const spanBio = document.getElementById('span-bio');
        spanBio.innerHTML = this.user.bio ? cleanContent(this.user.bio) : '';
    }

    createButtonFollow () {
        const button = document.createElement('button');
        button.setAttribute('class', 'button-follow');
        button.setAttribute('id', 'button-follow');
        button.textContent = 'Seguir';
        button.addEventListener('click', () => this.followUser());
        return button;
    }

    async followUser () {
        document.getElementById('button-follow').remove();
        document.getElementById('container-button-follow').appendChild(this.createButtonUnfollow());

        this.user.follows.followersCount += 1;

        document.getElementById('span-followers').textContent = this.user.follows.followersCount === 1 ?
            1 + ' seguidor' : 
            this.user.follows.followersCount + ' seguidores';

        const request = await fetch('/api/member/'+this.user.username+'/follow', {
            method: 'PUT',
            headers: { "Authorization": "Bearer "+window.app.user.token }
        });

        const response = await request.json();
        if (!response.ok) return alert(response.error.message);
    }

    createButtonUnfollow () {
        const button = document.createElement('button');
        button.setAttribute('class', 'button-follow');
        button.setAttribute('id', 'button-unfollow');
        button.textContent = 'Dejar de Seguir';
        button.addEventListener('click', () => this.unFollowUser());
        return button;
    }

    async unFollowUser () {
        document.getElementById('button-unfollow').remove();
        document.getElementById('container-button-follow').appendChild(this.createButtonFollow());

        this.user.follows.followersCount -= 1;

        document.getElementById('span-followers').textContent = this.user.follows.followersCount === 1 ?
            1 + ' seguidor' : 
            this.user.follows.followersCount + ' seguidores';

        const request = await fetch('/api/member/'+this.user.username+'/unfollow', {
            method: 'DELETE',
            headers: { "Authorization": "Bearer "+window.app.user.token }
        });

        const response = await request.json();
        if (!response.ok) return alert(response.error.message);
    }
    
    drawPosts (posts) {
        const postsContainer = document.getElementById('container-posts');
        for (const post of posts) {
            post.creator = this.user;
            postsContainer.appendChild(Post.Create(post));
        }
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
                const res = await this.getUserPosts();
                if (!res.ok) return;
                this.drawPosts(res.posts);
            }
        });
    }
}

const VIEW = `
    <div class="container-profile-view">
        <div class="container-mobile-form-post-create" id="container-mobile-form-post-create" style="display:none;"></div>
        <div class="container-nav" id="container-nav"></div>
        <div class="container-main" id="container-main">
            <div class="container-profile">
                <div class="container-pfp" id="container-pfp">

                </div>
                <div class="container-name-follow">
                    <div class="container-name" id="container-name">

                    </div>
                    <div class="container-button-follow" id="container-button-follow">

                    </div>
                </div>
                <div class="container-bio" id="container-bio">
                    <span id="span-bio"></span>
                </div>

                <div class="container-follows">
                    <div class="container-follow" id="container-followed">
                        <span id="span-followed">0 seguidos</span>
                    </div>

                    <div class="container-follow" id="container-followers">
                        <span id="span-followers">0 seguidores</span>
                    </div>
                </div>
            </div>

            <div class="container-posts" id="container-posts"></div>
        </div>
    </div>
`;