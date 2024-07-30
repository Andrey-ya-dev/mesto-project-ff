// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// @todo: DOM узлы
const cardList = document.querySelector(".places__list");

// @todo: Функция создания карточки
function createCard(cardData, removeCallback) {
  const liItem = cardTemplate.querySelector(".card").cloneNode(true);
  const removeButton = liItem.querySelector(".card__delete-button");

  liItem.querySelector(".card__image").setAttribute("src", cardData.link);
  liItem.querySelector(".card__title").textContent = cardData.name;

  removeButton.addEventListener("click", function () {
    removeCallback(liItem);
  });

  return liItem;
}

// @todo: Функция удаления карточки
function removeCard(element) {
  if (element) {
    element.remove();
  }
}

// @todo: Вывести карточки на страницу
initialCards.forEach((item) => {
  const listItem = createCard(item, removeCard);
  cardList.append(listItem);
});
