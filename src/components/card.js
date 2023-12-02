import {
  deleteCardRequest,
  putLikeCounterRequest,
  deleteLikeCounterRequest,
} from './api';
import { openModal, closeModal } from './modal';
export { createCard, deleteCardItem, likeCard };

// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: Функция создания карточки
function createCard(cardData, deleteFn, likeFn, openFn) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const recetButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const cardImage = cardElement.querySelector('.card__image');
  const counterLike = cardElement.querySelector('.card__like-counter');
  const ownerId = 'be23c6910b1b927ebfd495da';
  // DOM узел модального окна удаления карточки
  const popupDelete = document.querySelector('.popup_type_delete');
  const popupDeleteButton = popupDelete.querySelector(
    '.popup_type_delete__button'
  );

  cardElement.querySelector('.card__image').src = cardData.link;
  cardElement.querySelector('.card__image').alt = cardData.name;
  cardElement.querySelector('.card__title').textContent = cardData.name;
  counterLike.textContent = cardData.likes.length;
  // Скрытие кнопки удаления карточек других пользователей, установка слушателей на открытие и
  // закрытия попапа, а также удаление карточки локально и через запрос на сервере
  if (cardData.owner._id == ownerId) {
    recetButton.addEventListener('click', () => {
      openModal(popupDelete);
      popupDeleteButton.addEventListener('click', () => {
        deleteCardRequest(cardData)
          .then((result) => {
            if (result) {
              deleteFn(cardElement);
              closeModal(popupDelete);
            } 
          })
          .catch((err) => console.log(err));
      });
    });
  } else {
    recetButton.style.display = 'none';
  }
  // Делает кнопку лайка активной, если в ответе с сервера в массиве
  // лайков есть объект с id совпадающим с id пользователя
  if (cardData.likes.some((el) => el._id == ownerId)) {
    likeButton.classList.add('card__like-button_is-active');
  }
  // Ставит слушатель с колбэк функцией, в теле которой вызываются функции с запросами PUT и DELETE,
  // в зависимости от того, активен ли лайк. Возращает количество лайков полученых из ответа с сервера.
  // А также меняет состояние кнопки.
  likeButton.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('card__like-button_is-active')) {
      deleteLikeCounterRequest(cardData).then((result) => {
        counterLike.textContent = result.likes.length;
      });
    } else {
      putLikeCounterRequest(cardData).then((result) => {
        counterLike.textContent = result.likes.length;
      });
    }
    likeCard(evt);
  });
  cardImage.addEventListener('click', openFn, true);
  return cardElement;
}
// @todo: Функция удаления карточки
function deleteCardItem(elem) {
  elem.remove();
}

// Функция переключения режимов кнопки лайка
function likeCard(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}
