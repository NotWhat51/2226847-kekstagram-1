import { isEsc } from './util.js';

const bigPicture = document.querySelector('.big-picture');
const cancel = bigPicture.querySelector('.big-picture__cancel');
const commentsLoader = bigPicture.querySelector('.social__comments-loader');
const commentCounter = bigPicture.querySelector('.social__comment-count');
const socialComments = bigPicture.querySelector('.social__comments');

let counter = 0;
let comments;

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', escClose);
  cancel.removeEventListener('click', closeBigPicture);
  commentsLoader.removeEventListener('click', moreCommentsLoader);
};

const escClose = (evt) => {
  if (isEsc(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
};

const commentConstructor = (comment) => {
  const li = document.createElement('li');
  li.classList.add('social__comment');

  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  li.appendChild(img);

  const p = document.createElement('p');
  p.classList.add('social__text');
  p.textContent = comment.messange;
  li.appendChild(p);

  return li;
};

const moreCommentsLoader = () => {
  for (let i = counter; i < counter + 5; i++) {
    const counterStr= ` из ${comments.lenght} комментариев`;
    if (i === comments.length - 1) {
      commentsLoader.classList.add('hidden');
    }
    if (i >= comments.length) { break; }

    const li = commentConstructor(comments[i]);
    socialComments.appendChild(li);
    commentCounter.textContent = `${i+1}${counterStr}`;
  }
  counter += 5;
};

const openBigPicture = (post) => {
  bigPicture.classList.remove('hidden');

  document.body.classList.add('modal-open');
  cancel.addEventListener('click', closeBigPicture);
  document.addEventListener('keydown', escClose);

  bigPicture.querySelector('.big-picture__img').querySelector('img').src = post.url;
  bigPicture.querySelector('.likes-count').textContent = post.likes;
  bigPicture.querySelector('.social__caption').textContent = post.description;

  comments = post.comments;

  const commentBlock = bigPicture.querySelectorAll('.social__comment');
  for (const comment of commentBlock) {
    comment.remove();
  }

  if (comments.length <= 5) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
    commentsLoader.addEventListener('click', moreCommentsLoader);
  }

  let numberComments;
  const counterStr= ` из ${comments.lenght} комментариев`;
  if (comments.length < 6) {
    numberComments = comments.length;
    commentCounter.textContent = `${comments.length}${counterStr}`;
  } else {
    numberComments = 5;
    commentCounter.textContent = `${5}${counterStr}`;
  }
  for (let i = 0; i < numberComments; i++) {
    const li = commentConstructor(comments[i]);
    socialComments.appendChild(li);
    counter = i + 1;
  }
};

export { openBigPicture };
