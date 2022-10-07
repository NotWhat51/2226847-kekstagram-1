//https://learn.javascript.ru/task/random-int-min-max
const randomInt = (min, max) => {
    //получаем случайное число от min до max+1
    let random = min + Math.random() * (max - min +1 );
    return Math.floor(random);
}

const isMaxLengthStr = (str, maxLength) => {
    return str.length <= maxLength;
}
