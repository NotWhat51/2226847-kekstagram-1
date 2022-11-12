//подписи к фото в стиле Скриптонита, ахахах
const DESCRIPTIONS = [
   'Та, кто делает пожар, не зажигая спичек.',
   'Я придумывал любовь, но в моем сердце всегда пусто...',
   'Все наши улыбки, как с черного рынка.',
   'Два рукопожатия не повод мне поддакивать.',
   'В выходные пахнем, в будние дни — потные.',
   'Здесь собрались все, кого я любил.',
   'Мой портной из побед шьёт мне шубы.',
   'Ты опять это рвёшь, не удержав, я люблю..',
   'У жизни самые больные сценаристы',
   'Мне больно, но не чувствую',
   'Мне так нужен был совет, теперь нет',
   'Сожалений нет, как шнурков на ботинках.',
   'Крепкие напитки, но не отношения'
];

const MESSAGES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
    'Кристина',
    'Александра',
    'Елизавета',
    'Юрий',
    'Василиса',
    'Артем',
    'Михаил',
    'Семен',
    'Таисия',
    'Екатерина',
    'Дарья',
    'Сафия',
    'Илья',
];

const POSTS = 25;

let idData = Array(POSTS).fill(0);
let urlData = Array(POSTS).fill(0);
let idNames = Array(69 * NAMES.length).fill(0);

const getRandomPositiveInteger = (a, b) => {
    const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
    const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
    const result = Math.random() * (upper - lower + 1) + lower;
    return Math.floor(result);
}

const checkStringLength = (string, maxLength) => {
    return string.length <= maxLength;
}

const getRandomId = function (idArray) {
    for (let i = 0; i < idArray.length; i++) {
        if (idArray[i] == 0) {
            idArray[i] = 1;
            return i + 1;
        }
    }
}

const getRandomIndex = function (array) {
    return getRandomPositiveInteger(0, array.length - 1);
}

const createComment = function() {
    return {
        id: getRandomId(idNames),
        avatar: 'img/avatar-${getRandomPositiveInteger(1, 6)}.svg',
        message: MESSAGES[getRandomIndex(MESSAGES)],
        name: NAMES[getRandomIndex(NAMES)]
    }
}


const setOfComments = function() {
    const n = getRandomPositiveInteger(1, 5);
    const array = Array(n);
    for (let i = 0; i < n; i++) {
        array[i] = createComment();
    }
    return array;
}

const createPublication = function() {
    return {
        id: getRandomId(idData),
        url: 'photos/${getRandomId(urlData, 1, 25)}.jpg',
        description: DESCRIPTIONS[getRandomIndex(DESCRIPTIONS)],
        likes: getRandomPositiveInteger(13, 169),
        comments: setOfComments()
    }
}

const publication = Array.from({ lenght: POSTS }, createPublication);

const test = function() {
    return 0;
}

test(publication);