const view = document.createElement('div');

view.id = 'container-view';
view.classList.add('container-home-view');

const mobileForm = document.createElement('div');
mobileForm.id = 'container-mobile-form-post-create';
mobileForm.classList.add('container-mobile-form-post-create');
mobileForm.style.display = 'none';

view.appendChild(mobileForm);

const main = document.createElement('div');

main.id = 'container-main';
main.classList.add('container-main');

main.innerHTML = `
    <div class="container-home-main-form-post-create-div">
        <div class="container-home-main-form-post-create-profile_pic">
            <img class="home-main-form-post-create-profile_pic" id="home-main-form-post-create-profile_pic" src="" />
        </div>

        <div class="container-home-main-form-post-create-body">
            <div class="container-home-main-form-post-create-signature">
                <div class="container-home-main-form-post-create-name">
                    <span class="home-main-form-post-create-name" id="home-main-form-post-create-name"></span>
                </div>
            </div>
            
            <textarea id="home-main-form-post-create-textarea" class="home-main-form-post-create-textarea" placeholder="¿Qué pensás?" required></textarea>
                
            <div class="container-home-main-form-post-create-buttons">
                <div class="container-home-main-form-post-create-options">
                    <select id="options" name="options" class="home-main-form-post-create-button home-main-form-post-create-button-options" disabled>
                        <option value="opcion1">Todos</option>
                    </select>

                    <div id="home-main-form-post-create-button-media--image" class="home-main-form-post-create-button-media">IMG</div>
                    <div id="home-main-form-post-create-button-media--tenor" class="home-main-form-post-create-button-media">GIF</div>
                </div>
                <button id="home-main-form-post-create-button" class="button home-main-form-post-create-button">Publicar</button>
            </div>
        </div>
    </div>

    <div class="container-button-change-timeline">
        <button class="button-change-timeline active" type="button" id="button-change-timeline-global"><span>Global</span></button>
        <button class="button-change-timeline" type="button" id="button-change-timeline-following"><span>Siguiendo</span></button>
    </div>
`;

const timeline = document.createElement('div');
timeline.id = 'container-timeline';
timeline.classList.add('container-timeline');

main.appendChild(timeline);
view.appendChild(main);

export { view, main, timeline };