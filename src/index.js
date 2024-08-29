import "./pages/index.css";

import { createCard, removeCard, likeCard } from "./components/card";
import { closeModal, openModal, closeModalByPopup } from "./components/modal";
import { enableValidation, clearValidation } from "./scripts/validation";
import {
  addNewCard,
  getInitialCards,
  getUser,
  updateAvatar,
  updateProfile,
} from "./scripts/api";

export const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  errorMessageSelector: ".popup__err-msg",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

let userId = null;
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
export const confirmPopup = document.querySelector(".popup.popup_type_delete");
const confirmForm = confirmPopup.querySelector(".popup__form");

// Ф-я ошибки запроса
export function rejectResponse(err) {
  console.warn(err);
}

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

// Ф-я отрисовки аватара
function renderAvatar(user) {
  userId = user._id;

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

// Слушатель на форму изменения аватара
function handleEditAvatarForm(evt) {
  evt.preventDefault();

  if (avatarInput.value) {
    isLoading(true, editAvatarForm);

    updateAvatar(avatarInput.value)
      .then((avatarData) => {
        profileAvatar.style.backgroundImage = `url("${avatarData.avatar}")`;

        closeModal(avatarPopup);
        editAvatarForm.reset();
        clearValidation(editAvatarForm, validationConfig);
      })
      .catch(rejectResponse)
      .finally(() => {
        isLoading(false, editAvatarForm);
      });
  }
}

// Слушатель на форму редактирования для изменения профиля
function handleProfileEditForm(evt) {
  evt.preventDefault();

  const jobValue = jobInput.value;
  const nameValue = nameInput.value;

  if (jobValue && nameValue) {
    isLoading(true, editform);

    updateProfile(nameValue, jobValue)
      .then((userData) => {
        profileTitle.textContent = userData.name;
        profileDescription.textContent = userData.about;

        closeModal(profilePopup);
        editform.reset();
        clearValidation(editform, validationConfig);
      })
      .catch(rejectResponse)
      .finally(() => {
        isLoading(false, editform);
      });
  }
}

// Слушатель на форму добавления карточки
function handleAddCardForm(evt) {
  evt.preventDefault();

  const cardNameValue = cardNameInput.value;
  const cardLinkValue = cardLinkInput.value;

  if (cardLinkValue && cardNameValue) {
    isLoading(true, addCardform);

    addNewCard(cardNameValue, cardLinkValue)
      .then((newCardData) => {
        const newCard = createCard(
          newCardData,
          cardTemplate,
          likeCard,
          openImgPopup,
          userId,
          getDataForDelete
        );

        cardList.insertAdjacentElement("afterbegin", newCard);

        closeModal(addCardPopup);
        addCardform.reset();
        clearValidation(addCardform, validationConfig);
      })
      .catch(rejectResponse)
      .finally(() => {
        isLoading(false, addCardform);
      });
  }
}

// Слушатель на форму подтверждения удаления карточки
function handleConfirmForm(evt) {
  evt.preventDefault();

  removeCard(infoAboutDeleteCard.cardEl, infoAboutDeleteCard.cardId);
  closeModal(confirmPopup);
}

// Слушатели событий на модальных окнах
profilePopup.addEventListener("click", function (evt) {
  closeModalByPopup(evt, profilePopup, closeModal);
});
profilePopup.addEventListener("keydown", function (evt) {
  if (evt.key === "Escape") {
    closeModal(profilePopup);
    clearValidation(editform, validationConfig);
  }
});
addCardPopup.addEventListener("click", function (evt) {
  closeModalByPopup(evt, addCardPopup, closeModal);
});
imgPopup.addEventListener("click", function (evt) {
  closeModalByPopup(evt, imgPopup, closeModal);
});
avatarPopup.addEventListener("click", function (evt) {
  closeModalByPopup(evt, avatarPopup, closeModal);
});
confirmPopup.addEventListener("click", function (evt) {
  closeModalByPopup(evt, confirmPopup, closeModal);
});

// Слушатель событий для открыти модального окна, редактированя профиля
profileBtn.addEventListener("click", function () {
  const profileName = profileTitle.textContent;
  const profileJob = profileDescription.textContent;

  clearValidation(editform, validationConfig);
  openModal(profilePopup);

  nameInput.value = profileName;
  jobInput.value = profileJob;
});

// Слушатель событий для открыти модального окна, добавления карточки
addCardBtn.addEventListener("click", function () {
  openModal(addCardPopup);
});

// Слушатель клика по аватару
updateAvatarBtn.addEventListener("click", function () {
  openModal(avatarPopup);
});

editform.addEventListener("submit", handleProfileEditForm);
addCardform.addEventListener("submit", handleAddCardForm);
editAvatarForm.addEventListener("submit", handleEditAvatarForm);
confirmForm.addEventListener("submit", handleConfirmForm);

// Вывод карточек на страницу
document.addEventListener("DOMContentLoaded", function () {
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
          likeCard,
          openImgPopup,
          user._id,
          getDataForDelete
        );
        cardList.append(cardItem);
      });
    })
    .catch(rejectResponse)
    .finally(() => {
      skeleton.classList.remove("show-skeleton");
    });
});
