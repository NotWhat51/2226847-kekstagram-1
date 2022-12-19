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

const isEsc = (evt) => evt.key === 'Escape';

const showWarning = (message, timeWarning) => {
    const containerWarning = document.createElement('div');

    containerWarning.style.zIndex = '100';
    containerWarning.style.position = 'absolute';
    containerWarning.style.left = '0';
    containerWarning.style.right = '0';
    containerWarning.style.top = '0';
    containerWarning.style.padding = '10px 3px';
    containerWarning.style.fontSize = '30px';
    containerWarning.style.textAlign = 'center';
    containerWarning.style.backgroundColor = 'red';

    containerWarning.textContent = message;

    document.body.append(containerWarning);

    if (timeWarning !== 0) {
        setTimeout(() => {
            containerWarning.remove();
        }, timeWarning);
    };
};

export { getRandomPositiveInteger, getRandomIndex, checkStringLength, isEsc, showWarning }