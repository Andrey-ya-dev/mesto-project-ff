const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-21",
  headers: {
    authorization: "2ecdb9de-ca58-4bca-ad56-e4a7fe09acb8",
    "Content-Type": "application/json",
  },
};

const Methods = {
  post: "POST", // Create
  get: "GET", // Read
  put: "PUT", // Update_full
  patch: "PATCH", // Update
  remove: "DELETE", // Delete
};

const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(`Ошибка : ${res.status}`);
};

export const getUser = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: Methods.get,
    headers: config.headers,
  }).then(handleResponse);
};

export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    method: Methods.get,
    headers: config.headers,
  }).then(handleResponse);
};

export const updateProfile = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: Methods.patch,
    headers: config.headers,
    body: JSON.stringify({
      name,
      about,
    }),
  }).then(handleResponse);
};

export const updateAvatar = (link) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: Methods.patch,
    headers: config.headers,
    body: JSON.stringify({
      avatar: link,
    }),
  }).then(handleResponse);
};

export const addNewCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: Methods.post,
    headers: config.headers,
    body: JSON.stringify({
      name,
      link,
    }),
  }).then(handleResponse);
};

export const removeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: Methods.remove,
    headers: config.headers,
  }).then(handleResponse);
};

export const addLikeToCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: Methods.put,
    headers: config.headers,
  }).then(handleResponse);
};

export const removeLikeToCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: Methods.remove,
    headers: config.headers,
  }).then(handleResponse);
};
