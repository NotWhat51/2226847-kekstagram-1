import { isEsc, checkForRepeats } from './util.js';
import { sendData } from './api.js';

const MAX_HASHTAG_LENGTH = 20;
const MAX_HASHTAG_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const hashtagRegx = /^#[A-Za-zА-Яа-я0-9]{1,19}$/;
const errorCommentText = 'длина комментария не может составлять больше 140 символов';

const Effects = {
  NONE: 'effect-none',
  CHROME: 'effect-chrome',
  SEPIA: 'effect-sepia',
  MARVIN: 'effect-marvin',
  PHOBOS:'effect-phobos',
  HEAT: 'effect-heat'
};

const PreviewEffects = {
  NONE: 'effects__preview--none',
  CHROME: 'effects__preview--chrome',
  SEPIA: 'effects__preview--sepia',
  MARVIN: 'effects__preview--marvin',
  PHOBOS: 'effects__preview--phobos',
  HEAT: 'effects__preview--heat'
};

const HashtagError = {
  OK: '',
  BEGIN_HASHTAG: 'хэш-тег начинается c символа #',
  ONLY_HASHTAG: 'хеш-тег не может состоять только из одной решётки',
  MAX_LENGTH: 'максимальная длина одного хэш-тега 20 символов, включая решётку',
  MAX_COUNT: 'нельзя указать больше пяти хэш-тегов',
  INCORRECT_SYMBOL: 'строка после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д.',
  REPEAT: 'один и тот же хэш-тег не может быть использован дважды'
};

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
  checkBox = Effects.NONE;
  effectLevel.classList.add('hidden');
  scaleValue.value = `${100}%`;
  imgPreview.style.transform = `scale(${1})`;
  imgPreview.className = PreviewEffects.NONE;
  effectsList.children[0].querySelector('input').checked = true;
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
  effectSlider.noUiSlider.destroy();
};

const closeImageOverlay = () => {
  imgOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', overlayEsc);
  cancel.removeEventListener('click', closeImageOverlay);

  submitButton.removeAttribute('disabled', 'true');
  form.removeEventListener('submit', onSubmitClick);

  scaleBigger.removeEventListener('click', scaleChange);
  scaleSmaller.removeEventListener('click', scaleChange);

  effectsList.removeEventListener('change', effectPicture);
  resetValues();
};

const effectRate = () => {
  const value = effectSlider.noUiSlider.get();
  effectValue.value = value;
  let filter;

  switch (checkBox) {
    case Effects.CHROME:
      filter = `grayscale(${value})`;
      break;

    case Effects.SEPIA:
      filter = `sepia(${value})`;
      break;

    case Effects.MARVIN:
      filter = `invert(${value}%)`;
      break;

    case Effects.PHOBOS:
      filter = `blur(${value}px)`;
      break;

    case Effects.HEAT:
      filter = `brightness(${value})`;
      break;
  }
  imgPreview.style.filter = checkBox === Effects.NONE ? '' : filter;
};

uploadFile.addEventListener('change', (evt) => {
  evt.preventDefault();
  setValues();

  document.addEventListener('keydown', overlayEsc);
  cancel.addEventListener('click', closeImageOverlay);

  scaleSmaller.addEventListener('click', scaleChange);
  scaleBigger.addEventListener('click', scaleChange);

  imgPreview.classList.add(PreviewEffects.NONE);
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

  form.addEventListener('submit', onSubmitClick);
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
  if (hashtagBool && commentBool) {
    submitButton.disabled = false;
  } else {
    submitButton.disabled = true;
  }
};

let errorHashtagText = HashtagError.OK;

const isHashtag = (value) => hashtagRegx.test(value);

const hashtagValidator = (value) => {
  hashtagBool = true;
  errorHashtagText = HashtagError.OK;
  let resultBool = true;
  const hashtagsValid = value.trim().toLowerCase().split(' ');
    if (hashtagsValid[0] !== '') {
    for (const hashtag of hashtagsValid) {
      if (!isHashtag(hashtag)) {
        if (hashtag[0] !== '#') {
          errorHashtagText = HashtagError.BEGIN_HASHTAG;
          hashtagBool = false;
          resultBool = false;
          break;
        }
        if (hashtag.length === 1 && hashtag[0] === '#') {
          errorHashtagText = HashtagError.ONLY_HASHTAG;
          hashtagBool = false;
          resultBool = false;
          break;
        }
        if (hashtag.length > MAX_HASHTAG_LENGTH) {
          errorHashtagText = HashtagError.MAX_LENGTH;
          hashtagBool = false;
          resultBool = false;
          break;
        }
        errorHashtagText = HashtagError.INCORRECT_SYMBOL;
        hashtagBool = false;
        resultBool = false;
      }
    }
    if (checkForRepeats(hashtagsValid)) {
      errorHashtagText = HashtagError.REPEAT;
      hashtagBool = false;
      resultBool = false;
    }
    if (hashtagsValid.length > MAX_HASHTAG_COUNT) {
      errorHashtagText = HashtagError.MAX_COUNT;
      hashtagBool = false;
      resultBool = false;
    }
  }
  ctrlSubmit();
  return resultBool;
};

const isComment = (value) => value.length <= MAX_COMMENT_LENGTH;

const commentValidator = (value) => {
  commentBool = isComment(value);
  ctrlSubmit();
  return commentBool;
};

const generateErrorHashtagText = () => errorHashtagText;

pristine.addValidator(
  hashtags,
  hashtagValidator,
  generateErrorHashtagText
);

pristine.addValidator(
  description,
  commentValidator,
  errorCommentText
);

const submitButtonBlock = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

const submitButtonUnblock = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const closeMessages = () => {
  document.removeEventListener('keydown', escMessageClose);

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

function scaleChange (evt) {
  const value = scaleValue.value.replace('%', '');
  if (evt.target === scaleSmaller && value > 25) {
    scaleValue.value = `${parseInt(value, 10) - 25}%`;
    imgPreview.style.transform = `scale(${(parseInt(value, 10) - 25) / 100})`;
  } else if (evt.target === scaleBigger && value < 100) {
    scaleValue.value = `${parseInt(value, 10) + 25}%`;
    imgPreview.style.transform = `scale(${(parseInt(value, 10) + 25) / 100})`;
  }
}

function effectPicture (evt) {
  checkBox = evt.target.id;
  let min = 0;
  let max = 100;
  let start = 100;
  let step = 1;
  let effectClass;

  switch(checkBox) {
    case Effects.CHROME:
      min = 0;
      max = 1;
      start = 1;
      step = 0.1;
      effectClass = PreviewEffects.CHROME;
      break;

    case Effects.SEPIA:
      min = 0;
      max = 1;
      start = 1;
      step = 0.1;
      effectClass = PreviewEffects.SEPIA;
      break;

    case Effects.MARVIN:
      min = 0;
      max = 100;
      start = 100;
      step = 1;
      effectClass = PreviewEffects.MARVIN;
      break;

    case Effects.PHOBOS:
      min = 0;
      max = 3;
      start = 3;
      step = 0.1;
      effectClass = PreviewEffects.PHOBOS;
      break;

    case Effects.HEAT:
      min = 0;
      max = 3;
      start = 3;
      step = 0.1;
      effectClass = PreviewEffects.HEAT;
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

  if (evt.target.id !== Effects.NONE) {
    effectLevel.classList.remove('hidden');
  } else {
    effectLevel.classList.add('hidden');
  }

  imgPreview.className = effectClass;
}

function overlayEsc (evt) {
  if (isEsc(evt) && evt.target !== hashtags && evt.target !== description
    && !body.contains(errorSubmit)) {
    evt.preventDefault();
    closeImageOverlay();
  }
}

function escMessageClose (evt) {
  if (isEsc(evt)) {
    closeMessages();
  }
}

function closeSuccessMessage (evt) {
  if (evt.target === successSubmit) {
    closeMessages();
  }
}

function closeErrorMessage (evt) {
  if (evt.target === errorSubmit) {
    closeMessages();
  }
}

function onSubmitClick (evt) {
  evt.preventDefault();
  const isValidate = pristine.validate();

  if (isValidate) {
    submitButtonBlock();
    sendData(
      () => {
        closeImageOverlay();
        submitButtonUnblock();
        successButton.addEventListener('click', closeMessages);
        document.addEventListener('keydown', escMessageClose);
        document.addEventListener('click', closeSuccessMessage);
        body.appendChild(successSubmit);
      },
      () => {
        imgOverlay.classList.add('hidden');
        submitButtonUnblock();
        errorButton.addEventListener('click', closeMessages);
        document.addEventListener('keydown', escMessageClose);
        document.addEventListener('click', closeErrorMessage);
        body.appendChild(errorSubmit);
      },
      new FormData(evt.target)
    );
  }
}

export { closeImageOverlay };
