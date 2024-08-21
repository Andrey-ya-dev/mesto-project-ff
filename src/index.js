import "./pages/index.css";

import { createCard, removeCard, likeCard } from "./components/card";
import { closeModal, openModal, closeModalByPopup } from "./components/modal";
import { enableValidation, clearValidation } from "./scripts/validation";
import { addNewCard, getInitialCards, getUser } from "./scripts/api";

export const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  errorMessageSelector: ".popup__err-msg",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;

// Список карточке, контейнер
const cardList = document.querySelector(".places__list");

// Профиль и техтовые поля в нем имя, занятия
const profile = document.querySelector(".profile");
const profileTitle = profile.querySelector(".profile__title");
const profileDescription = profile.querySelector(".profile__description");

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

// Кнопки для открытия модальных окон
const profileBtn = document.querySelector(".profile__edit-button");
const addCardBtn = document.querySelector(".profile__add-button");
const updateAvatarBtn = document.querySelector(".profile__image-edit");

// Модальные окна
const profilePopup = document.querySelector(".popup.popup_type_edit");
const addCardPopup = document.querySelector(".popup.popup_type_new-card");
const imgPopup = document.querySelector(".popup.popup_type_image");
const avatarPopup = document.querySelector(".popup.popup_type_edit-avatar");

function rejectResponse(err) {
  console.log(err);
}

// Открытие модального окна с изображением
function openImgPopup(cardData) {
  popupImage.setAttribute("src", cardData.link);
  popupImage.setAttribute("alt", cardData.name);
  popupCaption.textContent = cardData.name;

  openModal(imgPopup);
}

// Слушатель на форму редактирования для изменения профиля
function handleProfileEditForm(evt) {
  evt.preventDefault();

  const jobValue = jobInput.value;
  const nameValue = nameInput.value;

  if (jobValue && nameValue) {
    profileTitle.textContent = nameValue;
    profileDescription.textContent = jobValue;

    clearValidation(editform, validationConfig);
    closeModal(profilePopup);
  }
}

// Слушатель на форму добавления карточки
function handleAddCardForm(evt) {
  evt.preventDefault();

  const cardNameValue = cardNameInput.value;
  const cardLinkValue = cardLinkInput.value;

  if (cardLinkValue && cardNameValue) {
    const newCardData = { name: cardNameValue, link: cardLinkValue };
    const newCard = createCard(
      newCardData,
      cardTemplate,
      removeCard,
      likeCard,
      openImgPopup
    );

    cardList.insertAdjacentElement("afterbegin", newCard);

    closeModal(addCardPopup);
    addCardform.reset();
    clearValidation(addCardform, validationConfig);

    addNewCard(cardNameValue, cardLinkValue)
      .then((data) => {
        console.log(data);
      })
      .catch(rejectResponse);
  }
}

// Слушатели событий на модальных окнах
profilePopup.addEventListener("click", function (evt) {
  closeModalByPopup(evt, profilePopup, closeModal);
});
profilePopup.addEventListener("keydown", function (evt) {
  if (evt.key === "Escape") {
    console.log("edit esc");
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

updateAvatarBtn.addEventListener("click", function () {
  openModal(avatarPopup);
});

editform.addEventListener("submit", handleProfileEditForm);
addCardform.addEventListener("submit", handleAddCardForm);

function renderAvatar(user) {
  profileTitle.textContent = user.name;
  profileDescription.textContent = user.about;
  document.querySelector(
    ".profile__image"
  ).style.backgroundImage = `url("${user.avatar}")`;
}

// Вывод карточек на страницу
document.addEventListener("DOMContentLoaded", function () {
  enableValidation(validationConfig);

  Promise.all([getUser(), getInitialCards()])
    .then((data) => {
      const [user, cardList] = data;

      renderAvatar(user);

      return cardList;
    })
    .then((cards) => {
      cards.forEach((card) => {
        const cardItem = createCard(card, cardTemplate);
        cardList.append(cardItem);
      });
    })
    .catch(rejectResponse);
});
