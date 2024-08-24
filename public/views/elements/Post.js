import { URL_NO_IMAGE } from "../../consts.js";
import { cleanContent, getDateMessage } from "../../helpers.js";

export default function (post) {
    const container = document.createElement('div');
    container.classList.add('container-post');
    container.appendChild(CreatePostHeader(post));
    container.appendChild(CreatePostBody(post));
    container.appendChild(CreatePostFooter(post));
    return container;
}

function CreatePostHeader (post) {
    const containerHeader = document.createElement('div');
    containerHeader.classList.add('container-post-header');
    containerHeader.appendChild(CreatePostHeaderPicture(post));
    containerHeader.appendChild(CreatePostHeaderSignature(post));
    return containerHeader;
}

function CreatePostBody (post) {
    const containerBody = document.createElement('div');
    containerBody.classList.add('container-post-body');
    const bodyContent = document.createElement('span');
    bodyContent.classList.add('post-body-content');
    bodyContent.innerHTML = cleanContent(post.content);
    containerBody.appendChild(bodyContent);
    return containerBody;
}

function CreatePostFooter (post) {
    const containerFooter = document.createElement('div');
    containerFooter.classList.add('container-post-footer');
    containerFooter.appendChild(CreatePostFooterInteractions(post));
    containerFooter.appendChild(CreatePostFooterDate(post));
    return containerFooter;
}

function CreatePostHeaderPicture (post) {
    const containerHeaderPicture = document.createElement('div');
    containerHeaderPicture.classList.add('container-post-header-picture');
    const headerPicture = new Image();
    headerPicture.src = post.creator.profilePicture.url || URL_NO_IMAGE;
    headerPicture.classList.add('post-header-picture');
    headerPicture.setAttribute('href', '/user/'+post.creator.username);
    headerPicture.setAttribute('data-link', '');
    containerHeaderPicture.appendChild(headerPicture);
    return containerHeaderPicture;
}

function CreatePostHeaderSignature (post) {
    const containerHeaderSignature = document.createElement('div');
    containerHeaderSignature.classList.add('container-post-header-signature');
    containerHeaderSignature.appendChild(CreatePostHeaderSignatureName(post));
    containerHeaderSignature.appendChild(CreatePostHeaderSignatureRole(post));
    return containerHeaderSignature;
}

function CreatePostHeaderSignatureName (post) {
    const containerHeaderSignatureName = document.createElement('div');
    containerHeaderSignatureName.classList.add('container-post-header-signature-name');

    const headerSignatureName = document.createElement('span');
    headerSignatureName.classList.add('post-header-signature-name');
    headerSignatureName.textContent = post.creator.name;

    const headerSignatureUsername = document.createElement('span');
    headerSignatureUsername.classList.add('post-header-signature-username');
    headerSignatureUsername.textContent = '@'+post.creator.username;

    containerHeaderSignatureName.appendChild(headerSignatureName);
    containerHeaderSignatureName.appendChild(headerSignatureUsername);
    return containerHeaderSignatureName;
}

function CreatePostHeaderSignatureRole (post) {
    const containerHeaderSignatureRole = document.createElement('div');
    containerHeaderSignatureRole.classList.add('container-post-header-signature-role');

    const headerSignatureRole = document.createElement('span');
    headerSignatureRole.classList.add('post-header-signature-role');
    headerSignatureRole.textContent = post.creator.role;
    headerSignatureRole.classList.add('post-header-signature-role--'+post.creator.role);

    containerHeaderSignatureRole.appendChild(headerSignatureRole);
    return containerHeaderSignatureRole;
}


function CreatePostFooterDate (post) {
    const containerFooterDate = document.createElement('div');
    containerFooterDate.classList.add('container-post-footer-date');
    const footerDate = document.createElement('span');
    footerDate.classList.add('post-footer-date');
    footerDate.textContent = getDateMessage(post.date);
    containerFooterDate.appendChild(footerDate);
    return containerFooterDate; 
}

function CreatePostFooterInteractions (post) {
    const containerFooterInteractions = document.createElement('div');
    containerFooterInteractions.classList.add('container-post-footer-interactions');
    containerFooterInteractions.appendChild(CreatePostFooterInteractionUpvote(post));
    return containerFooterInteractions;
}

function CreatePostFooterInteractionUpvote (post) {
    const containerFooterUpvote = document.createElement('div');
    containerFooterUpvote.classList.add('container-post-footer-interactions-upvote');
    
    const footerUpvote = document.createElement('span');
    footerUpvote.innerHTML = '<i class="fa-solid fa-paw"></i>';
    footerUpvote.classList.add('post-footer-interactions-upvote');
    if (post.upvotes.find(vote => vote.id_member_upvote == window.app.user.id)) {
        console.log('is voted')
        footerUpvote.classList.add('post-footer-interactions-upvote--active');
    }

    const footerUpvoteNumber = document.createElement('span');
    footerUpvoteNumber.textContent = post.upvotes.length;
    footerUpvoteNumber.classList.add('post-footer-interactions-upvote-number');

    footerUpvote.addEventListener('click', () => {
        if (post.upvotes.find(vote => vote.id_member_upvote == window.app.user.id)) {
            footerUpvote.classList.remove('post-footer-interactions-upvote--active');
            post.upvotes = post.upvotes.filter(vote => vote.id_member_upvote != window.app.user.id && vote.id_post == post.id);
            fetch(`/api/post/${post.id}/upvote/delete`, { 
                method: 'DELETE',
                headers: { "Authorization": "Bearer "+window.app.user.token } });
        } else {
            footerUpvote.classList.add('post-footer-interactions-upvote--active');
            post.upvotes.push({ id_member_upvote: window.app.user.id, id_member_post: post.creator.id, id_post: post.id });
            fetch(`/api/post/${post.id}/upvote/add`, { 
                method: 'PUT',
                headers: { "Authorization": "Bearer "+window.app.user.token } });
        }
        footerUpvoteNumber.innerText = post.upvotes.length;
    });

    containerFooterUpvote.appendChild(footerUpvote);
    containerFooterUpvote.appendChild(footerUpvoteNumber);
    return containerFooterUpvote;
}