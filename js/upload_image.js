import { isEsc } from './util.js';
import { sendData } from './api.js';

const uploadFile = document.querySelector('#upload-file');
const imgOverlay = document.querySelector('.img-upload__overlay');
const cancel = document.querySelector('#upload-cancel');

const form = document.querySelector('.img-upload__form');
const hashtags = form.querySelector('.text__hashtags');
const description = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');

const scaleSmaller = imgOverlay.querySelector('.scale__control--smaller');
const scaleBigger = imgOverlay.querySelector('.scale__control--bigger');
const scaleValue = imgOverlay.querySelector('.scale__control--value');
const imgPreview = imgOverlay.querySelector('.img-upload__preview').querySelector('img');

const effectsList = imgOverlay.querySelector('.effects__list');
const effectSlider = imgOverlay.querySelector('.effect-level__slider');
const effectValue = imgOverlay.querySelector('.effect-level__value');
const effectLevel = imgOverlay.querySelector('.img-upload__effect-level');
let checkBox;

const body = document.querySelector('body');
const successSubmit = document.querySelector('#success').content.querySelector('.success');
const errorSubmit = document.querySelector('#error').content.querySelector('.error');
const successButton = successSubmit.querySelector('.success__button');
const errorButton = errorSubmit.querySelector('.error__button');

const setValues = () => {
  checkBox = 'effect-none';
  effectLevel.classList.add('hidden');
  scaleValue.value = `${100}%`;
  imgPreview.style.transform = `scale(${1})`;
};

const resetValues = () => {
  uploadFile.value = '';
  hashtags.value = '';
  description.value = '';
  scaleValue.value = `${100}%`;
  imgPreview.style.transform = `scale(${1})`;
  const errors = document.querySelectorAll('.text__error');
  for (const error of errors) {
    error.textContent = '';
  }
  slider.noUiSlider.destroy();
};

const closeImageOverlay = () => {
  imgOverlay.classList.add('hidden');
  document.body.classList.add('modal-open');
  document.removeEventListener('keydown', overlayEsc);
  cancel.removeEventListener('click', closeImageOverlay);

    submitButton.removeAttribute('disabled', 'true');
  form.removeEventListener('submit', submitListener);

  scaleBigger.removeEventListener('click', scaleChange);
  scaleSmaller.removeEventListener('click', scaleChange);

  effectsList.removeEventListener('change', effectPicture);
  resetValues();
};

const overlayEsc = (evt) => {
  if (isEsc(evt) && evt.target !== hashtags && evt.target !== description
    && !body.contains(errorSubmit)) {
    evt.preventDefault();
    closeImageOverlay();
  }
};

const scaleChange = (evt) => {
  const value = scaleValue.value.replace('%', '');
  if (evt.target === scaleSmaller && value > 25) {
    scaleValue.value = `${parseInt(value, 10) - 25}%`;
    imgPreview.style.transform = `scale(${(parseInt(value, 10) - 25) / 100})`;
  } else if (evt.target === scaleBigger && value < 100) {
    scaleValue.value = `${parseInt(value, 10) + 25}%`;
    imgPreview.style.transform = `scale(${(parseInt(value, 10) + 25) / 100})`;
  }
};

const effectPicture = (evt) => {
  checkBox = evt.target.id;
  let min = 0;
  let max = 100;
  let start = 100;
  let step = 1;
  let effectClass;

  switch(checkBox) {
    case 'effect-chrome':
      min = 0;
      max = 1;
      start = 1;
      step = 0.1;
      effectClass = 'effects__preview--none';
      break;

    case 'effect-sepia':
      min = 0;
      max = 1;
      start = 1;
      step = 0.1;
      effectClass = 'effects__preview--chrome';
      break;

    case 'effect-marvin':
      min = 0;
      max = 100;
      start = 100;
      step = 1;
      effectClass = 'effects__preview--sepia';
      break;

    case 'effect-phobos':
      min = 0;
      max = 3;
      start = 3;
      step = 0.1;
      effectClass = 'effects__preview--marvin';
      break;

    case 'effect-heat':
      min = 0;
      max = 3;
      start = 3;
      step = 0.1;
      effectClass = 'effects__preview--heat';
      break;
  }

  effectSlider.noUiSlider.updateOptions({
    range: {
      min: min,
      max: max
    },
    start: start,
    spet: step
  });

  if (evt.target.id !== 'effect-none') {
    effectLevel.classList.remove('hidden');
  } else {
    effectLevel.classList.add('hidden');
  }

  imgPreview.className = effectClass;
};

const effectRate = () => {
  const value = effectSlider.noUiSlider.get();
  effectValue.value = value;
  let filter;

  switch (checkBox) {
    case 'effect-chrome':
      filter = `grayscale(${value})`;
      break;

    case 'effect-sepia':
      filter = `sepia(${value})`;
      break;

    case 'effect-marvin':
      filter = `invert(${value}%)`;
      break;

    case 'effect-phobos':
      filter = `blur(${value}px)`;
      break;

    case 'effect-heat':
      filter = `brightness(${value})`;
      break;
  }

  if (checkBox === 'effect-none') {
    imgPreview.style.filter = '';
  } else {
    imgPreview.style.filter = filter;
  }
};

uploadFile.addEventListener('change', (evt) => {
  evt.preventDefault();
  setValues();

  document.addEventListener('keydown', overlayEsc);
  cancel.addEventListener('click', closeImageOverlay);

  scaleSmaller.addEventListener('click', scaleChange);
  scaleBigger.addEventListener('click', scaleChange);

  imgPreview.classList.add('effects__preview--none');
  effectsList.addEventListener('change', effectPicture);

  noUiSlider.create(effectSlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100
  });
  effectSlider.noUiSlider.on('update', () => {
    effectRate();
  });

  form.addEventListener('submit', submitListener);
  document.body.classList.add('modal-open');
  imgOverlay.classList.remove('hidden');
});

let hashtagBool = true;
let commentBool = true;

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorClass: 'img-upload__field-wrapper--invalid',
  successClass: 'img-upload__field-wrapper-valid',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'text__error'
}, true);

const ctrlSubmit = () => {
  if (!hashtagBool || !commentBool) {
    submitButton.setAttribute('disabled', 'true');
  } else {
    submitButton.removeAttribute('disabled', 'true');
  }
};

const hashtagRegx = /(^#[A-Za-zА-Яа-яЁё0-9]{1,19}$)|(^\s*$)/;

const isHashtag = (value) => hashtagRegx.test(value);

const hashtagValidator = (value) => {
  const hashtags = value.split(' ');
  const bool = hashtags.every(isHashtag);
  hashtagBool = bool;
  ctrlSubmit();
  return bool;
};

const isComment = (value) => value.length < 140;

const commentValidator = (value) => {
  const bool = isComment(value);
  commentBool = bool;
  ctrlSubmit();
  return bool;
};

pristine.addValidator(
  hashtags,
  hashtagValidator,
  'Hashtag is incorrect'
);

pristine.addValidator(
  description,
  commentValidator,
  'Comment length is more then 140 symbols'
);

const submitButtonBlock = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Publishing...';
};

const submitButtonUnblock = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Publish';
};

const closeMessages = () => {
  document.removeEventListener('keydown', escMessage);

  if (body.contains(successSubmit)) {
    body.removeChild(successSubmit);
    document.removeEventListener('click', closeSuccessMessage);
    successButton.removeEventListener('click', closeMessages);
  }

  if (body.contains(errorSubmit)) {
    errorButton.removeEventListener('click', closeMessages);
    document.removeEventListener('click', closeErrorMessage);
    imgOverlay.classList.remove('hidden');
    body.removeChild(errorSubmit);
  }
};

const escMessage = (evt) => {
  if (isEsc(evt)) {
    closeMessages();
  }
};

const closeSuccessMessage = (evt) => {
  if (evt.target === successSubmit) {
    closeMessages();
  }
};

const closeErrorMessage = (evt) => {
  if (evt.target === errorSubmit) {
    closeMessages();
  }
};

const submitListener = (evt) => {
  evt.preventDefault();
  const isValidate = pristine.validate();

  if (isValidate) {
    submitButtonBlock();
    sendData(
      () => {
        closeImageOverlay();
        submitButtonUnblock();
        successButton.addEventListener('click', closeMessages);
        document.addEventListener('keydown', escMessage);
        document.addEventListener('click', closeSuccessMessage);
        body.appendChild(successSubmit);
      },
      () => {
        imgOverlay.classList.add('hidden');
        submitButtonUnblock();
        errorButton.addEventListener('click', closeMessages);
        document.addEventListener('keydown', escMessage);
        document.addEventListener('click', closeErrorMessage);
        body.appendChild(errorSubmit);
      },
      new FormData(evt.target)
    );
  }
};

export { closeImageOverlay };
