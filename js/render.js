import { openBigPicture } from './big-view.js';

const DELAY = 500;
const FILTERS_BUTTON_ACTIVE = 'img-filters__button--active';

const Filters = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed'
};

const pictureContent = document.querySelector('#picture').content;
const windowPictures = document.querySelector('.pictures');
const picture = pictureContent.querySelector('.picture');

const buttonDefault = document.querySelector('[id=filter-default]');
const buttonRandom = document.querySelector('[id=filter-random]');
const buttonDiscussed = document.querySelector('[id=filter-discussed]');
const lastPosts = new Set();

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
  imgFilters.classList.remove('img-filters--inactive');
  const filtersForm = document.querySelector('.img-filters__form');
  let currentFilter = Filters.DEFAULT;
  let timeoutId;

  filtersForm.addEventListener('click', (evt) => {
    let renderingPosts;
    switch (evt.target.id) {
      case Filters.DEFAULT:
        renderingPosts = allPosts;
        buttonDefault.classList.add(FILTERS_BUTTON_ACTIVE);
        buttonRandom.classList.remove(FILTERS_BUTTON_ACTIVE);
        buttonDiscussed.classList.remove(FILTERS_BUTTON_ACTIVE);
        break;

      case Filters.RANDOM:
        renderingPosts = posts.sort(() => Math.random() - 0.5);
        renderingPosts.length = 10;
        buttonDefault.classList.remove(FILTERS_BUTTON_ACTIVE);
        buttonRandom.classList.add(FILTERS_BUTTON_ACTIVE);
        buttonDiscussed.classList.remove(FILTERS_BUTTON_ACTIVE);
        break;

      case Filters.DISCUSSED:
        renderingPosts = posts.sort((a, b) => b.comments.length - a.comments.length);
        buttonDefault.classList.remove(FILTERS_BUTTON_ACTIVE);
        buttonRandom.classList.remove(FILTERS_BUTTON_ACTIVE);
        buttonDiscussed.classList.add(FILTERS_BUTTON_ACTIVE);
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
