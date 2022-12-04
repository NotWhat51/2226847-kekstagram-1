import { setOfPublication } from "./data.js";
import { renderPicture} from "./render.js";
import { openBigPicture } from "./big_view.js";
import './upload_image.js';

const posts = setOfPublication();

for (const post of posts) {
    renderPicture(post);
}

const pictures = document.querySelector('.pictures');

const addCheckHandler = (post) => {
    const imgSrc = `img[src="${post.url}"]`;
    const picture = pictures.querySelector(imgSrc).parentNode;
    picture.addEventListener('click', (evt) => {
        evt.preventDefault();
        openBigPicture(post);
    })
}

for (const post of posts) {
    addCheckHandler(post);
}