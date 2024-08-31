import { addLikeToCard, removeLikeToCard } from "./api";

// Создание карточки
export function createCard(
  cardData,
  template,
  likeFn,
  openImgPopupFn,
  userId,
  getDataForDelete
) {
  if (template) {
    const listItem = template.querySelector(".card").cloneNode(true);

    const removeBtn = listItem.querySelector(".card__delete-button");
    const likeBtn = listItem.querySelector(".card__like-button");

    const likeCount = listItem.querySelector(".card__like-count");
    likeCount.textContent = cardData?.likes?.length;
    cardData?.likes.forEach((user) => {
      if (user._id === userId) {
        likeBtn.classList.add("card__like-button_is-active");
      }
    });

    const cardImg = listItem.querySelector(".card__image");
    cardImg.setAttribute("src", cardData.link);
    cardImg.setAttribute("alt", cardData.name);

    cardImg.addEventListener("click", function () {
      openImgPopupFn(cardData);
    });

    listItem.querySelector(".card__title").textContent = cardData.name;

    if (cardData.owner._id === userId) {
      removeBtn.addEventListener("click", function () {
        getDataForDelete(cardData._id, listItem);
      });
    } else {
      removeBtn.remove();
    }

    likeBtn.addEventListener("click", function () {
      likeFn(listItem, likeBtn, cardData);
    });

    return listItem;
  }
}

// Удаление карточки
export function removeCard(cardEl) {
  if (cardEl) {
    cardEl.remove();
  }
}

// Лайк карточки
export function likeCard(cardEl, likeBtnEl, cardData) {
  if (likeBtnEl.classList.contains("card__like-button_is-active")) {
    removeLikeToCard(cardData._id)
      .then((unLikedCard) => {
        likeBtnEl.classList.remove("card__like-button_is-active");
        cardEl.querySelector(".card__like-count").textContent =
          unLikedCard.likes.length;
      })
      .catch((err) => {
        console.warn(err);
      });
  } else {
    addLikeToCard(cardData._id)
      .then((likedCard) => {
        likeBtnEl.classList.add("card__like-button_is-active");
        cardEl.querySelector(".card__like-count").textContent =
          likedCard.likes.length;
      })
      .catch((err) => {
        console.warn(err);
      });
  }
}
