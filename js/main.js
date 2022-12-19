import { renderPostsFromServer } from './render.js';
import { getData } from './api.js';
import { showWarning } from './util.js';
import './upload_image.js';
import './preview.js'

getData((posts) => {
  renderPostsFromServer(posts);
},
() => {
  showWarning('Failed to load data. Try to reload the page', 0);
});
