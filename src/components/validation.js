export { clearValidation, enableValidation };

// Функция очистки форм и деактивации кнопки 
const clearValidation = (profileForm, validationConfig) => {
  const inputElements = Array.from(profileForm.querySelectorAll('input'));
  const errorElements = Array.from(profileForm.querySelectorAll('span'));
  const buttonElement = profileForm.querySelector('button');

  buttonElement.classList.add(validationConfig.inactiveButtonClass);
  buttonElement.setAttribute('disabled', 'disabled');
  inputElements.forEach((el) => el.classList.remove(validationConfig.inputErrorClass));
  errorElements.forEach((el) => {
    el.classList.remove(validationConfig.errorClass);
    el.textContent = '';
  });
}; 

// Функция валидации
const enableValidation = (obj) => {
  const formList = Array.from(document.querySelectorAll(obj.formSelector));
  
  const showInputError = (formElement, inputElement, errorMessage) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.add(obj.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(obj.errorClass);
  };
  
  const hideInputError = (formElement, inputElement) => {
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    inputElement.classList.remove(obj.inputErrorClass);
    errorElement.classList.remove(obj.errorClass);
    errorElement.textContent = '';
  };
  
  const checkInputValidity = (formElement, inputElement) => {
    if (inputElement.validity.patternMismatch) {
      inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
      inputElement.setCustomValidity("");
    }
  
    if (!inputElement.validity.valid) {
      showInputError(formElement, inputElement, inputElement.validationMessage);
    } else {
      hideInputError(formElement, inputElement);
    }
  };
  
  const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
      return !(inputElement.validity.valid)
    })
  }
  
  const toggleButtonState = (inputList, buttonElement) => {
    if (hasInvalidInput(inputList)) {
      buttonElement.classList.add(obj.inactiveButtonClass);
      buttonElement.setAttribute('disabled', 'disabled');
    } else {
      buttonElement.classList.remove(obj.inactiveButtonClass);
      buttonElement.removeAttribute('disabled');
    }
  } 
  
  const setEventListeners = (formElement) => {
    const inputList = Array.from(formElement.querySelectorAll(obj.inputSelector));
    const buttonElement = formElement.querySelector(obj.submitButtonSelector);
  
    toggleButtonState(inputList, buttonElement);
  
    inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', function () {
        checkInputValidity(formElement, inputElement);
        toggleButtonState(inputList, buttonElement);
      });
    });
  };

  formList.forEach((formElement) => {
    setEventListeners(formElement);
    formElement.addEventListener('submit', function (evt) {
      evt.preventDefault();
    });
  });
};
