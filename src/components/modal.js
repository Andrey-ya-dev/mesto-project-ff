// Открыть модальное окно
export function openModal(element) {
  console.log("open modal atach");

  if (element) {
    element.classList.add("popup_is-opened");

    document.addEventListener("keydown", closeModalByKeyboard);
  }
}

// Закрыть модальное окно
export function closeModal(element) {
  console.log("close modal atach");

  if (element) {
    element.classList.remove("popup_is-opened");

    document.removeEventListener("keydown", closeModalByKeyboard);
  }
}

// Закрытие модального окна , клик по overlay и кнопке закрытия
export function closeModalByPopup(evt, modalEl, closeFn) {
  console.log("close modalByPopup atach");

  if (evt.target === modalEl) {
    closeFn(modalEl);
  }

  if (evt.target === modalEl.querySelector(".popup__close")) {
    console.log("close modalByBtn atach");
    closeFn(modalEl);
  }
}

// Закрыть модальное окно , кнопка ескейп
function closeModalByKeyboard(evt) {
  console.log("close modalByEsc atach");

  if (evt.key === "Escape") {
    console.log("close modalByEsc atach in IF");

    document.querySelectorAll(".popup").forEach((popup) => {
      popup.classList.remove("popup_is-opened");
    });
  }
}
