import "./pages/index.css";

import { initialCards } from "./scripts/cards";
import { createCard, removeCard, likeCard } from "./components/card";
import { closeModal, openModal, closeModalByPopup } from "./components/modal";

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

// Форма для добавления карточки и поля формы
const addCardform = document.querySelector(".popup_type_new-card .popup__form");
const cardNameInput = addCardform.querySelector(".popup__input_type_card-name");
const cardLinkInput = addCardform.querySelector(".popup__input_type_url");

// Кнопки для открытия модальных окон
const profileBtn = document.querySelector(".profile__edit-button");
const addCardBtn = document.querySelector(".profile__add-button");

// Модальные окна
const profilePopup = document.querySelector(".popup.popup_type_edit");
const addCardPopup = document.querySelector(".popup.popup_type_new-card");
const imgPopup = document.querySelector(".popup.popup_type_image");

// Слушатели событий на модальных окнах
profilePopup.addEventListener("click", function (evt) {
  closeModalByPopup(evt, profilePopup, closeModal);
});
addCardPopup.addEventListener("click", function (evt) {
  closeModalByPopup(evt, addCardPopup, closeModal);
});
imgPopup.addEventListener("click", function (evt) {
  closeModalByPopup(evt, imgPopup, closeModal);
});

// Слушатель событий для открыти модального окна, редактированя профиля
profileBtn.addEventListener("click", function () {
  const profileName = profileTitle.textContent;
  const profileJob = profileDescription.textContent;

  openModal(profilePopup);

  nameInput.value = profileName;
  jobInput.value = profileJob;
});
// Слушатель событий для открыти модального окна, добавления карточки
addCardBtn.addEventListener("click", function () {
  openModal(addCardPopup);
});

// Слушатель на форму редактирования для изменения профиля
function handleEditForm(evt) {
  evt.preventDefault();

  const jobValue = jobInput.value;
  const nameValue = nameInput.value;

  if (jobValue && nameValue) {
    document.querySelector(".profile__title").textContent = nameValue;
    document.querySelector(".profile__description").textContent = jobValue;

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
    initialCards.unshift(newCardData);
    const newCard = createCard(
      newCardData,
      cardTemplate,
      removeCard,
      likeCard,
      addListenerToImage
    );

    cardList.insertAdjacentElement("afterbegin", newCard);

    closeModal(addCardPopup);
    addCardform.reset();
  }
}

editform.addEventListener("submit", handleEditForm);
addCardform.addEventListener("submit", handleAddCardForm);

// Добавление слушателя для изображения
function addListenerToImage(imgEl, cardData) {
  imgEl.addEventListener("click", function () {
    console.log("img click atach");

    document.querySelector(".popup__image").setAttribute("src", cardData.link);
    document.querySelector(".popup__image").setAttribute("alt", cardData.name);
    document.querySelector(".popup__caption").textContent = cardData.name;

    openModal(imgPopup);
  });
}

// Вывод карточек на страницу
initialCards.forEach((item) => {
  const listItem = createCard(
    item,
    cardTemplate,
    removeCard,
    likeCard,
    addListenerToImage
  );
  cardList.append(listItem);
});
