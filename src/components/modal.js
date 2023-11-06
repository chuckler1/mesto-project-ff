export { openModal, closeModal };

// Функция открытия модального окна и добавления слушателя
function openModal(el) {
  setTimeout(() => el.classList.add('popup_is-opened'), 0);
  el.classList.add('popup_is-animated');
  document.addEventListener('keydown', (evt) => {
    if (evt.code === 'Escape') {
      closeModal(el);
    }
  });
}
// Функция закрытия модального окна и удаление слушателя
function closeModal(el) {
  el.classList.remove('popup_is-opened');
  setTimeout(() => el.classList.remove('popup_is-animated'), 600);
  document.removeEventListener('keydown', () => closeModal(el));
}
