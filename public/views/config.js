import { APP_CONTAINER, navigateTo } from "../consts.js"
import {CONTENT_NAV, EventsNavButtons} from "../views.js";

export const renderConfig = (data) => {
    console.log(window.location.pathname)
    APP_CONTAINER.innerHTML = VIEW_PROFILE_CONTENT();
    EventsNavButtons();
    setEventInputImageURL()
}   

const VIEW_PROFILE_CONTENT = () => {
    return `
        <h1>Configuracion</h1>
        ${CONTENT_NAV}

        <div class="container-config-pfp">
            <h3>Cambiar Imagen de Perfil</h3>
            <p>1. Ingresa un enlace a una imagen.</p>
            <p>2. Presiona fuera del area del input para desfocusearlo. Si el enlace es valido, la imagen se mostrara debajo.</p>
            <p>3. Si la imagen es valida para recortar, en unos instantes aparecera la herramienta de recorte. Si la herramienta no aparece, posiblemente esa imagen no pueda recortarse.
            <p>3. Elige qué parte de la imagen deseas guardar.</p>
            <p>4. Presiona el botón.</p>
            <p>5. Listo.</p>

            <p>AVISO: Se recomienda que la imagen sea cuadrada.</p>
            <p>AVISO: Por el momento, la imagen no se mostrara recortada.</p>

            <input type="text" id="input-image-url">
            <button id="crop-button">Guardar</button>
            <div id="container-image"></div>
        </div>
    `;
}

function setEventInputImageURL () {
    const inputImageURL = document.getElementById('input-image-url');
    const imageContainer = document.getElementById('container-image');
    inputImageURL.addEventListener('change', () => {
        imageContainer.innerHTML = `<img id="image" src="${inputImageURL.value}" style="display: block; max-width: 100%;" />`;
        setTimeout(() => {
            createCropper()
        }, 1000)
    })
}

function createCropper () {
    const image = document.getElementById('image');

    let x;
    let y;
    let w;
    let h;

    const cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        // checkOrientation: false,
        crop(event) {
            x = parseInt(event.detail.x);
            y = parseInt(event.detail.y);
            w = parseInt(event.detail.width);
            h = parseInt(event.detail.height);
        //   console.log(event.detail.x);
        //   console.log(event.detail.y);
        //   console.log(event.detail.width);
        //   console.log(event.detail.height);
        //   console.log(event.detail.rotate);
        //   console.log(event.detail.scaleX);
        //   console.log(event.detail.scaleY);
        },
    });

    const getData = () => { return { x, y, w, h } };
    setEventButtonCrop(getData);
}


function setEventButtonCrop (getData) {
    const user = JSON.parse(localStorage.getItem('user'));
    const btn = document.getElementById('crop-button');
    
    const inputImageURL = document.getElementById('input-image-url');

    btn.addEventListener('click', async () => {
        const data = getData();
        const req = await fetch('/profile/pfp', {
            method: 'POST',
            headers: {
                "authorization": 'Bearer ' + user.token,
                "content-type": 'application/json'
            },
            body: JSON.stringify({
                user,
                image: {
                    url: inputImageURL.value,
                    view: data
                }
            })
        })
        const res = await req.json();
        if (!res.ok) {
            alert(res.error.message);
            return;
        }

        alert('Imagen Guardada')
        navigateTo('/home');
    })
}