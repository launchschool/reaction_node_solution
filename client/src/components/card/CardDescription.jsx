import React, { useState } from "react";
import useInput from "../../hooks/useInput";

const CardDescription = (props) => {
  const {
    value: description,
    reset: resetDescription,
    bind: bindDescription,
  } = useInput(props.description || "");
  const [showForm, setShowForm] = useState(false);

  const handleCloseEditClick = () => {
    resetDescription();
    setShowForm(false);
  };

  const handleEditClick = () => {
    setShowForm(true);
  };

  const handleSaveDescription = () => {
    props.onUpdateCard(
      props.card._id,
      {
        description,
      },
      () => {
        setShowForm(false);
      }
    );
  };

  return (
    <form className="description">
      <p>Description</p>
      {showForm ? null : (
        <span id="description-edit" className="link" onClick={handleEditClick}>
          Edit
        </span>
      )}
      {showForm ? (
        <div>
          <textarea
            className="textarea-toggle"
            rows="1"
            {...bindDescription}
            autoFocus={true}
          ></textarea>
          <div>
            <div
              className="button"
              value="Save"
              onClick={handleSaveDescription}
            >
              Save
            </div>
            <i className="x-icon icon" onClick={handleCloseEditClick}></i>
          </div>
        </div>
      ) : (
        <p className="textarea-overlay">{description}</p>
      )}
    </form>
  );
};

export default CardDescription;
