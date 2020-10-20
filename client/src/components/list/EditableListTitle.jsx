import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import useInput from "../../hooks/useInput";
import * as actions from "../../actions/ListActions";

const EditableListTitle = (props) => {
  const { value: title, bind: bindTitle } = useInput(props.title || "");
  const [editing, setEditing] = useState(false);

  const dispatch = useDispatch();

  const updateTitle = useCallback(
    (title, callback) => {
      dispatch(actions.updateList(props.listId, { title }, callback));
    },
    [dispatch, props.listId]
  );

  const handleTitleClick = () => {
    setEditing(!editing);
  };

  const handleTitleUpdate = (e) => {
    updateTitle(title, setEditing(false));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
    }
  };

  return (
    <div>
      {editing ? (
        <input
          type="text"
          name="title"
          className="list-title"
          {...bindTitle}
          onKeyPress={handleKeyPress}
          onBlur={handleTitleUpdate}
          autoFocus
        />
      ) : (
        <p className="list-title" onClick={handleTitleClick}>
          {title}
        </p>
      )}
    </div>
  );
};

export default EditableListTitle;
