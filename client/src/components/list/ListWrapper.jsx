import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import ListCards from "./ListCards";
import EditableListTitle from "./EditableListTitle";
import ToggleableAddCard from "./ToggleableAddCard";
import * as listSelectors from "../../selectors/listSelectors";
import * as actions from "../../actions/ListActions";
import calculatePosition from "../../lib/PositionCalculator";

const ListWrapper = (props) => {
  const state = useSelector((state) => state);

  const dispatch = useDispatch();

  const updateList = useCallback(
    (listId, position) => {
      dispatch(actions.updateList(listId, position));
    },
    [dispatch]
  );

  const handleDrop = useCallback(
    (e) => {
      const droppedEl = e.target;
      const listId = droppedEl.dataset.listId;
      const siblings = Array.prototype.slice.call(
        droppedEl.parentNode.childNodes
      );
      const lists = listSelectors.boardListsSelector(state.lists, props.boardId);
      const targetIndex = siblings.indexOf(droppedEl);
      const sortedStartingList = lists
        .slice()
        .sort((a, b) => a.position - b.position);
      const droppedList = sortedStartingList.find(
        (list) => list._id === listId
      );
      const sourceIndex = sortedStartingList.indexOf(droppedList);
      const newPosition = calculatePosition(lists, targetIndex, sourceIndex);
      updateList(props._id, { position: newPosition });
    },
    [props._id, props.boardId, state, updateList]
  );

  const classList = props.addCardActive
    ? "list-wrapper add-dropdown-active"
    : "list-wrapper";
  return (
    <div className={classList} data-list-id={props._id} onDrop={handleDrop}>
      <div className="list-background">
        <div className="list">
          <a className="more-icon sm-icon" href=""></a>
          <EditableListTitle listId={props._id} title={props.title} />
          <div className="add-dropdown add-top">
            <div className="card"></div>
            <a className="button">Add</a>
            <i className="x-icon icon"></i>
            <div className="add-options">
              <span>...</span>
            </div>
          </div>
          <ListCards listId={props._id} />
          <ToggleableAddCard
            listId={props._id}
            openedAddCard={props.addCardActive}
            onAddCardClick={props.onAddCardClick}
            onAddCardClose={props.onAddCardClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ListWrapper;
