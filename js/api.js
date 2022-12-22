const ServerLink = {
  GET:  'https://26.javascript.pages.academy/kekstagram/data',
  SEND: 'https://26.javascript.pages.academy/kekstagram'
};

const getData = (onSuccess, onFail) => {
  fetch(ServerLink.GET)
    .then((response) => response.json())
    .then((posts) => {
      onSuccess(posts);
    })
    .catch(() => {
      onFail('Failed to load data. Try reloading the page');
    });
};

const sendData = (onSuccess, onFail, body) => {
  fetch(ServerLink.SEND,
    {
      method: 'POST',
      body,
    }
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail('Failed to submit form. Try again');
      }
    })
    .catch(() => {
      onFail('Failed to submit form. Try again');
    });
};

export { getData, sendData };
