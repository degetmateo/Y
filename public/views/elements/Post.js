import { URL_NO_IMAGE } from "../../consts.js";
import { cleanContent, getDateMessage } from "../../helpers.js";
import {navigateTo} from "../../router.js";

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
    if (window.app.user.id == post.creator.id) containerHeader.appendChild(CreatePostHeaderDeleteButton(post));
    return containerHeader;
}

function CreatePostBody (post) {
    const containerBody = document.createElement('div');
    containerBody.classList.add('container-post-body');
    containerBody.appendChild(CreatePostBodyContent(post));
    if (post.images && post.images.length > 0) containerBody.appendChild(CreatePostBodyImages(post));
    return containerBody;
}

function CreatePostBodyContent (post) {
    const bodyContent = document.createElement('span');
    bodyContent.classList.add('post-body-content');
    bodyContent.innerHTML = cleanContent(post.content);
    return bodyContent;
}

function CreatePostBodyImages (post) {
    const imagesContainer = document.createElement('div');
    imagesContainer.classList.add('container-post-body-images');
    for (const image of post.images) {
        const img = new Image();
        img.src = image;
        img.classList.add('post-body-image');
        imagesContainer.appendChild(img);
    }
    return imagesContainer;
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
    CreateDataLink(headerPicture, '/user/'+post.creator.username);

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
    // CreateDataLink(containerHeaderSignatureName, '/post/'+post.id);

    const headerSignatureName = document.createElement('span');
    headerSignatureName.classList.add('post-header-signature-name');
    headerSignatureName.textContent = post.creator.name;
    CreateDataLink(headerSignatureName, '/user/'+post.creator.username);

    const headerSignatureUsername = document.createElement('span');
    headerSignatureUsername.classList.add('post-header-signature-username');
    headerSignatureUsername.textContent = '@'+post.creator.username;
    // CreateDataLink(headerSignatureUsername, '/post/'+post.id);

    containerHeaderSignatureName.appendChild(headerSignatureName);
    containerHeaderSignatureName.appendChild(headerSignatureUsername);
    return containerHeaderSignatureName;
}

function CreatePostHeaderSignatureRole (post) {
    const containerHeaderSignatureRole = document.createElement('div');
    containerHeaderSignatureRole.classList.add('container-post-header-signature-role');
    // CreateDataLink(containerHeaderSignatureRole, '/post/'+post.id);

    const headerSignatureRole = document.createElement('span');
    headerSignatureRole.classList.add('post-header-signature-role');
    headerSignatureRole.textContent = post.creator.role;
    headerSignatureRole.classList.add('post-header-signature-role--'+post.creator.role);

    containerHeaderSignatureRole.appendChild(headerSignatureRole);
    return containerHeaderSignatureRole;
}

function CreatePostHeaderDeleteButton (post) {
    const containerHeaderDeleteButton = document.createElement('div');
    containerHeaderDeleteButton.classList.add('container-post-header-button-delete');

    const headerDeleteButton = document.createElement('button');
    headerDeleteButton.classList.add('post-header-button-delete');
    headerDeleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    headerDeleteButton.addEventListener('click', () => HeaderDeleteButtonEvent(post));

    containerHeaderDeleteButton.appendChild(headerDeleteButton);
    return containerHeaderDeleteButton;
}

async function HeaderDeleteButtonEvent (post) {
    const request = await fetch(`/api/post/${post.id}/delete`, {
        method: 'DELETE',
        headers: {
            "Authorization": "Bearer " + window.app.user.token
        }
    });
    const response = await request.json();
    if (!response.ok) return alert(response.error.message);
    navigateTo(window.location.pathname);
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
    
    footerUpvote.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 56 57" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26.731 0.0864258H38.731V3.08643H42.731V19.0864H52.731V22.0864H56.731V45.0864H52.731V52.0864H49.731V55.0864H19.731V52.0864H0.730957V26.0864H19.731V22.0864H23.731V15.0864H26.731V0.0864258ZM31.731 4.08643V16.0864H27.731V23.0864H24.731V27.0864H20.731V30.0864H17.731V47.0864H20.731V51.0864H48.731V48.0864H44.731V44.0864H52.731V40.0864H44.731V35.0864H52.731V32.0864L45.731 31.0864L44.731 27.0864H52.731V23.0864H37.731V4.08643H31.731ZM5.73096 30.0864V47.0864H12.731V30.0864H5.73096Z" fill="white"/>
        </svg>
    `;

    footerUpvote.classList.add('post-footer-interactions-upvote');
    if (post.upvotes.find(vote => vote.id_member_upvote == window.app.user.id)) {
        footerUpvote.classList.add('post-footer-interactions-upvote--active');
        footerUpvote.children[0].children[0].setAttribute('fill', 'red');
    }

    const footerUpvoteNumber = document.createElement('span');
    footerUpvoteNumber.textContent = post.upvotes.length;
    footerUpvoteNumber.classList.add('post-footer-interactions-upvote-number');

    footerUpvote.addEventListener('click', () => {
        if (post.upvotes.find(vote => vote.id_member_upvote == window.app.user.id)) {
            footerUpvote.classList.remove('post-footer-interactions-upvote--active');
            footerUpvote.children[0].children[0].setAttribute('fill', 'white');
            post.upvotes = post.upvotes.filter(vote => vote.id_member_upvote != window.app.user.id && vote.id_post == post.id);
            fetch(`/api/post/${post.id}/upvote/delete`, { 
                method: 'DELETE',
                headers: { "Authorization": "Bearer "+window.app.user.token } });
        } else {
            footerUpvote.classList.add('post-footer-interactions-upvote--active');
            footerUpvote.children[0].children[0].setAttribute('fill', 'red');
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

function CreateDataLink (element, path) {
    element.setAttribute('href', path);
    element.setAttribute('data-link', '');
}