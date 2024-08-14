import {APP_CONTAINER} from "../consts.js"

export const renderError = (data) => {
    APP_CONTAINER.innerHTML = `
        <div class="container-error-view">
            <h1>404: Recurso no existente.</h1>
        </div>

        <style>
            .container-error-view {
                padding: 0 20px;
            }
        </style>
    `;
}