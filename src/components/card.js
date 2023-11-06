export {createCard, deleteCardItem, likeCard}
// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: Функция создания карточки
function createCard(cardData, callback, likeFn, openFn) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const recetButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const cardImage = cardElement.querySelector('.card__image');

  cardElement.querySelector('.card__image').src = cardData.link;
  cardElement.querySelector('.card__title').textContent = cardData.name;
  recetButton.addEventListener('click', () => callback(cardElement));
  likeButton.addEventListener('click', likeFn);
  cardImage.addEventListener('click', openFn, true);
  return cardElement;
}
// @todo: Функция удаления карточки
function deleteCardItem(elem) {
  elem.remove();
};

// Функция переключения режимов кнопки лайка 
function likeCard(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}