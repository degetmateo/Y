import { MAP_VIEWS } from "./views/views.js";
export const APP_CONTAINER = document.getElementById('app');
export const updateContent = (view) => MAP_VIEWS[view]();