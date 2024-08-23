import {URL_NO_IMAGE} from "../../consts.js";
import {cleanContent, getDateMessage} from "../../helpers.js";

export default function (post) {
    return createPost(post);
}

function createPost (post) {
    const postContainer = document.createElement('div');
    postContainer.setAttribute('class', 'container-post');
    // postContainer.setAttribute('data-link', '');
    // postContainer.setAttribute('href', '/post/'+post.id);
    postContainer.style = `
        padding: 10px;
        border-bottom: 1px solid gray;

        display: grid;
        grid-template-columns: auto;
        grid-template-rows: auto auto auto;
        gap: 15px;
    `;

    postContainer.appendChild(createPostHeader(post));
    // if (post.image) postContainer.appendChild(createPostImage(post));
    postContainer.appendChild(createPostContent(post));

    const containerInteractions = document.createElement('div');
    containerInteractions.style = `
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows;
        gap: 10px;
        justify-items: center;
    `;

    const containerCommentsInteraction = document.createElement('div');
    containerCommentsInteraction.style = `
        border: 1px solid gray;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const spanComment = document.createElement('span');
    spanComment.innerHTML = '???';
    containerCommentsInteraction.appendChild(spanComment);

    const containerUpvoteInteraction = document.createElement('div');
    containerUpvoteInteraction.style = `
        border: 1px solid gray;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    `;

    const spanCountUpvotes = document.createElement('span');
    const upvoteButton = document.createElement('button');

    containerUpvoteInteraction.appendChild(spanCountUpvotes);
    containerUpvoteInteraction.appendChild(upvoteButton);

    spanCountUpvotes.innerText = post.upvotes.length;

    upvoteButton.innerHTML = '<i class="fa-solid fa-paw"></i>';
    upvoteButton.style =`
        color: #FFF;
        background: none;
        border: none;
        outline: none;
        font-size: 14px;
    `;

    if (window.app.user.role === 'tester' || window.app.user.role === 'admin') {
        containerUpvoteInteraction.addEventListener('click', () => upvote(post));
        containerUpvoteInteraction.style.cursor = 'pointer';
    }

    const containerInteraction = document.createElement('div');
    containerInteraction.style = `
        border: 1px solid gray;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    `;
    containerInteraction.innerText = '???';

    containerInteractions.appendChild(containerCommentsInteraction);
    containerInteractions.appendChild(containerUpvoteInteraction);
    containerInteractions.appendChild(containerInteraction);

    postContainer.appendChild(containerInteractions);
    return postContainer;
}

function upvote (post) {
    fetch(`/api/post/${post.id}/upvote/add`, { 
        method: 'PUT',
        headers: { "Authorization": "Bearer "+window.app.user.token } });
}

function deleteUpvote (post) {
    fetch(`/api/post/${post.id}/upvote/delete`, { 
        method: 'DELETE',
        headers: { "Authorization": "Bearer "+window.app.user.token } });
}

function createPostHeader (post) {
    const headerContainer = document.createElement('div');
    headerContainer.setAttribute('class', 'container-sign');

    const pSign = document.createElement('p');
    const strongSign = document.createElement('strong');
    const aSign = document.createElement('a');
    const spanSign = document.createElement('span');
    
    aSign.setAttribute('href', '/user/'+post.creator.username);
    aSign.setAttribute('data-link', '');
    aSign.textContent = post.creator.name;

    strongSign.appendChild(aSign);
    strongSign.style = 'cursor:pointer;';
    
    pSign.appendChild(strongSign);

    spanSign.textContent = ' - '+getDateMessage(post.date);
    pSign.appendChild(spanSign);
    pSign.style.margin = '0';
    pSign.style.padding = '0';

    const containerRole = document.createElement('div');
    const spanRole = document.createElement('span');
    spanRole.innerText = post.creator.role.toUpperCase();

    const colorMap = {
        "admin": "red",
        "member": "aqua",
        "tester": "yellow",
        "mod": "green"
    }

    spanRole.style = `
        padding: 5px;
        color: ${colorMap[post.creator.role]};
        font-size: 12px;
        border: 1px solid ${colorMap[post.creator.role]};
        border-radius: 8px;
    `
    containerRole.appendChild(spanRole);
    containerRole.style = `
        display: flex;
        justify-content: flex-start;
        align-items: center;
    `;

    const containerNameRole = document.createElement('div');
    containerNameRole.appendChild(pSign);
    containerNameRole.appendChild(containerRole);
    containerNameRole.style = `
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: auto auto;
        gap: 5px;

        justify-items: start;
        align-content: start;
    `;

    headerContainer.style = `        
        display: grid;
        grid-template-columns: min-content auto;
        grid-template-rows: auto;
        justify-items: start;
        align-content: center;
        gap: 10px;
    `;
    headerContainer.appendChild(createPostUserPicture(post));
    headerContainer.appendChild(containerNameRole);
    return headerContainer;
}

function createPostUserPicture (post) {
    const userPictureContainer = document.createElement('div');
    userPictureContainer.setAttribute('class', 'container-user-picture');
    userPictureContainer.appendChild(createProfileImage(post));
    userPictureContainer.style = `
        width: 50px;
        height: 50px;
        border: 1px solid #FFF; 
        cursor: pointer;
        overflow: hidden;
    `;
    return userPictureContainer;
}

function createProfileImage (post) {
    const creator = post.creator;
    const image = creator.profilePicture;
    const imageUrl = image.url || URL_NO_IMAGE;

    const img = new Image();
    img.src = imageUrl;
    img.setAttribute('class', 'image-user-picture');
    img.setAttribute('href', '/user/'+post.creator.username);
    img.setAttribute('data-link', '');
    img.addEventListener('load', () => {                
        img.style = `
            width: 100%;
            height: 100%;
            object-fit: cover;
        `;
    });
    return img;
}

// function createPostImage (post) {
//     const imageContainer = document.createElement('div');
//     imageContainer.classList.add('container-post-image');

// }

function createPostContent (post) {
    const pContent = document.createElement('p');
    pContent.style = 'overflow-wrap: break-word; margin: 0;';
    pContent.innerHTML = cleanContent(post.content);   
    return pContent;
}