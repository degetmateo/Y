import { URL_NO_IMAGE } from "../../consts.js";
import { cleanContent, getDateMessage } from "../../helpers.js";
import {navigateTo} from "../../router.js";
import Popup from "../../components/popup/Popup.js";

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
        containerHeader.appendChild(this.CreatePostHeaderButtonOptions());
        return containerHeader;
    }

    CreatePostBody () {
        const containerBody = document.createElement('div');
        containerBody.classList.add('container-post-body');
        containerBody.appendChild(this.CreatePostBodyContent());

        if (this.post.images && this.post.images.length > 0) {
            const imagesContainer = document.createElement('div');
            imagesContainer.classList.add('container-post-body-images');
            for (const image of this.post.images) {
                try {
                    const img = new Image();
                    img.src = image;
                    img.addEventListener('error', () => imagesContainer.remove());
                    img.classList.add('post-body-image');
                    imagesContainer.appendChild(img);
                } catch (error) {
                    continue;
                }
            }
            containerBody.appendChild(imagesContainer);
        }
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

        containerHeaderSignature.innerHTML = `
            <div class="container-post-header-signature-name_role">
                <span 
                    class="post-header-signature-name" id="post-member-name"
                    href="/user/${this.post.creator.username}"
                    data-link
                >
                    ${this.post.creator.name}
                </span>

                <span 
                    class="post-header-signature-role post-header-signature-role--${this.post.creator.role}" 
                    id="post-member-role">
                        ${this.post.creator.role}
                </span>
            </div>

            <span class="post-header-signature-username" id="post-member-username">@${this.post.creator.username}</span>
        `;

        // containerHeaderSignature.appendChild(this.CreatePostHeaderSignatureName());
        // containerHeaderSignature.appendChild(this.CreatePostHeaderSignatureRole());
        return containerHeaderSignature;
    }

    CreatePostHeaderSignatureName () {
        const containerHeaderSignatureName = document.createElement('div');
        containerHeaderSignatureName.classList.add('container-post-header-signature-name');
        const headerSignatureName = document.createElement('span');
        headerSignatureName.classList.add('post-header-signature-name');
        headerSignatureName.textContent = this.post.creator.name;
        CreateDataLink(headerSignatureName, '/user/'+this.post.creator.username);


        // const headerSignatureUsername = document.createElement('span');
        // headerSignatureUsername.classList.add('post-header-signature-username');
        // headerSignatureUsername.textContent = '@'+this.post.creator.username;
        // containerHeaderSignatureName.appendChild(headerSignatureName);
        // containerHeaderSignatureName.appendChild(headerSignatureUsername);
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

    CreatePostHeaderButtonOptions () {
        const containerHeaderButtonOptions = document.createElement('div');
        containerHeaderButtonOptions.classList.add('container-post-header-button-delete');
        const headerOptionsButton = document.createElement('button');
        headerOptionsButton.classList.add('post-header-button');
        headerOptionsButton.innerHTML = `
            <div class="post-header-button-box"></div>
            <div class="post-header-button-box"></div>
            <div class="post-header-button-box"></div>
        `;
        window.app.user.id == this.post.creator.id ?
            headerOptionsButton.addEventListener('click', () => this.CreatePopupMenuSelf()) :
            headerOptionsButton.addEventListener('click', () => this.CreatePopupMenuOther());
        containerHeaderButtonOptions.appendChild(headerOptionsButton);
        return containerHeaderButtonOptions;
    }

    CreatePopupMenuSelf () {
        const popup = new Popup();
        popup.CreateButton("Reportar Publicación", () => {
            popup.delete();
        });
        popup.CreateButton("Eliminar Publicación", () => {
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

    CreatePopupMenuOther () {
        const popup = new Popup();
        popup.CreateButton("Reportar Publicación", () => {
            popup.delete();
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
        containerFooterInteractions.appendChild(this.CreatePostFooterInteractionComments());
        return containerFooterInteractions;
    }

    CreatePostFooterInteractionUpvote () {
        const containerFooterUpvote = document.createElement('div');
        containerFooterUpvote.classList.add('container-post-footer-interactions-upvote');
        
        const containerFooterUpvoteIcon = document.createElement('div');
        containerFooterUpvoteIcon.classList.add('container-post-footer-upvote-icon');
        

        const getIconUpvoteFilled = () => {
            const UPVOTE_IMG_FILLED = document.createElement('img');
            UPVOTE_IMG_FILLED.src = '/public/views/elements/svg/upvote-filled.svg';
            UPVOTE_IMG_FILLED.classList.add('post-footer-interactions-comments-icon');
            return UPVOTE_IMG_FILLED;
        }

        const getIconUpvoteUnfilled = () => {
            const UPVOTE_IMG_UNFILLED = document.createElement('img');
            UPVOTE_IMG_UNFILLED.src = '/public/views/elements/svg/upvote-unfilled.svg';
            UPVOTE_IMG_UNFILLED.classList.add('post-footer-interactions-comments-icon');
            return UPVOTE_IMG_UNFILLED;
        }

        containerFooterUpvoteIcon.appendChild(getIconUpvoteUnfilled());
    
        if (this.post.upvotes.find(vote => vote.id_member_upvote == window.app.user.id)) {
            containerFooterUpvoteIcon.firstChild.remove();
            containerFooterUpvoteIcon.appendChild(getIconUpvoteFilled());
        }
    
        const footerUpvoteNumber = document.createElement('span');
        footerUpvoteNumber.textContent = this.post.upvotes.length;
        footerUpvoteNumber.style.fontSize = '20px';
        footerUpvoteNumber.classList.add('post-footer-interactions-upvote-number');
    
        containerFooterUpvoteIcon.addEventListener('click', () => {
            if (this.post.upvotes.find(vote => vote.id_member_upvote == window.app.user.id)) {
                containerFooterUpvoteIcon.firstChild.remove();
                containerFooterUpvoteIcon.appendChild(getIconUpvoteUnfilled());
                this.post.upvotes = this.post.upvotes.filter(vote => vote.id_member_upvote != window.app.user.id && vote.id_post == this.post.id);
                fetch(`/api/post/${this.post.id}/upvote/delete`, { 
                    method: 'DELETE',
                    headers: { "Authorization": "Bearer "+window.app.user.token } });
            } else {
                containerFooterUpvoteIcon.firstChild.remove();
                containerFooterUpvoteIcon.appendChild(getIconUpvoteFilled());
                this.post.upvotes.push({ id_member_upvote: window.app.user.id, id_member_post: this.post.creator.id, id_post: this.post.id });
                fetch(`/api/post/${this.post.id}/upvote/add`, { 
                    method: 'PUT',
                    headers: { "Authorization": "Bearer "+window.app.user.token } });
            }
            footerUpvoteNumber.innerText = this.post.upvotes.length;
        });

        containerFooterUpvote.appendChild(containerFooterUpvoteIcon);
        containerFooterUpvote.appendChild(footerUpvoteNumber);
        return containerFooterUpvote;
    }

    CreatePostFooterInteractionComments () {
        const container = document.createElement('div');
        container.classList.add('container-post-footer-interactions-comments');

        const containerIcon = document.createElement('div');
        containerIcon.classList.add('container-post-footer-interactions-comments-icon');

        const icon = document.createElement('img');
        icon.classList.add('post-footer-interactions-comments-icon');
        icon.src = '/public/views/elements/svg/comments.svg';
        containerIcon.appendChild(icon);

        const number = document.createElement('span');
        number.textContent = '0';
        container.appendChild(containerIcon);
        container.appendChild(number);
        return container;
    }
}

function CreateDataLink (element, path) {
    element.setAttribute('href', path);
    element.setAttribute('data-link', '');
}