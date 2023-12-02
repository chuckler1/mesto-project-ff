import { createCard, deleteCardItem, likeCard } from './components/card.js';
import { openModal, closeModal } from './components/modal.js';
import { clearValidation, enableValidation } from './components/validation.js';
import { getProfile, patchProfileInfo, postNewCard, patchNewAvatar } from './components/api.js';
import './pages/index.css';

// @todo: DOM узлы
const cardContainer = document.querySelector('.places__list');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const popups = document.querySelectorAll('.popup');
// DOM узлы модального окна редактирования профиля
const popupEdit = document.querySelector('.popup_type_edit');
// Кнопка для открытия этого окна
const buttonEdit = document.querySelector('.profile__edit-button');
// и его форма
const formElement = popupEdit.querySelector('.popup__form');
const nameInput = formElement.elements.name;
const jobInput = formElement.elements.description;

// DOM узлы модального окна создания новой карточки
const popupNewCard = document.querySelector('.popup_type_new-card');
// Кнопка для открытия этого окна
const buttonAdd = document.querySelector('.profile__add-button');
// и его форма
const formElementCard = popupNewCard.querySelector('.popup__form');
const placeNameInput = formElementCard.elements['place-name'];
const linkInput = formElementCard.elements.link;
// DOM узел модального окна изображения карточки
const popupOpenImage = document.querySelector('.popup_type_image');
const popupImage = popupOpenImage.querySelector('.popup__image');
const popupImageCaption = popupOpenImage.querySelector('.popup__caption');
// DOM узлы модального окна изменения аватара 
const popupNewAvatar = document.querySelector('.popup_type_edit_avatar');
const formNewAvatar = popupNewAvatar.querySelector('.popup__form');
const inputLinkAvatar = formNewAvatar.elements.link;

// Функция добавления карточки в разметку
function renderCard(el) {
  cardContainer.append(createCard(el, deleteCardItem, likeCard, openImage));
}
// Функция изменения имени и описания профиля в разметке
function handleFormSubmit(evt) {
  evt.preventDefault();
  formElement.elements.button.textContent = 'Сохранение...';
  patchProfileInfo(nameInput, jobInput)
    .then((result) => {
      changeProfileInfo(result);
      formElement.elements.button.textContent = 'Сохранить';
      closeModal(popupEdit);
    })
    .catch((err) => console.log(err));
}
// Функция обработчик событий, которая возвращает обновленный аватар с сервера 
function handleFormProfileImg(evt) {
  evt.preventDefault();
  formNewAvatar.elements.button.textContent = 'Сохранение...';
  patchNewAvatar(inputLinkAvatar)
    .then(result => {
      changeProfileInfo(result);
      formNewAvatar.elements.button.textContent = 'Сохранить';
      closeModal(popupNewAvatar);
    });
}
// Функция обработчик событий, которая возвращает новую карточку с сервера, полученную 
// из ответа на запрос с данными из формы
function handleFormSubmitCard(evt) {
  evt.preventDefault();
  formElementCard.elements.button.textContent = 'Сохранение...';
  const obj = {
    name: placeNameInput.value,
    link: linkInput.value,
  };
  postNewCard(obj)
    .then((result) => {
      cardContainer.prepend(createCard(result, deleteCardItem, likeCard, openImage));
      formElementCard.elements.button.textContent = 'Сохранить';
      closeModal(popupNewCard);
    })
    .catch((err) => console.log(err));
  evt.target.reset();
}

// Функция обработкчика событий для окрытия модального окна изображения карточки
// и присваивание значений ссылки и названия
function openImage(evt) {
  if (evt.target.classList.contains('card__image')) {
    popupImage.src = evt.target.src;
    popupImageCaption.textContent = popupImage.alt = evt.target
      .closest('.card')
      .querySelector('.card__title').textContent;
    openModal(popupOpenImage);
  }
}
// Функция изменения данных профиля
const changeProfileInfo = (data) => {
  profileTitle.textContent = data.name;
  profileDescription.textContent = data.about;
  profileImage.style.backgroundImage = `url(${data.avatar})`;
};


// Вызов функции запроса на сервер, в ответе которого получаем данные 
// карточек и профиля для рендеринга на странице 
getProfile()
  .then((result) =>
    result.forEach((item) => {
      if (item.length) {
        item.forEach((el) => renderCard(el));
      } else {
        changeProfileInfo(item);
      }
    })
  )
  .catch((err) => console.log(err));
// Добавление слушателя на кнопку откртия окна редактирования профиля
buttonEdit.addEventListener('click', () => {
  openModal(popupEdit);
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  // Очистка ошибок валидации
  clearValidation(formElement, {
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible',
  });
});
// Добавление слушателя на кнопку откртия окна редактирования аватара
profileImage.addEventListener('click', () => {
  openModal(popupNewAvatar);
  // Очистка ошибок валидации
  clearValidation(formNewAvatar, {
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible',
  });
});
// Обработкчик события при отправке формы окна редактирования
formElement.addEventListener('submit', handleFormSubmit);
// Установка слушателя на отправку данных из формы редактирование аватара
formNewAvatar.addEventListener('submit', handleFormProfileImg);
// Добавление слушателей для закрытия модальных окон
popups.forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (
      evt.target.classList.contains('popup__close') ||
      evt.target.classList.contains('popup_is-opened')
    ) {
      closeModal(popup);
    }
  });
});
// Добавление слушателя на кнопку открытия окна добавления карточки
buttonAdd.addEventListener('click', () => {
  openModal(popupNewCard);
  // Очистка полей
  placeNameInput.value = '';
  linkInput.value = '';
  clearValidation(formElementCard, {
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible',
  });
});
// Обработкчик события при отправке формы окна добавления карточки
formElementCard.addEventListener('submit', handleFormSubmitCard);
// Вызов функции валидации
enableValidation({
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
});
