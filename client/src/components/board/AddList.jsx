import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import useInput from "../../hooks/useInput";
import * as actions from "../../actions/ListActions";
import calculatePosition from "../../lib/PositionCalculator";
import { boardListsSelector } from "../../selectors/listSelectors";

const AddList = (props) => {
  const [showForm, setShowForm] = useState(false);
  const { value: title, bind: bindTitle, reset: resetTitle } = useInput("");

  const dispatch = useDispatch();

  const boardId = props.boardId;

  const stateLists = useSelector((state) => state.lists);
  const lists = boardListsSelector(stateLists, boardId);

  const targetPosition = lists.length;

  const position = calculatePosition(lists, targetPosition);

  const submitList = useCallback(
    (title, boardId, position, callback) => {
      dispatch(actions.createList(boardId, title, position, callback));
    },
    [dispatch]
  );

  const handleInputClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowForm(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    submitList(title, boardId, position, resetState);
  };

  const resetState = () => {
    resetTitle();
    setShowForm(false);
  };

  let classes = ["new-list"];

  if (showForm) {
    classes.push("selected");
  }

  return (
    <div id="new-list" className={classes.join(" ")} onClick={handleInputClick}>
      <span>Add a list...</span>
      <input
        type="text"
        placeholder="Add a list..."
        name="title"
        {...bindTitle}
      />
      <div>
        <input
          type="submit"
          className="button"
          value="Save"
          onClick={handleSubmit}
        />
        <i type="button" className="x-icon icon" onClick={handleClose}></i>
      </div>
    </div>
  );
};

export default AddList;
