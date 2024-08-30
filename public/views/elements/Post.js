import { URL_NO_IMAGE } from "../../consts.js";
import { cleanContent, getDateMessage } from "../../helpers.js";
import Popup from "./popup/Popup.js";

export default class Post {
    constructor (_post) {
        this.post = _post;
        this.container = document.createElement('div');
        this.container.classList.add('container-post');
        this.container.appendChild(this.CreatePostHeader());
        this.container.appendChild(this.CreatePostBody());
        this.container.appendChild(this.CreatePostFooter());
    }

    static Create (_post) {
        return new Post(_post).getElement();
    }

    getElement () {
        return this.container;
    }

    CreatePostHeader () {
        const containerHeader = document.createElement('div');
        containerHeader.classList.add('container-post-header');
        containerHeader.appendChild(this.CreatePostHeaderPicture());
        containerHeader.appendChild(this.CreatePostHeaderSignature());
        if (window.app.user.id == this.post.creator.id) containerHeader.appendChild(this.CreatePostHeaderDeleteButton());
        return containerHeader;
    }

    CreatePostBody () {
        const containerBody = document.createElement('div');
        containerBody.classList.add('container-post-body');
        containerBody.appendChild(this.CreatePostBodyContent());
        if (this.post.images && this.post.images.length > 0) containerBody.appendChild(this.CreatePostBodyImages());
        return containerBody;
    }

    CreatePostBodyContent () {
        const bodyContent = document.createElement('span');
        bodyContent.classList.add('post-body-content');
        bodyContent.innerHTML = cleanContent(this.post.content);
        return bodyContent;
    }

    CreatePostBodyImages () {
        const imagesContainer = document.createElement('div');
        imagesContainer.classList.add('container-post-body-images');
        for (const image of this.post.images) {
            const img = new Image();
            img.src = image;
            img.classList.add('post-body-image');
            imagesContainer.appendChild(img);
        }
        return imagesContainer;
    }

    CreatePostFooter () {
        const containerFooter = document.createElement('div');
        containerFooter.classList.add('container-post-footer');
        containerFooter.appendChild(this.CreatePostFooterInteractions());
        containerFooter.appendChild(this.CreatePostFooterDate());
        return containerFooter;
    }

    CreatePostHeaderPicture () {
        const containerHeaderPicture = document.createElement('div');
        containerHeaderPicture.classList.add('container-post-header-picture');
        const headerPicture = new Image();
        headerPicture.src = this.post.creator.profilePicture.url || URL_NO_IMAGE;
        headerPicture.classList.add('post-header-picture');
        CreateDataLink(headerPicture, '/user/'+this.post.creator.username);
        containerHeaderPicture.appendChild(headerPicture);
        return containerHeaderPicture;
    }

    CreatePostHeaderSignature () {
        const containerHeaderSignature = document.createElement('div');
        containerHeaderSignature.classList.add('container-post-header-signature');
        containerHeaderSignature.appendChild(this.CreatePostHeaderSignatureName());
        containerHeaderSignature.appendChild(this.CreatePostHeaderSignatureRole());
        return containerHeaderSignature;
    }

    CreatePostHeaderSignatureName () {
        const containerHeaderSignatureName = document.createElement('div');
        containerHeaderSignatureName.classList.add('container-post-header-signature-name');
        const headerSignatureName = document.createElement('span');
        headerSignatureName.classList.add('post-header-signature-name');
        headerSignatureName.textContent = this.post.creator.name;
        CreateDataLink(headerSignatureName, '/user/'+this.post.creator.username);
        const headerSignatureUsername = document.createElement('span');
        headerSignatureUsername.classList.add('post-header-signature-username');
        headerSignatureUsername.textContent = '@'+this.post.creator.username;
        containerHeaderSignatureName.appendChild(headerSignatureName);
        containerHeaderSignatureName.appendChild(headerSignatureUsername);
        return containerHeaderSignatureName;
    }

    CreatePostHeaderSignatureRole () {
        const containerHeaderSignatureRole = document.createElement('div');
        containerHeaderSignatureRole.classList.add('container-post-header-signature-role');
        const headerSignatureRole = document.createElement('span');
        headerSignatureRole.classList.add('post-header-signature-role');
        headerSignatureRole.textContent = this.post.creator.role;
        headerSignatureRole.classList.add('post-header-signature-role--'+this.post.creator.role);
        containerHeaderSignatureRole.appendChild(headerSignatureRole);
        return containerHeaderSignatureRole;
    }

    CreatePostHeaderDeleteButton () {
        const containerHeaderDeleteButton = document.createElement('div');
        containerHeaderDeleteButton.classList.add('container-post-header-button-delete');
        const headerDeleteButton = document.createElement('button');
        headerDeleteButton.classList.add('post-header-button-delete');
        headerDeleteButton.innerHTML = '<i class="fa-solid fa-ellipsis"></i>';
        headerDeleteButton.addEventListener('click', () => this.CreatePopupMenu());
        containerHeaderDeleteButton.appendChild(headerDeleteButton);
        return containerHeaderDeleteButton;
    }

    CreatePopupMenu () {
        const popup = new Popup();
        popup.CreateButton("Eliminar Publicacion", () => {
            const popupConfirmation = new Popup();
            popupConfirmation.CreateTitle('¿Estás seguro?');
            popupConfirmation.CreateButton('Sí, estoy seguro.', async () => {
                this.container.remove();
                popupConfirmation.delete();
                popup.delete();
                const request = await fetch(`/api/post/${this.post.id}/delete`, {
                    method: 'DELETE',
                    headers: {
                        "Authorization": "Bearer " + window.app.user.token
                    }
                });
                const response = await request.json();
                if (!response.ok) return alert(response.error.message);
            });
            popupConfirmation.CreateButton('No, no quiero.', () => {
                popupConfirmation.delete();
            });
        });
    }

    CreatePostFooterDate () {
        const containerFooterDate = document.createElement('div');
        containerFooterDate.classList.add('container-post-footer-date');
        const footerDate = document.createElement('span');
        footerDate.classList.add('post-footer-date');
        footerDate.textContent = getDateMessage(this.post.date);
        containerFooterDate.appendChild(footerDate);
        return containerFooterDate; 
    }

    CreatePostFooterInteractions () {
        const containerFooterInteractions = document.createElement('div');
        containerFooterInteractions.classList.add('container-post-footer-interactions');
        containerFooterInteractions.appendChild(this.CreatePostFooterInteractionUpvote());
        return containerFooterInteractions;
    }

    CreatePostFooterInteractionUpvote () {
        const containerFooterUpvote = document.createElement('div');
        containerFooterUpvote.classList.add('container-post-footer-interactions-upvote');
        
        const footerUpvote = document.createElement('span');
        
        footerUpvote.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 56 57" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.731 0.0864258H38.731V3.08643H42.731V19.0864H52.731V22.0864H56.731V45.0864H52.731V52.0864H49.731V55.0864H19.731V52.0864H0.730957V26.0864H19.731V22.0864H23.731V15.0864H26.731V0.0864258ZM31.731 4.08643V16.0864H27.731V23.0864H24.731V27.0864H20.731V30.0864H17.731V47.0864H20.731V51.0864H48.731V48.0864H44.731V44.0864H52.731V40.0864H44.731V35.0864H52.731V32.0864L45.731 31.0864L44.731 27.0864H52.731V23.0864H37.731V4.08643H31.731ZM5.73096 30.0864V47.0864H12.731V30.0864H5.73096Z" fill="white"/>
            </svg>
        `;
    
        footerUpvote.classList.add('post-footer-interactions-upvote');
        if (this.post.upvotes.find(vote => vote.id_member_upvote == window.app.user.id)) {
            footerUpvote.classList.add('post-footer-interactions-upvote--active');
            footerUpvote.children[0].children[0].setAttribute('fill', 'red');
        }
    
        const footerUpvoteNumber = document.createElement('span');
        footerUpvoteNumber.textContent = this.post.upvotes.length;
        footerUpvoteNumber.classList.add('post-footer-interactions-upvote-number');
    
        footerUpvote.addEventListener('click', () => {
            if (this.post.upvotes.find(vote => vote.id_member_upvote == window.app.user.id)) {
                footerUpvote.classList.remove('post-footer-interactions-upvote--active');
                footerUpvote.children[0].children[0].setAttribute('fill', 'white');
                this.post.upvotes = this.post.upvotes.filter(vote => vote.id_member_upvote != window.app.user.id && vote.id_post == this.post.id);
                fetch(`/api/post/${this.post.id}/upvote/delete`, { 
                    method: 'DELETE',
                    headers: { "Authorization": "Bearer "+window.app.user.token } });
            } else {
                footerUpvote.classList.add('post-footer-interactions-upvote--active');
                footerUpvote.children[0].children[0].setAttribute('fill', 'red');
                this.post.upvotes.push({ id_member_upvote: window.app.user.id, id_member_post: this.post.creator.id, id_post: this.post.id });
                fetch(`/api/post/${this.post.id}/upvote/add`, { 
                    method: 'PUT',
                    headers: { "Authorization": "Bearer "+window.app.user.token } });
            }
            footerUpvoteNumber.innerText = this.post.upvotes.length;
        });
    
        containerFooterUpvote.appendChild(footerUpvote);
        containerFooterUpvote.appendChild(footerUpvoteNumber);
        return containerFooterUpvote;
    }
}

function CreateDataLink (element, path) {
    element.setAttribute('href', path);
    element.setAttribute('data-link', '');
}