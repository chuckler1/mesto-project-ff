import { initialCards } from './components/cards.js';
import { createCard, deleteCardItem, likeCard } from './components/card.js'
import { openModal, closeModal } from './components/modal.js';
import './pages/index.css';
// @todo: DOM узлы
const cardContainer = document.querySelector('.places__list');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// DOM узлы модального окна редактирования профиля
const popupEdit = document.querySelector('.popup_type_edit');
const closeEditButton = popupEdit.querySelector('.popup__close');
// Кнопка для открытия этого окна
const buttonEdit = document.querySelector('.profile__edit-button');
// и его форма
const formElement = popupEdit.querySelector('.popup__form');
const nameInput = formElement.elements.name;
const jobInput = formElement.elements.description;

// DOM узлы модального окна создания новой карточки
const popupNewCard = document.querySelector('.popup_type_new-card');
const closeNewCardButton = popupNewCard.querySelector('.popup__close');
// Кнопка для открытия этого окна
const buttonAdd = document.querySelector('.profile__add-button');
// и его форма
const formElementCard = popupNewCard.querySelector('.popup__form');
const placeNameInput = formElementCard.elements['place-name'];
const linkInput = formElementCard.elements.link;
// DOM узел модального окна изображения карточки 
const popupImage = document.querySelector('.popup_type_image');


// Функция добавления карточки в разметку
function renderCard(el) {
  cardContainer.append(createCard(el, deleteCardItem, likeCard, openImage));
}
// Функция изменения имени и описания профиля в разметке
function handleFormSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closeModal(popupEdit);
};
// Функция добавления новой карточки с данными из формы
function handleFormSubmitCard(evt) {
  evt.preventDefault();
  let obj = {
    name: placeNameInput.value,
    link: linkInput.value,
  };
  cardContainer.prepend(createCard(obj, deleteCardItem, likeCard, openImage));
  closeModal(popupNewCard);
  placeNameInput.value = '';
  linkInput.value = '';
};

// Функция обработкчика событий для окрытия модального окна изображения карточки 
// и присваивание значений ссылки и названия, а также установка слушателя для закрытия 
function openImage(evt) {
  if (evt.target.classList.contains('card__image')) {
    popupImage.querySelector('.popup__image').src = evt.target.src;
    popupImage.querySelector('.popup__caption').textContent =
      evt.target.closest('.card').querySelector('.card__title').textContent;
    openModal(popupImage);
    popupImage.addEventListener('click', (evt) => {
      if (
        evt.target.classList.contains('popup__close') ||
        evt.target.classList.contains('popup_is-opened')
      ) {
        closeModal(popupImage);
      }
    });
  }
}

// @todo: Вывести карточки на страницу
initialCards.forEach((item) => {
  renderCard(item);
});
// Добавление слушателя на кнопку откртия окна редактирования профиля
buttonEdit.addEventListener('click', () => {
  openModal(popupEdit);
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
});
// Добавление слушателя для закрытия модального окна редактирования
popupEdit.addEventListener('click', (evt) => {
  if (
    evt.target === closeEditButton ||
    evt.target.classList.contains('popup_is-opened')
  ) {
    closeModal(popupEdit);
  }
});
// Обработкчик события при отправке формы окна редактирования
formElement.addEventListener('submit', handleFormSubmit);
// Добавление слушателя на кнопку открытия окна добавления карточки
buttonAdd.addEventListener('click', () => {
  openModal(popupNewCard);
});
// Добавление слушателя для закрытия окна добавления карточки
popupNewCard.addEventListener('click', (evt) => {
  if (
    evt.target === closeNewCardButton ||
    evt.target.classList.contains('popup_is-opened')
  ) {
    closeModal(popupNewCard);
  }
});
// Обработкчик события при отправке формы окна добавления карточки
formElementCard.addEventListener('submit', handleFormSubmitCard);
