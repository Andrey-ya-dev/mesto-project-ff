function enableValidation(validationConfig) {
  const formList = Array.form(
    document.querySelectorAll(`${validationConfig.formSelector}`)
  );

  formList.forEach((formEl) => {
    formEl.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });

    setEventListeners(formEl, validationConfig);
  });
}

function setEventListeners(formEl, validationConfig) {
  const inputList = Array.form(
    formEl.querySelectorAll(`${validationConfig.inputSelector}`)
  );

  const btn = formEl.querySelector(`${validationConfig.submitButtonSelector}`);
  toggleButtonState(inputList, btn, validationConfig.inactiveButtonClass);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", function () {
      checkInputValidity(formEl, inputEl, validationConfig);
      toggleButtonState(inputList, btn, validationConfig.inactiveButtonClass);
    });
  });
}

function checkInputValidity(formEl, inputEl, validationConfig) {
  if (!inputEl.validity.valid) {
    //show err
    showInputErr(formEl, inputEl, validationConfig);
  } else {
    // hide err
    hiddeInputErr(formEl, inputEl, validationConfig);
  }
}

function showInputErr(formEl, inputEl, validationConfig) {
  const errMsgEl = formEl.querySelector(
    `${inputEl.name}+.${validationConfig.errorClass}`
  );
  inputEl.classList.add(`${validationConfig.inputErrorClass}`);
  errMsgEl.textContent = inputEl.validationMessage;
  errMsgEl.add(`${validationConfig.errorClass}`);
}

function hiddeInputErr(formEl, inputEl, validationConfig) {
  const errMsgEl = formEl.querySelector(
    `${inputEl.name}+.${validationConfig.errorClass}`
  );
  inputEl.classList.remove(`${validationConfig.inputErrorClass}`);
  errMsgEl.textContent = inputEl.validationMessage;
  errMsgEl.remove(`${validationConfig.errorClass}`);
}

function hasInvalidInput(inputList) {
  return inputList.some((inputEl) => !inputEl.validity.valid);
}

function toggleButtonState(inputList, buttonEl, inactiveButtonClass) {
  if (hasInvalidInput(inputList)) {
    buttonEl.classList.add(`${inactiveButtonClass}`);
  } else {
    buttonEl.classList.remove(`${inactiveButtonClass}`);
  }
}

enableValidation({
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
});

clearValidation(profileForm, validationConfig);
