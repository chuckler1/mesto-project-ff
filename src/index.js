import { createCard, deleteCardItem, likeCard } from './components/card.js';
import { openModal, closeModal, closeModalByClick } from './components/modal.js';
import { clearValidation, enableValidation } from './components/validation.js';
import {
  getProfile,
  patchProfileInfo,
  postNewCard,
  patchNewAvatar,
  deleteCardRequest,
} from './components/api.js';
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
const formElementProfile = popupEdit.querySelector('.popup__form');
const nameInput = formElementProfile.elements.name;
const jobInput = formElementProfile.elements.description;

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
// DOM узел модального окна удаления карточки
const popupDelete = document.querySelector('.popup_type_delete');
const popupDeleteButton = popupDelete.querySelector(
  '.popup_type_delete__button'
);
// Конфиг для валидации полей
const configValidation = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

// Функция добавления карточки в разметку
function renderCard(el, id) {
  cardContainer.append(createCard(el, deleteCard, likeCard, openImage, id));
}
// Функция изменения имени и описания профиля в разметке
function handleFormSubmitProfile(evt) {
  evt.preventDefault();
  formElementProfile.elements.button.textContent = 'Сохранение...';
  const obj = {
    name: nameInput.value,
    about: jobInput.value,
  };
  patchProfileInfo(obj)
    .then((result) => {
      changeProfileInfo(result);
      closeModal(popupEdit);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      formElementProfile.elements.button.textContent = 'Сохранить';
    });
}
// Функция обработчик событий, которая возвращает обновленный аватар с сервера
function handleFormProfileImg(evt) {
  evt.preventDefault();
  formNewAvatar.elements.button.textContent = 'Сохранение...';
  const obj = {
    avatar: inputLinkAvatar.value,
  };
  patchNewAvatar(obj).then((result) => {
    changeProfileInfo(result);
    formNewAvatar.elements.button.textContent = 'Сохранить';
    closeModal(popupNewAvatar);
  })
  .finally(() => {
    formNewAvatar.elements.button.textContent = 'Сохранить';
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
      cardContainer.prepend(
        createCard(result, deleteCard, likeCard, openImage, result.owner._id)
      );
      formElementCard.elements.button.textContent = 'Сохранить';
      closeModal(popupNewCard);
    })
    .catch((err) => console.log(err))
    .finally(() => {
      formElementCard.elements.button.textContent = 'Сохранить';
    });
}

// Функция обработкчика событий для окрытия модального окна изображения карточки
// и присваивание значений ссылки и названия
function openImage(evt) {
  if (evt.target.classList.contains('card__image')) {
    popupImage.src = evt.target.src;
    popupImageCaption.textContent = evt.target.alt;
    openModal(popupOpenImage);
  }
}
// Функция изменения данных профиля
const changeProfileInfo = (data) => {
  profileTitle.textContent = data.name;
  profileDescription.textContent = data.about;
  profileImage.style.backgroundImage = `url(${data.avatar})`;
};
// Функция открывает попап и реализовывает логику установки попапу значения айди карточки,
// а так же делает запрос и при успешном вызове вызывает метод удаления элемента карточки.
const deleteCard = (idCard, card) => {
  openModal(popupDelete);
  popupDelete.dataset.id = idCard;
  popupDeleteButton.addEventListener(
    'click',
    () => {
      deleteCardRequest(idCard)
        .then((result) => {
          if (result) {
            deleteCardItem(idCard, card);
            closeModal(popupDelete);
          }
        })
        .catch((err) => console.log(err));
    },
    true
  );
};

// Вызов функции запроса на сервер, в ответе которого получаем данные
// карточек и профиля для рендеринга на странице
getProfile()
  .then((result) => {
    const [objProfile, arrCards] = result;
    const idUser = objProfile._id;
    changeProfileInfo(objProfile);
    arrCards.forEach((el) => renderCard(el, idUser));
  })
  .catch((err) => console.log(err));
// Добавление слушателя на кнопку откртия окна редактирования профиля
buttonEdit.addEventListener('click', () => {
  openModal(popupEdit);
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  // Очистка ошибок валидации
  clearValidation(formElementProfile, configValidation);
});
// Добавление слушателя на кнопку откртия окна редактирования аватара
profileImage.addEventListener('click', () => {
  openModal(popupNewAvatar);
  // Очистка ошибок валидации
  clearValidation(formNewAvatar, configValidation);
});
// Обработкчик события при отправке формы окна редактирования
formElementProfile.addEventListener('submit', handleFormSubmitProfile);
// Установка слушателя на отправку данных из формы редактирование аватара
formNewAvatar.addEventListener('submit', handleFormProfileImg);
// Добавление слушателей для закрытия модальных окон
popups.forEach((popup) => {
  popup.addEventListener('mousedown', closeModalByClick)
});
// Добавление слушателя на кнопку открытия окна добавления карточки
buttonAdd.addEventListener('click', () => {
  openModal(popupNewCard);
  clearValidation(formElementCard, configValidation);
});
// Обработкчик события при отправке формы окна добавления карточки
formElementCard.addEventListener('submit', handleFormSubmitCard);
// Вызов функции валидации
enableValidation(configValidation);
