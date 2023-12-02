export {
  getProfile,
  patchProfileInfo,
  postNewCard,
  deleteCardRequest,
  putLikeCounterRequest,
  deleteLikeCounterRequest,
  patchNewAvatar
};
// Конфиг с токеном и названием группы
const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-1',
  headers: {
    authorization: 'ba5e2172-a186-44b4-8733-f33510101419',
    'Content-Type': 'application/json',
  },
};
// Функция с запросами на сервер для получения данных юзера и карточек
const getProfile = () => {
  const urls = [`${config.baseUrl}/users/me`, `${config.baseUrl}/cards`];

  const promises = urls.map((url) =>
    fetch(url, { headers: config.headers }).then((res) => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    })
  );
  return Promise.all(promises);
};
// Функция с запросом на обновление данных о профиле на сервере 
const patchProfileInfo = (nameInput, jobInput) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name: nameInput.value,
      about: jobInput.value,
    }),
  }).then((res) =>
    res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`)
  );
};
// Функция с запросом о размещение на сервере новой карточки 
const postNewCard = (obj) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify(obj),
  }).then((res) =>
    res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`)
  );
};
// Функция с запросом удалить карточку с сервера 
const deleteCardRequest = (obj) => {
  return fetch(`${config.baseUrl}/cards/${obj._id}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then((res) =>
    res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`)
  );
};
// Функция с запросом о добалвении лайка юзера к карточке на сервере 
const putLikeCounterRequest = (obj) => {
  return fetch(`${config.baseUrl}/cards/likes/${obj._id}`, {
    method: 'PUT',
    headers: config.headers,
  }).then((res) =>
    res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`)
  );
};
// Функция с запросом о удаление лайка юзера с карточки 
const deleteLikeCounterRequest = (obj) => {
  return fetch(`${config.baseUrl}/cards/likes/${obj._id}`, {
    method: 'DELETE',
    headers: config.headers,
  }).then((res) =>
    res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`)
  );
};
// Функция с запросом о размещении нового аватара на сервере
const patchNewAvatar = (inputLink) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar: inputLink.value
    }),
  }).then((res) =>
    res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`)
  );
}
