const getRandomPositiveInteger = (a, b) => {
    const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
    const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
    const result = Math.random() * (upper - lower + 1) + lower;
    return Math.floor(result);
}

const checkStringLength = (string, maxLength) => {
    return string.length <= maxLength;
}

const getRandomIndex = function (array) {
    return getRandomPositiveInteger(0, array.length - 1);
}

export {getRandomPositiveInteger, getRandomIndex, checkStringLength}