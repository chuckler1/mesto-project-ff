import { initialCards } from './components/cards.js';
import { createCard, deleteCardItem, likeCard } from './components/card.js'
import { openModal, closeModal } from './components/modal.js';
import './pages/index.css';
// @todo: DOM узлы
const cardContainer = document.querySelector('.places__list');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
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
  const obj = {
    name: placeNameInput.value,
    link: linkInput.value,
  };
  cardContainer.prepend(createCard(obj, deleteCardItem, likeCard, openImage));
  closeModal(popupNewCard);
  evt.target.reset();
};
// Функция обработкчика событий для окрытия модального окна изображения карточки 
// и присваивание значений ссылки и названия
function openImage(evt) {
  if (evt.target.classList.contains('card__image')) {
    popupImage.src = evt.target.src;
    popupImageCaption.textContent = popupImage.alt =
      evt.target.closest('.card').querySelector('.card__title').textContent;
    openModal(popupOpenImage);
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
// Добавление слушателей для закрытия модальных окон
popups.forEach((popup) => {
  popup.addEventListener('mousedown', (evt) => {
    if (
      evt.target.classList.contains('popup__close') ||
      evt.target.classList.contains('popup_is-opened')
    ) {
      closeModal(popup);
    }
  })
});
// Обработкчик события при отправке формы окна редактирования
formElement.addEventListener('submit', handleFormSubmit);
// Добавление слушателя на кнопку открытия окна добавления карточки
buttonAdd.addEventListener('click', () => {
  openModal(popupNewCard);
});
// Обработкчик события при отправке формы окна добавления карточки
formElementCard.addEventListener('submit', handleFormSubmitCard);
