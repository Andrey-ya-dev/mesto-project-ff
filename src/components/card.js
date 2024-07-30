// Создание карточки
export function createCard(
  cardData,
  template,
  removeFn,
  likeFn,
  addImgListenerFn
) {
  if (template) {
    const listItem = template.querySelector(".card").cloneNode(true);

    const removeBtn = listItem.querySelector(".card__delete-button");
    const likeBtn = listItem.querySelector(".card__like-button");

    const cardImg = listItem.querySelector(".card__image");
    cardImg.setAttribute("src", cardData.link);
    cardImg.setAttribute("alt", cardData.name);

    addImgListenerFn(cardImg, cardData);

    listItem.querySelector(".card__title").textContent = cardData.name;

    removeBtn.addEventListener("click", function () {
      removeFn(listItem);
    });
    likeBtn.addEventListener("click", function () {
      likeFn(likeBtn);
    });

    return listItem;
  }
}

// Удаление карточки
export function removeCard(element) {
  if (element) {
    element.remove();
  }
}

// Лайк карточки
export function likeCard(element) {
  if (element) {
    element.classList.toggle("card__like-button_is-active");
  }
}
