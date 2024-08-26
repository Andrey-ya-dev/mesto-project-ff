function enableValidation(validationConfig) {
  const formList = Array.from(
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
  const inputList = Array.from(
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
  if (inputEl.validity.patternMismatch) {
    const customMsg = inputEl.getAttribute("data-err-msg");

    inputEl.setCustomValidity(customMsg || "");
  } else {
    inputEl.setCustomValidity("");
  }

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
    `#${[inputEl.id]}+${validationConfig.errorMessageSelector}`
  );
  inputEl.classList.add(`${validationConfig.inputErrorClass}`);
  errMsgEl.textContent = inputEl.validationMessage;
  errMsgEl.classList.add(`${validationConfig.errorClass}`);
}

function hiddeInputErr(formEl, inputEl, validationConfig) {
  const errMsgEl = formEl.querySelector(
    `#${[inputEl.id]}+${validationConfig.errorMessageSelector}`
  );
  inputEl.classList.remove(`${validationConfig.inputErrorClass}`);
  errMsgEl.textContent = "";
  errMsgEl.classList.remove(`${validationConfig.errorClass}`);
}

function hasInvalidInput(inputList) {
  return inputList.some((inputEl) => !inputEl.validity.valid);
}

function toggleButtonState(inputList, buttonEl, inactiveButtonClass) {
  if (hasInvalidInput(inputList)) {
    buttonEl.setAttribute("disabled", true);
    buttonEl.classList.add(`${inactiveButtonClass}`);
  } else {
    buttonEl.removeAttribute("disabled");
    buttonEl.classList.remove(`${inactiveButtonClass}`);
  }
}

function clearValidation(formEl, validationConfig) {
  const inputList = Array.from(
    formEl.querySelectorAll(`${validationConfig.inputSelector}`)
  );

  const btn = formEl.querySelector(`${validationConfig.submitButtonSelector}`);
  toggleButtonState(inputList, btn, validationConfig.inactiveButtonClass);

  inputList.forEach((inputEl) => {
    hiddeInputErr(formEl, inputEl, validationConfig);
  });
}

export { clearValidation, enableValidation };
