const pictureTemplate = document.querySelector('#picture').content;
const windowPictures = document.querySelector('.pictures');
const picture = pictureTemplate.querySelector('.picture');

const renderPicture = (post) => {
    const clonePicture = picture.cloneNode(true);

    clonePicture.querySelector('.picture__img').src = post.url;
    clonePicture.querySelector('.picture__likes').textContent = post.likes;
    clonePicture.querySelector('.picture__comments').textContent = post.comments.length;

    windowPictures.appendChild(clonePicture);
}

export { renderPicture };
