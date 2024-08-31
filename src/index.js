import "./pages/index.css";

import { createCard, removeCard, likeCard } from "./components/card";
import { closeModal, openModal, closeModalByPopup } from "./components/modal";
import { enableValidation, clearValidation } from "./components/validation";
import {
  addNewCard,
  getInitialCards,
  getUser,
  updateAvatar,
  updateProfile,
  deleteCard,
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

// Выносить одну команду в отдельную функцию не имеет особого смысла.
// Если это заготовка на будущее, с планами развития функционала вывода ошибок, то такую функцию нужно передавать в параметры функций тех модулей, где она нужна
// Можно лучше:
// По правилам модульной системы, сами запросы на сервер так-же не должны выполняться в модуле card. Об этих принципах вы узнаете подробнее в следующем модуле. При корректной работе с модулями, запросы должны выполняться здесь же, в index.js, а из модуля card только использоваться функции непосредственного удаления карточки и управления разметкой сердечка и счетчика. тогда и необходимость импортов в модуль card отпадет❌🔥
// // Ф-я ошибки запроса
// export function rejectResponse(err) {
//   console.warn(err);
// }

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

// Здесь эта операция лишняя. При изменении данных профиля id пользователя не изменяется и пересохранять его не нужно
// Можно лучше:
// В данном приложении вообще переменная с id пользователя не нужна, все прекрасно выполняется без нее.
// Смотрите комментарии дальше по коду, если интересно узнать как❌🔥
// Ф-я отрисовки аватара
function renderAvatar(user) {
  // userId = user._id;🔥

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

  // if (avatarInput.value) {
  isLoading(true, editAvatarForm);

  updateAvatar(avatarInput.value)
    .then((avatarData) => {
      profileAvatar.style.backgroundImage = `url("${avatarData.avatar}")`;

      closeModal(avatarPopup);
      editAvatarForm.reset();
      // Очищать ошибки в обработчике сабмита не имеет смысла, их здесь не может быть, так как с ошибками сабмит невозможен.
      // Выполняйте эту функцию при открытии форм❌🔥
      // clearValidation(editAvatarForm, validationConfig);🔥
    })
    .catch((err) => {
      console.warn(err);
    })
    .finally(() => {
      isLoading(false, editAvatarForm);
    });
  // }
}

// Слушатель на форму редактирования для изменения профиля
function handleProfileEditForm(evt) {
  evt.preventDefault();

  const jobValue = jobInput.value;
  const nameValue = nameInput.value;
  // У вас есть отдельный модуль для валидации форм, дублировать проверку дополнительными условными конструкциями не имеет смысла❌🔥
  // if (jobValue && nameValue) {
  isLoading(true, editform);

  updateProfile(nameValue, jobValue)
    .then((userData) => {
      // Было бы лучше использовать уже созданную вами функцию renderAvatar
      // Иначе не понятен смысл ее создания, если она не переиспользуется.❌🔥
      // Функция это в первую очередь переиспользуемый блок кода.
      // profileTitle.textContent = userData.name;
      // profileDescription.textContent = userData.about;🔥
      console.log("avatar form ===>", userData);
      renderAvatar(userData);

      closeModal(profilePopup);
      editform.reset();
      // Очищать ошибки в обработчике сабмита не имеет смысла, их здесь не может быть, так как с ошибками сабмит невозможен.
      // Выполняйте эту функцию при открытии форм❌🔥
      // clearValidation(editform, validationConfig);🔥
    })
    .catch((err) => {
      console.warn(err);
    })
    .finally(() => {
      isLoading(false, editform);
    });
  // }
}

// Слушатель на форму добавления карточки
function handleAddCardForm(evt) {
  evt.preventDefault();

  const cardNameValue = cardNameInput.value;
  const cardLinkValue = cardLinkInput.value;

  // if (cardLinkValue && cardNameValue) {
  isLoading(true, addCardform);

  addNewCard(cardNameValue, cardLinkValue)
    .then((newCardData) => {
      // id пользователя можно получить из самого ответа сервера. Ведь при создании карточки из формы, ее создателем может быть только текущий пользователь.
      // newCardData.owner._id - это и есть id текущего пользователя❌🔥
      console.log("add new card ===>", newCardData);
      const newCard = createCard(
        newCardData,
        cardTemplate,
        likeCard,
        openImgPopup,
        newCardData.owner._id,
        getDataForDelete
      );

      cardList.insertAdjacentElement("afterbegin", newCard);

      closeModal(addCardPopup);
      addCardform.reset();
      // тоже самое❌🔥
      // clearValidation(addCardform, validationConfig);
    })
    .catch((err) => {
      console.warn(err);
    })
    .finally(() => {
      isLoading(false, addCardform);
    });
  // }
}

// Слушатель на форму подтверждения удаления карточки
function handleConfirmForm(evt) {
  evt.preventDefault();

  // Закрывать попап нужно в блоке then обработки запроса, чтобы в случае ошибки попап не закрылся
  // Можно лучше:
  // Сам запрос на сервер лучше выполнить здесь. Для этого у вас есть и id карточки и ссылка на саму карточку.
  // Выполните запрос, а в блоке then вызывайте функцию removeCard() из модуля card, в которую передайте ссылку на карточку и в функции только удалите ее❌🔥
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

// Слушатели событий на модальных окнах
profilePopup.addEventListener("click", function (evt) {
  closeModalByPopup(evt, profilePopup, closeModal);
});
// Слушатель клавиатуры у вас универсально устанавливается в модуле modal и дублировать его не нужно. Уберите все лишние установки слушателя Esc❌🔥
// profilePopup.addEventListener("keydown", function (evt) {
//   if (evt.key === "Escape") {
//     closeModal(profilePopup);
//     clearValidation(editform, validationConfig);
//   }
// });
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
  clearValidation(addCardform, validationConfig);
  openModal(addCardPopup);
});

// Слушатель клика по аватару
updateAvatarBtn.addEventListener("click", function () {
  clearValidation(editAvatarForm, validationConfig);
  openModal(avatarPopup);
});

editform.addEventListener("submit", handleProfileEditForm);
addCardform.addEventListener("submit", handleAddCardForm);
editAvatarForm.addEventListener("submit", handleEditAvatarForm);
confirmForm.addEventListener("submit", handleConfirmForm);

// Установка данного слушателя бессмысленна. просто выполните код в теле скрипта❌🔥
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
          likeCard,
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
