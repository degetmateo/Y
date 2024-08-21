import {URL_NO_IMAGE} from "../../consts.js";
import {getDateMessage} from "../../helpers.js";

export default function (post) {
    return createPost(post);
}

function createPost (post) {
    console.log(post)
    const postContainer = document.createElement('div');
    postContainer.setAttribute('class', 'container-post');
    // postContainer.setAttribute('data-link', '');
    // postContainer.setAttribute('href', '/post/'+post.id);
    postContainer.style = `
        padding: 10px;
        border-bottom: 1px solid gray;

        display: grid;
        grid-template-columns: auto;
        grid-template-rows: auto auto;
        gap: 15px;
    `;

    postContainer.appendChild(createPostHeader(post));
    // if (post.image) postContainer.appendChild(createPostImage(post));
    postContainer.appendChild(createPostContent(post));
    return postContainer;
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
        "beta": "yellow",
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

    const escapedText = post.content
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const clickableText = escapedText.replace(urlPattern, function(url) {
        return `<a href="${url}" class="link" target="_blank">${url}</a>`;
    });

    pContent.innerHTML = clickableText.replace(/\n/g, '<br>');   
    return pContent;
}