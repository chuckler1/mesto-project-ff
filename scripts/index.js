// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
const cardContainer = document.querySelector('.places__list');
// @todo: Функция создания карточки
function addCard(linkCard, titleCard, deleteCard) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const recetButton = cardElement.querySelector('.card__delete-button');
  
  cardElement.querySelector('.card__image').src = linkCard;
  cardElement.querySelector('.card__title').textContent = titleCard;
  recetButton.addEventListener('click', () => deleteCard(cardElement));
  cardContainer.append(cardElement);
}
// @todo: Функция удаления карточки
const deleteCardItem = function(elem) {
  elem.remove();
}
// @todo: Вывести карточки на страницу
initialCards.forEach((item) => {
  addCard(item.link, item.name, deleteCardItem);
})