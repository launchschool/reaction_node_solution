import apiClient from "../lib/ApiClient";
import * as types from "../constants/ActionTypes";

export function createListRequest() {
  return { type: types.CREATE_LIST_REQUEST };
}

export function createListSuccess(list) {
  return { type: types.CREATE_LIST_SUCCESS, payload: { list } };
}

export function updateListRequest() {
  return { type: types.UPDATE_LIST_REQUEST };
}

export function updateListSuccess(listId, newList) {
  return {
    type: types.UPDATE_LIST_SUCCESS,
    payload: { listId, newList },
  };
}

export function createList(boardId, title, position, callback) {
  return function (dispatch) {
    dispatch(createListRequest());
    apiClient.createList(boardId, title, position, (data) => {
      dispatch(createListSuccess(data.list));
      if (callback) {
        callback(data.list);
      }
    });
  };
}

export function updateList(listId, list, callback) {
  return function (dispatch) {
    dispatch(updateListRequest());
    apiClient.updateList(listId, list, (data) => {
      dispatch(updateListSuccess(listId, data.list[0]));
      if (callback) {
        callback(data.list);
      }
    });
  };
}
