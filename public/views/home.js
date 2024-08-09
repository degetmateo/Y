import { APP_CONTAINER, updateContent } from "../consts.js";

export const viewHome = async () => {
    APP_CONTAINER.innerHTML = HOME_CONTENT();
    document.title = 'Y - Inicio'
    setEventFormLogout();
    setEventFormPostCreate();
    loadPosts();
}

function HOME_CONTENT () {
    const user = JSON.parse(localStorage.getItem('user'));

    return `
        <h2>Bienvenide, ${user.name}</h2> 
        <span>(no andan los favs es solo decoracion)</span><br>
        <span>(el que lee se la come)</span>

        <h3>Cerrar Sesion</h3>
        <form action="/user" method="delete" id="form-logout">
            <button type="submit">Cerrar Sesion</button>
        </form>

        <h3>Publicar</h3>
        <form action="/post/create" method="post" id="form-post-create">
            <input type="text" id="form-post-create-input-content" name="form-post-create-input-content" placeholder="¡¿Qué está pasando?!" required>
            <button type="submit">Publicar</button>
        </form>

        <h3>Publicaciones</h3>
        <div id="timeline-container" class="timeline-container"></div>
    `;
}

function setEventFormLogout () {
    const formLogout = document.getElementById('form-logout');
    formLogout.addEventListener('submit', async event => {
        event.preventDefault();
        localStorage.removeItem('user');
        updateContent('user')
    })
}

async function setEventFormPostCreate () {
    const form = document.getElementById('form-post-create')
    const inputContent = document.getElementById('form-post-create-input-content')

    form.addEventListener('submit', async event => {
        event.preventDefault()
        const content = inputContent.value;
        const user = JSON.parse(localStorage.getItem('user'));
        const request = await fetch ('/post/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': "application/json"
            },
            body: JSON.stringify({ user, post: { content } })
        })

        const res = await request.json();

        if (!res.ok) {
            alert(res.error.message)
            return;
        }
        inputContent.value = ''
        await loadPosts();
    })
}

async function loadPosts () {
    const timelineContainer = document.getElementById('timeline-container');
    timelineContainer.innerHTML = '';
    const user = JSON.parse(localStorage.getItem('user'));
    const request = await fetch ('/posts', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${user.token}`,
        }
    })

    const response = await request.json();
    console.log(response)
    if (!response.ok) {
        if (response.error) alert(response.error.message);
        return;
    }

    for (const post of response.posts.reverse()) {
        const now = new Date();
        const created_at = new Date(post.date);
        const dif = now.getTime() - created_at.getTime();

        const seconds = Math.floor(dif / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        let made_at = '';

        if (days > 0) {
            days === 1 ? 
                made_at = `hace ${days} día` :
                made_at = `hace ${days} días`;
        } else if (hours > 0) {
            hours === 1 ?
                made_at = `hace ${hours} hora` :
                made_at = `hace ${hours} horas`;
        } else if (minutes > 0) {
            minutes === 1 ?
                made_at = `hace ${minutes} minuto` :
                made_at = `hace ${minutes} minutos`; 
        } else if (seconds > 0) {
            seconds === 1 ?
                made_at = `hace ${seconds} segundo` :
                made_at = `hace ${seconds} segundos`;
        } else {
            made_at = 'ahora'
        }

        console.log(post)
        timelineContainer.innerHTML += `
            <div style="display: block; padding-bottom: 15px; border-bottom: 1px solid gray;" class="post-container">
                <p><strong>${post.creator.name}</strong> ▪ ${made_at}</p>
                <p style="overflow-wrap: break-word">${post.content}</p>
                <div style="display:flex;" class="post-interactions-container">
                    <span style="margin: 0 5px">${post.comments.length} 💬</span>
                    <span style="margin: 0 5px">${post.likes.length} ❤️</span>
                </div>
            </div>
        `;
    }
}