import {
  putLikeCounterRequest,
  deleteLikeCounterRequest
} from './api';

// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: Функция создания карточки
function createCard(cardData, deleteFn, likeFn, openFn, id) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const recetButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const cardImage = cardElement.querySelector('.card__image');
  const counterLike = cardElement.querySelector('.card__like-counter');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardElement.querySelector('.card__title').textContent = cardData.name;
  counterLike.textContent = cardData.likes.length;
  // Скрытие кнопки удаления карточек других пользователей, установка слушателей на открытие
  if (cardData.owner._id == id) {
    recetButton.addEventListener('click', () => {
      deleteFn(cardData._id, cardElement);
    });
  } else {
    recetButton.remove();
  }
  // Делает кнопку лайка активной, если в ответе с сервера в массиве
  // лайков есть объект с id совпадающим с id пользователя
  if (cardData.likes.some((el) => el._id == id)) {
    likeButton.classList.add('card__like-button_is-active');
  }
  // Ставит слушатель с колбэк функцией, в теле которой вызываются функции с запросами PUT и DELETE,
  // в зависимости от того, активен ли лайк. Возращает количество лайков полученых из ответа с сервера.
  // А также меняет состояние кнопки.
  likeButton.addEventListener('click', (evt) => {
    const likeMethod = evt.target.classList.contains(
      'card__like-button_is-active'
    )
      ? deleteLikeCounterRequest(cardData._id)
      : putLikeCounterRequest(cardData._id);
    likeMethod
      .then((result) => {
        counterLike.textContent = result.likes.length;
        likeFn(evt);
      })
      .catch((err) => console.log(err));
  });
  cardImage.addEventListener('click', openFn, true);
  return cardElement;
}
// Функция удаления карточки и очистки дата-атрибута
function deleteCardItem(idCard, elem) {
  const elemPopup = document.querySelector(`[data-id = "${idCard}"]`);
  elem.remove();
  elemPopup.dataset.id = '';
}

// Функция переключения режимов кнопки лайка
function likeCard(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

export { createCard, deleteCardItem, likeCard };
