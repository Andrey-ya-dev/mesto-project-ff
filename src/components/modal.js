// Открыть модальное окно
export function openModal(element) {
  if (element) {
    element.classList.add("popup_is-opened");

    document.addEventListener("keydown", closeModalByKeyboard);
  }
}

// Закрыть модальное окно
export function closeModal(element) {
  if (element) {
    element.classList.remove("popup_is-opened");

    document.removeEventListener("keydown", closeModalByKeyboard);
  }
}

// Закрытие модального окна , клик по overlay и кнопке закрытия
export function closeModalByPopup(evt, modalEl, closeFn, clearValidFn = null) {
  if (evt.target === modalEl) {
    closeFn(modalEl);

    if (clearValidFn) {
      clearValidFn();
    }
  }

  if (evt.target === modalEl.querySelector(".popup__close")) {
    closeFn(modalEl);

    if (clearValidFn) {
      clearValidFn();
    }
  }
}

// Закрыть модальное окно , кнопка ескейп
function closeModalByKeyboard(evt) {
  if (evt.key === "Escape") {
    const popup = document.querySelector(".popup.popup_is-opened");
    closeModal(popup);
  }
}
