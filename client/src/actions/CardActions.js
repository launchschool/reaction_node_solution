import apiClient from "../lib/ApiClient";
import * as types from "../constants/ActionTypes";

export function createCardRequest() {
  return { type: types.CREATE_CARD_REQUEST };
}

export function createCardSuccess(card) {
  return { type: types.CREATE_CARD_SUCCESS, payload: { card } };
}

export function fetchCardRequest() {
  return { type: types.FETCH_CARD_REQUEST };
}

export function fetchCardSuccess(card) {
  return { type: types.FETCH_CARD_SUCCESS, payload: { card } };
}

export function createCard(listId, card, callback) {
  return function (dispatch) {
    dispatch(createCardRequest);
    apiClient.createCard(listId, card, (data) => {
      dispatch(createCardSuccess(data.card));
      if (callback) {
        callback(data.card);
      }
    });
  };
}

export function fetchCard(id, callback) {
  return function (dispatch) {
    dispatch(fetchCardRequest());
    apiClient.getCard(id, (data) => {
      dispatch(fetchCardSuccess(data.card));
      if (callback) {
        callback(data.card);
      }
    });
  };
}