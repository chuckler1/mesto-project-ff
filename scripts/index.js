// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
const cardContainer = document.querySelector('.places__list');
// @todo: Функция создания карточки
function createCard(cardData, callback) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const recetButton = cardElement.querySelector('.card__delete-button');
  
  cardElement.querySelector('.card__image').src = cardData.link;
  cardElement.querySelector('.card__title').textContent = cardData.name;
  recetButton.addEventListener('click', () => callback(cardElement));
  return cardElement;
}
// @todo: Функция удаления карточки
const deleteCardItem = function(elem) {
  elem.remove();
}
// Функция добалвения карточки в разметку
function renderCard(el) {
  cardContainer.append(createCard(el, deleteCardItem));
}
// @todo: Вывести карточки на страницу
initialCards.forEach((item) => {
  renderCard(item);
})