import { URL_NO_IMAGE } from "../../consts.js";
import { cleanContent, getDateMessage } from "../../helpers.js";
import Alert from "../alert/alert.js";
import Popup from "../popup/Popup.js";

const IMAGE_POST_UPVOTE_ON = new Image();
IMAGE_POST_UPVOTE_ON.src = '/public/components/post/svg/upvote-on.svg';
IMAGE_POST_UPVOTE_ON.classList.add('post-footer-interactions-icon');

const IMAGE_POST_UPVOTE_OFF = new Image();
IMAGE_POST_UPVOTE_OFF.src = '/public/components/post/svg/upvote-off.svg';
IMAGE_POST_UPVOTE_OFF.classList.add('post-footer-interactions-icon');

const IMAGE_POST_COMMENTS = new Image();
IMAGE_POST_COMMENTS.src = '/public/components/post/svg/comments.svg';
IMAGE_POST_COMMENTS.classList.add('post-footer-interactions-icon');

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
        if (this.post.content && this.post.content.length > 0) {
            containerBody.appendChild(this.CreatePostBodyContent());
        }

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
        CreateDataLink(headerPicture, '/member/'+this.post.creator.username);
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
                    href="/member/${this.post.creator.username}"
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
        CreateDataLink(headerSignatureName, '/member/'+this.post.creator.username);


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
                if (!response.ok) return new Alert(response.error.message);
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

        this.isUpvoted() ?
            containerFooterUpvoteIcon.appendChild(IMAGE_POST_UPVOTE_ON.cloneNode(true)) :
            containerFooterUpvoteIcon.appendChild(IMAGE_POST_UPVOTE_OFF.cloneNode(true));
    
        this.footerUpvoteNumber = document.createElement('span');
        this.footerUpvoteNumber.textContent = this.post.upvotes_count;
        this.footerUpvoteNumber.style.fontSize = '20px';
        this.footerUpvoteNumber.classList.add('post-footer-interactions-upvote-number');
    
        containerFooterUpvoteIcon.addEventListener('click', () => {
            if (this.isUpvoted()) {
                containerFooterUpvoteIcon.firstChild.remove();
                containerFooterUpvoteIcon.appendChild(IMAGE_POST_UPVOTE_OFF.cloneNode(true));
                this.post.is_upvoted = false;
                this.decreaseUpvotes();
                fetch(`/api/post/${this.post.id}/upvote/delete`, { 
                    method: 'DELETE',
                    headers: { "Authorization": "Bearer "+window.app.user.token } });
            } else {
                containerFooterUpvoteIcon.firstChild.remove();
                containerFooterUpvoteIcon.appendChild(IMAGE_POST_UPVOTE_ON.cloneNode(true));
                this.post.is_upvoted = true;
                this.increaseUpvotes();
                fetch(`/api/post/${this.post.id}/upvote/add`, { 
                    method: 'PUT',
                    headers: { "Authorization": "Bearer "+window.app.user.token } });
            }
            this.drawUpvotesCount();
        });

        containerFooterUpvote.appendChild(containerFooterUpvoteIcon);
        containerFooterUpvote.appendChild(this.footerUpvoteNumber);
        return containerFooterUpvote;
    }

    drawUpvotesCount () {
        this.footerUpvoteNumber.innerText = this.getUpvotesCount();
    }

    increaseUpvotes () {
        this.post.upvotes_count = parseInt(this.post.upvotes_count) + 1;
    }

    decreaseUpvotes () {
        this.post.upvotes_count = parseInt(this.post.upvotes_count) - 1;
    }

    getUpvotesCount () {
        return parseInt(this.post.upvotes_count);
    }

    isUpvoted () {
        return this.post.is_upvoted;
    }

    CreatePostFooterInteractionComments () {
        const container = document.createElement('div');
        container.classList.add('container-post-footer-interactions-comments');

        const containerIcon = document.createElement('div');
        containerIcon.classList.add('container-post-footer-interactions-comments-icon');
        const ICON = IMAGE_POST_COMMENTS.cloneNode(true);
        CreateDataLink(ICON, '/post/'+this.post.id+'/comments');
        containerIcon.appendChild(ICON);

        this.number = document.createElement('span');
        this.drawCommentsCount();

        container.appendChild(containerIcon);
        container.appendChild(this.number);

        return container;
    }

    async FetchComments () {
        const request = await fetch('/api/post/'+this.post.id+'/comments/count', {
            method: "GET",
            headers: { "Authorization": "Bearer "+window.app.user.token }
        });
        const response = await request.json();
        if (response.ok) this.number.textContent = response.count;
    }

    increaseComments () {
        this.post.comments_count = parseInt(this.post.comments_count) + 1;
    }

    decreaseComments () {
        this.post.comments_count = parseInt(this.post.comments_count) - 1;
    }

    drawCommentsCount () {
        this.number.innerText = this.getCommentsCount();
    }

    getCommentsCount () {
        return parseInt(this.post.comments_count);
    }
}


function CreateDataLink (element, path) {
    element.setAttribute('href', path);
    element.setAttribute('data-link', '');
}