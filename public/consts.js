import { VIEWS } from './views.js';
export const APP_CONTAINER = document.getElementById('app');

export function navigateTo (view, data) {
    history.pushState({ view }, view, `${view}`);
    render(view, data);
 }
 
export function render (view, data) {
    VIEWS[view](data);
}