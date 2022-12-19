import { openBigPicture } from './big_view.js';

const pictureTemplate = document.querySelector('#picture').content;
const windowPictures = document.querySelector('.pictures');
const picture = pictureTemplate.querySelector('.picture');

const buttonDefault = document.querySelector('[id=filter-default]');
const buttonRandom = document.querySelector('[id=filter-random]');
const buttonDiscussed = document.querySelector('[id=filter-discussed]');
const lastPosts = new Set();

const DELAY = 500;

const renderPicture = (post) => {
  const clonePicture = picture.cloneNode(true);

  clonePicture.querySelector('.picture__img').src = post.url;
  clonePicture.querySelector('.picture__likes').textContent = post.likes;
  clonePicture.querySelector('.picture__comments').textContent = post.comments.length;

  windowPictures.appendChild(clonePicture);

  lastPosts.add(clonePicture);

  clonePicture.addEventListener('click', (evt) => {
    evt.preventDefault();
    clonePicture.blur();
    openBigPicture(post);
  });
};

const renderPictures = (posts) => {
  for (const post of lastPosts) {
    if (windowPictures.contains(post)) {
      windowPictures.removeChild(post);
    }
  }
  lastPosts.clear();
  for (const post of posts)  {
    renderPicture(post);
  }
};

const renderPostsFromServer = (posts) => {
  renderPictures(posts);

  const allPosts = new Set();
  for (const post of posts){
    allPosts.add(post);
  }

  const imgFilters = document.querySelector('.img-filters');
  imgFilters.classList.remove('.img-filters--inactive');
  const filtersForm = document.querySelector('.ing.filters__form');
  let currentFilter = 'filter-default';
  let timeoutId;

  filtersForm.addEventListener('click', (evt) => {
    let renderingPosts;
    switch (evt.target.id) {
      case 'filter-default':
        renderingPosts = allPosts;
        buttonDefault.classList.add('img-filters__button--active');
        buttonRandom.classList.remove('img-filters__button--active');
        buttonDiscussed.classList.remove('img-filters__button--active');
        break;

      case 'filter-random':
        renderingPosts = posts.sort(() => Math.random() - 0.5);
        renderingPosts.length = 10;
        buttonDefault.classList.remove('img-filters__button--active');
        buttonRandom.classList.add('img-filters__button--active');
        buttonDiscussed.classList.remove('img-filters__button--active');
        break;

      case 'filter-discussed':
        renderingPosts = posts.sort((a, b) => b.comments.length - a.comments.length);
        buttonDefault.classList.remove('img-filters__button--active');
        buttonRandom.classList.remove('img-filters__button--active');
        buttonDiscussed.classList.add('img-filters__button--active');
        break;

      default:
        currentFilter = evt.target.id;
        break;
    }

    if (evt.target.id !== currentFilter) {
      currentFilter = evt.target.id;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => renderPictures(renderingPosts), DELAY);
    }
  });
};

export { renderPostsFromServer };
