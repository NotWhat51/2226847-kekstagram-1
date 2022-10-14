//https://learn.javascript.ru/task/random-int-min-max
const getRandomPositiveInteger = (a, b) => {
    const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
    const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
    const result = Math.random() * (upper - lower + 1) + lower;
    return Math.floor(result);
}

const isMaxLengthStr = (str, maxLength) => {
    return str.length <= maxLength;
}
