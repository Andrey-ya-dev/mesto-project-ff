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

// Закрыть модальное окно , кнопка ескейп
function closeModalByKeyboard(evt) {
  if (evt.key === "Escape") {
    const popup = document.querySelector(".popup.popup_is-opened");
    closeModal(popup);
  }
}
