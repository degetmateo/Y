import {APP_CONTAINER} from "../consts.js"

export const renderError = (data) => {
    APP_CONTAINER.innerHTML = `
        <div class="container-view-error">
            <h1>404: Recurso no existente.</h1>
        </div>

        <style>
            .container-view-error {
                padding: 0 20px;
            }
        </style>
    `;
}