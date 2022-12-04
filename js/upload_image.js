import { isEsc } from "./util.js";

const uploadFile = document.querySelector('#upload-file');
const imgOverlay = document.querySelector('.img-upload__overrlay');
const cancel = document.querySelector('#upload-cancel');

const form = document.querySelector('.img-upload__form');
const hashtags = form.querySelector('.text__hashtags');
const description = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');

const closeImageOverlay = () => {
    uploadFile.value = '';
    imgOverlay.classList.add('hidden');
    document.body.classList.add('modal-open');
    document.removeEventListener('keydown', overlayEsc);
}

uploadFile.addEventListener('change', (evt) => {
    document.addEventListener('keydown', overlayEsc);
    cancel.addEventListener('click', closeImageOverlay);

    evt.preventDefault();

    document.body.classList.add('modal-open');
    imgOverlay.classList.remove('hidden');
})

const overlayEsc = (evt) => {
    if (isEsc(evt) && evt.target !== hashtags && evt.target !== description) {
        evt.preventDefault();
        closeImageOverlay();
    }
}


let hashtagBool = true;
let commentBool = true;

const pristine = new Pristine(form, {
    classTo: 'text',
    errorClass: 'text--invalid',
    successClass: 'text-valid',
    errorTextParent: 'text',
    errorTextTag: 'div',
    errorTextClass: 'text__error'
}, true);

const ctrlSubmit = () => {
    if (!hashtagBool || !commentBool) {
        submitButton.setAttribute('disabled', 'false');
    } else {
        submitButton.removeAttribute('disabled', 'true');
    }
}

const hashtagRegx = /(^#[A-Za-zА-Яа-яЁё0-9]{1,19}$)|(^\s*$)/

const isHashtag = (value) => hashtagRegx.test(text);

const hashtagValidator = (value) => {
    const hashtags = value.split(' ');
    const bool = hashtags.every(isHashtag);
    hashtagBool = bool;
    ctrlSubmit();
    return bool;
}

const isComment = (value) => value.length < 140;

const commentValidator = (value) => {
    const bool = isComment(value);
    commentBool = bool;
    ctrlSubmit();
    return bool;
}

pristine.addValidator(
    hashtags,
    hashtagValidator,
    'Hashtag is incorrect'
)

pristine.addValidator(
    description,
    commentValidator,
    'Comment length is more then 140 symbols'
)

form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    pristine.validate();
})