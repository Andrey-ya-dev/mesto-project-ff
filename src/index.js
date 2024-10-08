import "./pages/index.css";

import {
  createCard,
  removeCard,
  likeCard,
  checkIsLikedCard,
} from "./components/card";
import { closeModal, openModal } from "./components/modal";
import { enableValidation, clearValidation } from "./components/validation";
import {
  addNewCard,
  getInitialCards,
  getUser,
  updateAvatar,
  updateProfile,
  deleteCard,
  removeLikeToCard,
  addLikeToCard,
} from "./components/api";

export const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  errorMessageSelector: ".popup__err-msg",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const infoAboutDeleteCard = {};

// Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// Список карточке, контейнер
const cardList = document.querySelector(".places__list");

// Skeleton
const skeleton = document.querySelector(".main-skeleton");

// Профиль и текстовые поля в нем имя, занятия
const profile = document.querySelector(".profile");
const profileTitle = profile.querySelector(".profile__title");
const profileDescription = profile.querySelector(".profile__description");
// Аватар профиля
const profileAvatar = profile.querySelector(".profile__image");

// Форма для редактирования профиля и поля формы
const editform = document.querySelector(".popup_type_edit .popup__form");
const nameInput = editform.querySelector(".popup__input_type_name");
const jobInput = editform.querySelector(".popup__input_type_description");

// Поля для отображения профиля имя, занятие
const popupImage = document.querySelector(".popup__image");
const popupCaption = document.querySelector(".popup__caption");

// Форма для добавления карточки и поля формы
const addCardform = document.querySelector(".popup_type_new-card .popup__form");
const cardNameInput = addCardform.querySelector(".popup__input_type_card-name");
const cardLinkInput = addCardform.querySelector(".popup__input_type_url");

const editAvatarForm = document.querySelector(
  ".popup_type_edit-avatar .popup__form"
);
const avatarInput = editAvatarForm.querySelector(".popup__input");

// Кнопки для открытия модальных окон
const profileBtn = document.querySelector(".profile__edit-button");
const addCardBtn = document.querySelector(".profile__add-button");
const updateAvatarBtn = document.querySelector(".profile__image-edit");

// Модальные окна
const profilePopup = document.querySelector(".popup.popup_type_edit");
const addCardPopup = document.querySelector(".popup.popup_type_new-card");
const imgPopup = document.querySelector(".popup.popup_type_image");
const avatarPopup = document.querySelector(".popup.popup_type_edit-avatar");
const confirmPopup = document.querySelector(".popup.popup_type_delete");
const confirmForm = confirmPopup.querySelector(".popup__form");

// Колл-ция модалок
const popups = document.querySelectorAll(".popup");

// Ф-я лоадера кнопок
function isLoading(loading, formEl) {
  if (loading) {
    formEl.querySelector(".button").textContent = "Сохранение...";
  } else {
    formEl.querySelector(".button").textContent = "Сохранить";
  }
}

// ф-я получения инфо о карточки для удаления
function getDataForDelete(cardId, cardEl) {
  infoAboutDeleteCard.cardEl = cardEl;
  infoAboutDeleteCard.cardId = cardId;

  openModal(confirmPopup);
}

function renderAvatar(user) {
  profileTitle.textContent = user.name;
  profileDescription.textContent = user.about;
  profileAvatar.style.backgroundImage = `url("${user.avatar}")`;
}

// Открытие модального окна с изображением
function openImgPopup(cardData) {
  popupImage.setAttribute("src", cardData.link);
  popupImage.setAttribute("alt", cardData.name);
  popupCaption.textContent = cardData.name;

  openModal(imgPopup);
}

// ф-я лайка карточки с запросом
function likeCardToggle(cardData, cardEl, likeBtnEl) {
  if (checkIsLikedCard(likeBtnEl)) {
    removeLikeToCard(cardData._id)
      .then((unLikedCard) => {
        likeCard(cardEl, likeBtnEl, unLikedCard.likes.length);
      })
      .catch((err) => {
        console.warn(err);
      });
  } else {
    addLikeToCard(cardData._id)
      .then((likedCard) => {
        likeCard(cardEl, likeBtnEl, likedCard.likes.length);
      })
      .catch((err) => {
        console.warn(err);
      });
  }
}

// Слушатель на форму изменения аватара
function handleEditAvatarForm(evt) {
  evt.preventDefault();

  isLoading(true, editAvatarForm);

  updateAvatar(avatarInput.value)
    .then((avatarData) => {
      renderAvatar(avatarData);

      closeModal(avatarPopup);
      editAvatarForm.reset();
    })
    .catch((err) => {
      console.warn(err);
    })
    .finally(() => {
      isLoading(false, editAvatarForm);
    });
}

// Слушатель на форму редактирования для изменения профиля
function handleProfileEditForm(evt) {
  evt.preventDefault();

  const jobValue = jobInput.value;
  const nameValue = nameInput.value;

  isLoading(true, editform);

  updateProfile(nameValue, jobValue)
    .then((userData) => {
      renderAvatar(userData);

      closeModal(profilePopup);
      editform.reset();
    })
    .catch((err) => {
      console.warn(err);
    })
    .finally(() => {
      isLoading(false, editform);
    });
}

// Слушатель на форму добавления карточки
function handleAddCardForm(evt) {
  evt.preventDefault();

  const cardNameValue = cardNameInput.value;
  const cardLinkValue = cardLinkInput.value;

  isLoading(true, addCardform);

  addNewCard(cardNameValue, cardLinkValue)
    .then((newCardData) => {
      const newCard = createCard(
        newCardData,
        cardTemplate,
        likeCardToggle,
        openImgPopup,
        newCardData.owner._id,
        getDataForDelete
      );

      cardList.insertAdjacentElement("afterbegin", newCard);

      closeModal(addCardPopup);
      addCardform.reset();
    })
    .catch((err) => {
      console.warn(err);
    })
    .finally(() => {
      isLoading(false, addCardform);
    });
}

// Слушатель на форму подтверждения удаления карточки
function handleConfirmForm(evt) {
  evt.preventDefault();

  deleteCard(infoAboutDeleteCard.cardId)
    .then((deletedCard) => {
      console.log(deletedCard);

      removeCard(infoAboutDeleteCard.cardEl);

      closeModal(confirmPopup);
    })
    .catch((err) => {
      console.warn(err);
    });
}

// Слушатель событий для открыти модального окна, редактированя профиля
profileBtn.addEventListener("click", function () {
  clearValidation(editform, validationConfig);
  openModal(profilePopup);

  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
});

// Слушатель событий для открыти модального окна, добавления карточки
addCardBtn.addEventListener("click", function () {
  clearValidation(addCardform, validationConfig);
  openModal(addCardPopup);
});

// Слушатель клика по аватару
updateAvatarBtn.addEventListener("click", function () {
  clearValidation(editAvatarForm, validationConfig);
  openModal(avatarPopup);
});

// Слушатели на закрытие модалок, кнопка/оверлей
popups.forEach((popup) => {
  const closeBtn = popup.querySelector(".popup__close");
  closeBtn.addEventListener("click", function () {
    closeModal(popup);
  });

  popup.addEventListener("mousedown", function (evt) {
    if (evt.target === evt.currentTarget) {
      closeModal(popup);
    }
  });

  popup.classList.add("popup_is-animated");
});

editform.addEventListener("submit", handleProfileEditForm);
addCardform.addEventListener("submit", handleAddCardForm);
editAvatarForm.addEventListener("submit", handleEditAvatarForm);
confirmForm.addEventListener("submit", handleConfirmForm);

// Вывод карточек на страницу
function init() {
  enableValidation(validationConfig);

  skeleton.classList.add("show-skeleton");

  Promise.all([getUser(), getInitialCards()])
    .then((data) => {
      const [user, cards] = data;

      renderAvatar(user);

      cards.forEach((card) => {
        const cardItem = createCard(
          card,
          cardTemplate,
          likeCardToggle,
          openImgPopup,
          user._id,
          getDataForDelete
        );
        cardList.append(cardItem);
      });
    })
    .catch((err) => {
      console.warn(err);
    })
    .finally(() => {
      skeleton.classList.remove("show-skeleton");
    });
}

init();
