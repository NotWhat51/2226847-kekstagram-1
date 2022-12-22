const isEsc = (evt) => evt.key === 'Escape';

const checkForRepeats = (list) => {
  const container = {};
  for (const element of list) {
    if (container[element]) {
      return true;
    }
    container[element] = 1;
  }
  return false;
};

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
  }
};

function  debounce (callback, timeoutDelay = 500) {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() =>
      callback.apply(this, rest), timeoutDelay);
  };
}

export { isEsc, checkForRepeats, showWarning, debounce };
