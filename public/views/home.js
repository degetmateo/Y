import { APP_CONTAINER, navigateTo } from "../consts.js";
import {CONTENT_NAV, EventsNavButtons} from "../views.js";

export const renderHome = async (data) => {
    APP_CONTAINER.innerHTML = HOME_CONTENT();
    document.title = 'miau - Inicio'

    getUserData().then(res => {
        document.getElementById('title').textContent = 'Bienvenide, '+res.user.name
    })

    EventsNavButtons();
    setEventFormPostCreate();
    setEventButtonRefresh();
    loadPosts();
}

async function getUserData () {
    const user = JSON.parse(localStorage.getItem('user'))
    const req = await fetch('/user', { 
        method: 'GET',
        headers: { "authorization": 'Bearer ' + user.token }
    
    })

    const res = await req.json();
    return res;
}

function HOME_CONTENT () {
    return `
        <h2 id="title"></h2> 
        <span>(no andan los favs es solo decoracion)</span><br>
        <span>(el que lee se la come)</span>

        ${CONTENT_NAV}

        <h3>Publicar</h3>
        <form action="/post/create" method="post" id="form-post-create">
            <div style="
                display: flex;
            ">
                <textarea style="width: 100%; max-width: 500px; height: 60px;" id="form-post-create-input-content" name="form-post-create-input-content" placeholder="¡¿Qué está pasando?!" required></textarea>
                <button type="submit">Publicar</button>
            </div>
        </form>

        <div style="
            width: 100%;
            height: 70px;
        ">
            <h3>Publicaciones</h3>
            <button type="button" id="refresh-button">Refrescar</button>
        </div>
        <div style="padding-bottom: 15px; border-bottom: 1px solid gray;"></div>
        <div id="timeline-container" class="timeline-container"></div>
    `;
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

function setEventButtonRefresh () {
    const button = document.getElementById('refresh-button');
    button.addEventListener('click', event => {
        event.preventDefault();
        loadPosts();
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
        localStorage.removeItem('user')
        navigateTo('/login', null)
        return;
    }

    for (const post of response.posts.reverse()) {
        timelineContainer.innerHTML += `
            <div style="display: block; padding-bottom: 15px; border-bottom: 1px solid gray;" class="post-container">
                <p><strong>${post.creator.name}</strong> ▪ ${getDateMessage(post.date)}</p>
                <p style="overflow-wrap: break-word">${post.content}</p>
                <div style="display:flex;" class="post-interactions-container">
                    <span style="margin: 0 5px 0 0">${0} 💬</span>
                    <span style="margin: 0 5px 0 0">${0} ❤️</span>
                </div>
            </div>
        `;
    }
}

function getDateMessage (_parsedTimeUnits) {
    let made_at = '';

    const years = _parsedTimeUnits.years;
    const months = _parsedTimeUnits.months;
    const days = _parsedTimeUnits.days;
    const hours = _parsedTimeUnits.hours;
    const minutes = _parsedTimeUnits.minutes;
    const seconds = _parsedTimeUnits.seconds;

    if (years > 0) {
        years === 1 ? 
            made_at = `hace ${years} año` :
            made_at = `hace ${years} años`;
    }
    else if (months > 0) {
        months === 1 ? 
            made_at = `hace ${months} mes` :
            made_at = `hace ${months} meses`;
    }
    else if (days > 0) {
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

    return made_at;
}