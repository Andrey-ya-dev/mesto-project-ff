import "./pages/index.css";

import { createCard, removeCard, likeCard } from "./components/card";
import { closeModal, openModal, closeModalByPopup } from "./components/modal";
import { enableValidation, clearValidation } from "./scripts/validation";
import {
  addNewCard,
  checkLinkForAvatar,
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

const editAvatarForm = document.querySelector(
  ".popup_type_edit-avatar .popup__form"
);
const avatarInput = editAvatarForm.querySelector(".popup__input");

// Кнопки для открытия модальных окон
const profileBtn = document.querySelector(".profile__edit-button");
const addCardBtn = document.querySelector(".profile__add-button");
const updateAvatarBtn = document.querySelector(".profile__image-edit");

const checkAva = document.querySelector(".m-btn");
checkAva.addEventListener("click", function () {
  if (avatarInput.value) {
    imageExists(avatarInput.value)
      .then((res) => console.log(res))
      .catch(rejectResponse);
    // let req = new XMLHttpRequest();
    // req.open("HEAD", `${avatarInput.value}`, true);
    // req.onreadystatechange = () => {
    //   if (req.readyState === 4) {
    //     if (req.status === 200) {
    //       console.log("File exists");
    //     } else {
    //       console.log("File DOSE NOT exists");
    //     }
    //   }
    // };
    // req.send();
    checkLinkForAvatar(avatarInput.value)
      .then((res) => {
        if (res.status === 200) {
          console.log("HERE THIS");
          console.log("res ->>> ", res);
          console.log("res ->>> status", res.status);
          console.log("res ->>> headers", res.headers.get("content-type"));
        }
      })
      .catch(rejectResponse);
  }
});
function imageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(true));
    img.addEventListener("error", () => resolve(false));
    img.src = url;
    console.log(img, "----IMG----");
  });
}

// Модальные окна
const profilePopup = document.querySelector(".popup.popup_type_edit");
const addCardPopup = document.querySelector(".popup.popup_type_new-card");
const imgPopup = document.querySelector(".popup.popup_type_image");
const avatarPopup = document.querySelector(".popup.popup_type_edit-avatar");

export function rejectResponse(err) {
  console.log("ReJeCtEd ===>", err);
}

function isLoading(loading, formEl) {
  if (loading) {
    formEl.querySelector(".button").textContent = "Сохранение...";
  } else {
    formEl.querySelector(".button").textContent = "Сохранить";
  }
}

function renderAvatar(user) {
  userId = user._id;

  profileTitle.textContent = user.name;
  profileDescription.textContent = user.about;
  document.querySelector(
    ".profile__image"
  ).style.backgroundImage = `url("${user.avatar}")`;
}

// Открытие модального окна с изображением
function openImgPopup(cardData) {
  popupImage.setAttribute("src", cardData.link);
  popupImage.setAttribute("alt", cardData.name);
  popupCaption.textContent = cardData.name;

  openModal(imgPopup);
}

function handleEditAvatarForm(evt) {
  evt.preventDefault();

  if (avatarInput.value) {
    isLoading(true, editAvatarForm);

    updateAvatar(avatarInput.value)
      .then((avatarData) => {
        console.log(avatarData);

        document.querySelector(
          ".profile__image"
        ).style.backgroundImage = `url("${avatarData.avatar}")`;

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
        console.log(userData);

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
        console.log(newCardData);

        const newCard = createCard(
          newCardData,
          cardTemplate,
          removeCard,
          likeCard,
          openImgPopup,
          userId
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
editAvatarForm.addEventListener("submit", handleEditAvatarForm);

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
        const cardItem = createCard(
          card,
          cardTemplate,
          removeCard,
          likeCard,
          openImgPopup,
          userId
        );
        cardList.append(cardItem);
      });
    })
    .catch(rejectResponse);
});
