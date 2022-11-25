import { setOfPublication } from "./data.js";
import { renderPicture} from "./render.js";
import { openBigPicture, bigPicture } from "./big_view.js";

const posts = setOfPublication();

for (const post of posts) {
    renderPicture(post);
}

const pictures = document.querySelector('.pictures');

for (const post of posts) {
    const picture= pictures.querySelector(`img[src="${post.url}"]`).parentNode;

    picture.addEventListener('click', (evt) => {
        evt.preventDefault();
        document.body.classList.add('modal-open');
        openBigPicture(post);
    })
}

const cancel = bigPicture.querySelector('.big-picture__cancel');

cancel.addEventListener('click', () => {
    bigPicture.classList.add('hidden');
    document.body.classList.remove('modal-open');
})

document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
        bigPicture.classList.add('hidden');
        document.body.classList.remove('modal-open');
    }
})