// Функция открытия модального окна и добавления слушателя
function openModal(el) {
  setTimeout(() => el.classList.add('popup_is-opened'), 0);
  el.classList.add('popup_is-animated');
  document.addEventListener('keydown', closeByEscape);
}
// Функция закрытия модального окна и удаление слушателя
function closeModal(el) {
  el.classList.remove('popup_is-opened');
  setTimeout(() => el.classList.remove('popup_is-animated'), 600);
  document.removeEventListener('keydown', closeByEscape);
}
// Функция обработчик закрытия по нажатию клавиши Escape
function closeByEscape(evt) {
  if (evt.code === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    closeModal(openedPopup);
  }
}

const closeModalByClick = (evt) => {
  if (
    evt.target.classList.contains('popup__close') ||
    evt.target.classList.contains('popup_is-opened')
  ) {
    closeModal(evt.currentTarget);
  }
};

export { openModal, closeModal, closeModalByClick };