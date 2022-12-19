import { openBigPicture } from "./big_view.js";

const pictureTemplate = document.querySelector('#picture').content;
const windowPictures = document.querySelector('.pictures');
const picture = pictureTemplate.querySelector('.picture');

const renderPicture = (post) => {
    const clonePicture = picture.cloneNode(true);

    clonePicture.querySelector('.picture__img').src = post.url;
    clonePicture.querySelector('.picture__likes').textContent = post.likes;
    clonePicture.querySelector('.picture__comments').textContent = post.comments.length;

    windowPictures.appendChild(clonePicture);

    clonePicture.addEventListener('click', (evt) => {
        evt.preventDefault();
        clonePicture.blur();
        openBigPicture(post);
    });
};

export { renderPicture };
